const Product = require("../models/Product");

// ============================================================
// FETCH / ABORT CONTROLLER COMPATIBILITY
// ============================================================

let fetchImpl =
  typeof globalThis.fetch === "function"
    ? globalThis.fetch.bind(globalThis)
    : null;

let AbortControllerImpl =
  typeof globalThis.AbortController === "function"
    ? globalThis.AbortController
    : null;

// Fallback for older Node.js versions
if (!fetchImpl) {
  try {
    const nodeFetch = require("node-fetch");

    fetchImpl =
      typeof nodeFetch === "function"
        ? nodeFetch
        : nodeFetch.default;

    console.log("[ImageJob] Using node-fetch polyfill");
  } catch (error) {
    console.warn(
      "[ImageJob] node-fetch is not available:",
      error.message || error
    );
  }
}

if (!AbortControllerImpl) {
  try {
    AbortControllerImpl = require("abort-controller");

    console.log(
      "[ImageJob] Using abort-controller polyfill"
    );
  } catch (error) {
    console.warn(
      "[ImageJob] abort-controller is not available:",
      error.message || error
    );
  }
}

// ============================================================
// JOB LOCK
// ============================================================

let imageJobRunning = false;

// ============================================================
// CONFIGURATION
// ============================================================

const BATCH_SIZE = Math.max(
  1,
  Number(process.env.IMAGE_JOB_BATCH_SIZE) || 5
);

// Lower concurrency to avoid Open Food Facts 503
const CONCURRENCY = Math.max(
  1,
  Number(process.env.IMAGE_JOB_CONCURRENCY) || 2
);

const DELAY_MS = Math.max(
  0,
  Number(process.env.IMAGE_JOB_DELAY_MS) || 800
);

const REQUEST_TIMEOUT_MS = Math.max(
  1000,
  Number(process.env.IMAGE_JOB_REQUEST_TIMEOUT_MS) || 12000
);

const MAX_RETRIES = Math.max(
  0,
  Number(process.env.IMAGE_JOB_MAX_RETRIES) || 2
);

// Safety limit per single run
const MAX_PRODUCTS_PER_RUN = Math.max(
  1,
  Number(process.env.IMAGE_JOB_MAX_PRODUCTS_PER_RUN) || 500
);

const USER_AGENT =
  `GroceryHub/1.0 (contact: ${
    process.env.IMAGE_JOB_CONTACT_EMAIL ||
    "admin@groceryhub.local"
  })`;

const OFF_BASE_URL =
  "https://world.openfoodfacts.org";

// ============================================================
// HELPERS
// ============================================================

const sleep = (ms) =>
  new Promise((resolve) => setTimeout(resolve, ms));

const normalizeText = (value) =>
  String(value || "")
    .trim()
    .toLowerCase()
    .replace(/\s+/g, " ");

const isValidHttpUrl = (value) => {
  if (!value || typeof value !== "string") {
    return false;
  }

  return /^https?:\/\//i.test(value.trim());
};

// ============================================================
// BUILD SEARCH NAME
// Prevent:
// Fortune Fortune Moong Dal
// BB BB Royal Basmati Rice
// ============================================================

function buildSearchName(name, brand) {
  const cleanName = String(name || "").trim();
  const cleanBrand = String(brand || "").trim();

  if (!cleanName) {
    return cleanBrand;
  }

  if (!cleanBrand) {
    return cleanName;
  }

  const nameLower = normalizeText(cleanName);
  const brandLower = normalizeText(cleanBrand);

  // Name already starts with brand
  if (
    nameLower === brandLower ||
    nameLower.startsWith(`${brandLower} `)
  ) {
    return cleanName;
  }

  return `${cleanBrand} ${cleanName}`;
}

// ============================================================
// MISSING IMAGE FILTER
// ============================================================

const getMissingImageFilter = () => ({
  $or: [
    {
      image: {
        $exists: false,
      },
    },
    {
      image: null,
    },
    {
      image: "",
    },
  ],
});

// ============================================================
// FETCH WITH TIMEOUT
// ============================================================

async function fetchWithTimeout(
  url,
  options = {},
  timeout = REQUEST_TIMEOUT_MS
) {
  if (!fetchImpl) {
    throw new Error(
      "Fetch is not available in this Node.js runtime."
    );
  }

  if (!AbortControllerImpl) {
    throw new Error(
      "AbortController is not available in this Node.js runtime."
    );
  }

  const controller = new AbortControllerImpl();

  const timeoutId = setTimeout(() => {
    try {
      controller.abort();
    } catch (error) {
      // Ignore abort error
    }
  }, timeout);

  try {
    const response = await fetchImpl(url, {
      ...options,
      signal: controller.signal,
      headers: {
        Accept: "application/json",
        "User-Agent": USER_AGENT,
        ...(options.headers || {}),
      },
    });

    return response;
  } finally {
    clearTimeout(timeoutId);
  }
}

// ============================================================
// BARCODE LOOKUP
// ============================================================

async function fetchImageByBarcode(
  barcode,
  productName
) {
  const cleanBarcode = String(barcode || "").trim();

  if (!cleanBarcode) {
    return null;
  }

  const url =
    `${OFF_BASE_URL}/api/v2/product/` +
    `${encodeURIComponent(cleanBarcode)}` +
    `.json?fields=code,product_name,brands,image_front_url`;

  console.log(
    `[ImageJob] Barcode lookup: ${productName} | barcode=${cleanBarcode}`
  );

  const response = await fetchWithTimeout(url);

  console.log(
    `[ImageJob] API status (barcode): ${response.status} ${response.statusText}`
  );

  // Retry-worthy
  if (
    response.status === 429 ||
    response.status >= 500
  ) {
    throw new Error(
      `Open Food Facts barcode API returned ${response.status}`
    );
  }

  if (!response.ok) {
    return null;
  }

  const data = await response.json();

  const found = data?.product;

  if (!found) {
    console.log(
      `[ImageJob] Barcode product not found: ${cleanBarcode}`
    );

    return null;
  }

  const imageUrl =
    found.image_front_url || null;

  console.log(
    `[ImageJob] Barcode product found: ${
      found.product_name || "-"
    }`
  );

  console.log(
    `[ImageJob] Barcode image: ${
      imageUrl || "(none)"
    }`
  );

  if (isValidHttpUrl(imageUrl)) {
    return imageUrl.trim();
  }

  return null;
}

// ============================================================
// NAME + BRAND SEARCH
// ============================================================

async function searchImageByName(product) {
  const productName =
    String(product.name || "").trim();

  const brand =
    String(product.brand || "").trim();

  const searchText = buildSearchName(
    productName,
    brand
  );

  if (!searchText) {
    return null;
  }

  const url =
    `${OFF_BASE_URL}/cgi/search.pl` +
    `?search_terms=${encodeURIComponent(searchText)}` +
    `&search_simple=1` +
    `&action=process` +
    `&json=1` +
    `&page_size=10` +
    `&fields=product_name,brands,image_front_url,code`;

  console.log(
    `[ImageJob] Name search: ${searchText}`
  );

  const response = await fetchWithTimeout(url);

  console.log(
    `[ImageJob] API status (search): ${response.status} ${response.statusText}`
  );

  // Retry-worthy
  if (
    response.status === 429 ||
    response.status >= 500
  ) {
    throw new Error(
      `Open Food Facts search API returned ${response.status}`
    );
  }

  if (!response.ok) {
    return null;
  }

  const data = await response.json();

  const candidates = Array.isArray(
    data?.products
  )
    ? data.products
    : [];

  console.log(
    `[ImageJob] Candidates returned: ${candidates.length}`
  );

  if (!candidates.length) {
    return null;
  }

  const lowerName =
    normalizeText(product.name);

  const lowerBrand =
    normalizeText(product.brand);

  // Product name tokens
  const nameTokens = lowerName
    .split(/\s+/)
    .filter(
      (token) => token.length >= 3
    );

  // ==========================================================
  // SCORE CANDIDATES
  // ==========================================================

  const scoredCandidates = candidates
    .map((candidate) => {
      const candidateName =
        normalizeText(
          candidate.product_name
        );

      const candidateBrand =
        normalizeText(
          candidate.brands
        );

      const imageUrl =
        candidate.image_front_url || null;

      if (!isValidHttpUrl(imageUrl)) {
        return null;
      }

      let score = 0;

      // --------------------------------------------------------
      // BRAND MATCH
      // --------------------------------------------------------

      if (
        lowerBrand &&
        candidateBrand
      ) {
        if (
          candidateBrand === lowerBrand
        ) {
          score += 50;
        } else if (
          candidateBrand.includes(
            lowerBrand
          ) ||
          lowerBrand.includes(
            candidateBrand
          )
        ) {
          score += 35;
        }
      }

      // --------------------------------------------------------
      // EXACT PRODUCT NAME
      // --------------------------------------------------------

      if (
        lowerName &&
        candidateName
      ) {
        if (
          candidateName === lowerName
        ) {
          score += 60;
        } else if (
          candidateName.includes(
            lowerName
          ) ||
          lowerName.includes(
            candidateName
          )
        ) {
          score += 40;
        }
      }

      // --------------------------------------------------------
      // TOKEN MATCHING
      // --------------------------------------------------------

      if (
        nameTokens.length &&
        candidateName
      ) {
        let matchedTokens = 0;

        for (const token of nameTokens) {
          if (
            candidateName.includes(token)
          ) {
            matchedTokens++;
          }
        }

        score += matchedTokens * 5;
      }

      return {
        candidate,
        imageUrl: imageUrl.trim(),
        score,
      };
    })
    .filter(Boolean)
    .sort(
      (a, b) => b.score - a.score
    );

  if (!scoredCandidates.length) {
    return null;
  }

  const best =
    scoredCandidates[0];

  console.log(
    `[ImageJob] Best candidate: ${
      best.candidate.product_name || "-"
    } | brand=${
      best.candidate.brands || "-"
    } | score=${best.score}`
  );

  // Avoid random unrelated images
  if (best.score < 10) {
    console.log(
      `[ImageJob] Match rejected for ${product.name} because score is too low.`
    );

    return null;
  }

  return best.imageUrl;
}

// ============================================================
// FETCH IMAGE FOR ONE PRODUCT
// ============================================================

async function fetchImageForProduct(product) {
  console.log(
    `[ImageJob] Searching: ${product.name}`
  );

  // ==========================================================
  // 1. BARCODE FIRST
  // ==========================================================

  if (product.barcode) {
    try {
      const barcodeImage =
        await fetchImageByBarcode(
          product.barcode,
          product.name
        );

      if (barcodeImage) {
        console.log(
          `[ImageJob] Barcode image found for: ${product.name}`
        );

        return barcodeImage;
      }
    } catch (error) {
      console.warn(
        `[ImageJob] Barcode lookup failed for ${product.name}:`,
        error.message || error
      );

      // Continue to name search
    }
  }

  // ==========================================================
  // 2. NAME + BRAND FALLBACK
  // ==========================================================

  try {
    const searchImage =
      await searchImageByName(product);

    if (searchImage) {
      console.log(
        `[ImageJob] Search image found for: ${product.name}`
      );

      return searchImage;
    }
  } catch (error) {
    console.warn(
      `[ImageJob] Name search failed for ${product.name}:`,
      error.message || error
    );

    throw error;
  }

  console.log(
    `[ImageJob] No reliable image found for: ${product.name}`
  );

  return null;
}

// ============================================================
// RETRIES
// ============================================================

async function fetchImageWithRetries(product) {
  let attempt = 0;

  while (
    attempt <= MAX_RETRIES
  ) {
    try {
      return await fetchImageForProduct(
        product
      );
    } catch (error) {
      attempt++;

      console.warn(
        `[ImageJob] Attempt ${attempt}/${MAX_RETRIES + 1} failed for ${product.name}:`,
        error.message || error
      );

      if (
        attempt > MAX_RETRIES
      ) {
        throw error;
      }

      // 1 sec, 2 sec, 3 sec...
      const backoff =
        1000 * attempt;

      console.log(
        `[ImageJob] Waiting ${backoff}ms before retry: ${product.name}`
      );

      await sleep(backoff);
    }
  }

  return null;
}

// ============================================================
// SAVE IMAGE
// ============================================================

async function saveProductImage(
  product,
  imageUrl
) {
  if (!imageUrl) {
    return false;
  }

  if (!isValidHttpUrl(imageUrl)) {
    console.warn(
      `[ImageJob] Invalid image URL for ${product.name}`
    );

    return false;
  }

  const cleanImageUrl =
    imageUrl.trim();

  // IMPORTANT:
  // Only image + images are modified.
  //
  // Existing image is NEVER overwritten.
  const result =
    await Product.updateOne(
      {
        _id: product._id,

        $or: [
          {
            image: {
              $exists: false,
            },
          },
          {
            image: null,
          },
          {
            image: "",
          },
        ],
      },
      {
        $set: {
          image: cleanImageUrl,
          images: [cleanImageUrl],
        },
      }
    );

  return (
    result.modifiedCount > 0
  );
}

// ============================================================
// PROCESS BATCH
// ============================================================

async function processBatch(
  products,
  stats
) {
  let currentIndex = 0;

  const workerCount =
    Math.min(
      CONCURRENCY,
      products.length
    );

  const workers =
    Array.from(
      {
        length: workerCount,
      },
      () =>
        (async () => {
          while (true) {
            const index =
              currentIndex++;

            if (
              index >=
              products.length
            ) {
              return;
            }

            const product =
              products[index];

            try {
              const imageUrl =
                await fetchImageWithRetries(
                  product
                );

              stats.processed++;

              if (imageUrl) {
                const updated =
                  await saveProductImage(
                    product,
                    imageUrl
                  );

                if (updated) {
                  stats.updated++;

                  console.log(
                    `[ImageJob] Image saved: ${product.name}`
                  );
                } else {
                  console.log(
                    `[ImageJob] Image found but product was already updated: ${product.name}`
                  );
                }
              } else {
                stats.notFound++;

                console.log(
                  `[ImageJob] Image not found: ${product.name}`
                );
              }
            } catch (error) {
              stats.failed++;

              stats.processed++;

              console.error(
                `[ImageJob] Failed: ${product.name}:`,
                error.message || error
              );
            }

            if (DELAY_MS > 0) {
              await sleep(
                DELAY_MS
              );
            }
          }
        })()
    );

  await Promise.all(
    workers
  );
}

// ============================================================
// START IMAGE JOB
// ============================================================

async function startProductImageJob() {
  // ==========================================================
  // PREVENT DUPLICATE JOB
  // ==========================================================

  if (imageJobRunning) {
    console.log(
      "[ImageJob] Job already running - skipping start."
    );

    return {
      started: false,
      reason: "already-running",
    };
  }

  // ==========================================================
  // RUNTIME CHECK
  // ==========================================================

  if (!fetchImpl) {
    console.error(
      "[ImageJob] Fetch is unavailable."
    );

    return {
      started: false,
      reason: "no-fetch",
    };
  }

  if (!AbortControllerImpl) {
    console.error(
      "[ImageJob] AbortController is unavailable."
    );

    return {
      started: false,
      reason: "no-abort-controller",
    };
  }

  imageJobRunning = true;

  console.log(
    "================================================"
  );

  console.log(
    "[ImageJob] Product image job STARTED"
  );

  console.log(
    `[ImageJob] Batch size: ${BATCH_SIZE}`
  );

  console.log(
    `[ImageJob] Concurrency: ${CONCURRENCY}`
  );

  console.log(
    `[ImageJob] Delay: ${DELAY_MS}ms`
  );

  console.log(
    `[ImageJob] Timeout: ${REQUEST_TIMEOUT_MS}ms`
  );

  console.log(
    `[ImageJob] Max retries: ${MAX_RETRIES}`
  );

  console.log(
    `[ImageJob] Max products/run: ${MAX_PRODUCTS_PER_RUN}`
  );

  console.log(
    "================================================"
  );

  const stats = {
    processed: 0,
    updated: 0,
    notFound: 0,
    failed: 0,
  };

  try {
    // ========================================================
    // ONE-TIME PRODUCT SNAPSHOT
    // ========================================================
    //
    // IMPORTANT:
    // MongoDB is queried ONLY ONCE.
    //
    // Failed products remain in DB without image,
    // but they will NOT be selected again in this run.
    // ========================================================

    const products =
      await Product.find(
        getMissingImageFilter()
      )
        .select(
          "_id name brand barcode image images"
        )
        .limit(
          MAX_PRODUCTS_PER_RUN
        )
        .lean();

    console.log(
      `[ImageJob] Products selected for this run: ${products.length}`
    );

    if (!products.length) {
      console.log(
        "[ImageJob] No products need images."
      );

      return stats;
    }

    // ========================================================
    // CREATE FIXED BATCHES
    // ========================================================

    const totalBatches =
      Math.ceil(
        products.length /
          BATCH_SIZE
      );

    console.log(
      `[ImageJob] Total batches: ${totalBatches}`
    );

    // ========================================================
    // PROCESS FIXED LIST
    // ========================================================

    for (
      let i = 0;
      i < products.length;
      i += BATCH_SIZE
    ) {
      const batch =
        products.slice(
          i,
          i + BATCH_SIZE
        );

      const batchNumber =
        Math.floor(
          i / BATCH_SIZE
        ) + 1;

      console.log(
        `[ImageJob] Processing batch ${batchNumber}/${totalBatches} (${batch.length} products)`
      );

      await processBatch(
        batch,
        stats
      );

      // Pause between batches
      if (
        DELAY_MS > 0 &&
        i + BATCH_SIZE <
          products.length
      ) {
        await sleep(1000);
      }
    }

    // ========================================================
    // COMPLETED
    // ========================================================

    console.log(
      "================================================"
    );

    console.log(
      "[ImageJob] COMPLETED"
    );

    console.log(
      `[ImageJob] Processed: ${stats.processed}`
    );

    console.log(
      `[ImageJob] Updated: ${stats.updated}`
    );

    console.log(
      `[ImageJob] Not found: ${stats.notFound}`
    );

    console.log(
      `[ImageJob] Failed: ${stats.failed}`
    );

    console.log(
      "================================================"
    );

    return stats;
  } catch (error) {
    console.error(
      "[ImageJob] Fatal job error:",
      error
    );

    throw error;
  } finally {
    imageJobRunning = false;

    console.log(
      "[ImageJob] Job lock released."
    );
  }
}

// ============================================================
// EXPORT
// ============================================================

module.exports = {
  startProductImageJob,
};