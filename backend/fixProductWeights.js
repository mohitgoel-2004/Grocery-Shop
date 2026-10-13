const dns = require("dns");
dns.setServers(["8.8.8.8", "1.1.1.1"]);

const mongoose = require("mongoose");
require("dotenv").config();

async function fixProductWeights() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("Connected to MongoDB");

    // Raw collection use kar rahe hain, taaki schema casting
    // se pehle existing database values read ho saken.
    const products = mongoose.connection.db.collection("products");
    const total = await products.countDocuments();

const stringWeights = await products.countDocuments({
  weight: { $type: "string" },
});

const matchingWeight = await products.countDocuments({
  weight: "60 g",
});

console.log("Total products:", total);
console.log("String weights:", stringWeights);
console.log('Products with weight "60 g":', matchingWeight);

    const cursor = products.find({
      weight: { $type: "string" },
    });

    let fixed = 0;
    let skipped = 0;

    for await (const product of cursor) {
      const value = product.weight.trim();

      const match = value.match(
        /^(\d+(?:\.\d+)?)\s*(kg|g|gm|ml|mL|l|L|pcs|pack|box)$/i
      );

      if (!match) {
        console.log("Skipped:", product.name, "weight:", value);
        skipped++;
        continue;
      }

      const weight = Number(match[1]);
      let unit = match[2];

      // Normalize units to match Product.js enum
      const normalized = unit.toLowerCase();

      if (normalized === "gm") unit = "gm";
      else if (normalized === "g") unit = "g";
      else if (normalized === "kg") unit = "kg";
      else if (normalized === "ml") unit = "mL";
      else if (normalized === "l") unit = "L";
      else if (normalized === "pcs") unit = "pcs";
      else if (normalized === "pack") unit = "pack";
      else if (normalized === "box") unit = "box";

      await products.updateOne(
        { _id: product._id },
        { $set: { weight, unit } }
      );

      fixed++;
      console.log("Fixed:", product.name, "=>", weight, unit);
    }

    console.log(`Finished. Fixed: ${fixed}, skipped: ${skipped}`);
  } catch (error) {
    console.error("Migration failed:", error.message);
  } finally {
    await mongoose.disconnect();
  }
}

fixProductWeights();
