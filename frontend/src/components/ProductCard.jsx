import { FiMinus, FiPlus, FiClock, FiHeart, FiStar, FiShoppingBag } from "react-icons/fi";
import { useState } from "react";
import { useCart } from "../Context/context";

const ProductCard = ({ product }) => {
  const { cart, addToCart, increaseQty, decreaseQty } = useCart();

  const [isHovered, setIsHovered] = useState(false);
  const [isWishlisted, setIsWishlisted] = useState(false);

  // ============================
  // PRODUCT ID
  // ============================
  const productId = product._id || product.id;

  // ============================
  // CART ITEM
  // ============================
  const cartItem = cart.find((item) => item.id === productId);

  const cartItemId =
    cartItem?.productId || cartItem?.id || productId;

  const qty = cartItem ? cartItem.qty : 0;

  // ============================
  // PRODUCT IMAGE
  // ============================
  const image =
    product.image ||
    product.img ||
    "https://via.placeholder.com/150";

  // ============================
  // PRICE
  // ============================
  const price = Number(product.price || 0);

// Use only actual MRP from database
const mrp = Number(product.mrp || 0);

const discount =
  mrp > price
    ? Math.round(((mrp - price) / mrp) * 100)
    : 0;

  // ============================
  // WEIGHT FORMAT
  // ============================
  const formatWeight = (weight, unit) => {
    if (
      weight === undefined ||
      weight === null ||
      weight === ""
    ) {
      return "";
    }

    const weightText = String(weight).trim();

    // Already contains unit
    if (/[a-zA-Z]/.test(weightText)) {
      return weightText;
    }

    return unit
      ? `${weightText} ${unit}`
      : weightText;
  };

  const weightLabel = formatWeight(
    product.weight,
    product.unit
  );

  // ============================
  // WISHLIST
  // ============================
  const handleWishlist = (e) => {
    e.stopPropagation();
    setIsWishlisted((previous) => !previous);
  };

  // ============================
  // ADD TO CART
  // ============================
  const handleAddToCart = (e) => {
    e.stopPropagation();
    addToCart(product);
  };

  // ============================
  // INCREASE
  // ============================
  const handleIncrease = (e) => {
    e.stopPropagation();
    increaseQty(cartItemId);
  };

  // ============================
  // DECREASE
  // ============================
  const handleDecrease = (e) => {
    e.stopPropagation();
    decreaseQty(cartItemId);
  };

  return (
    <div
      className="
        group
        relative
        overflow-hidden
        rounded-2xl
        bg-white
        shadow-[0_2px_8px_rgba(0,0,0,0.06)]
        transition-all
        duration-300
        hover:-translate-y-1
        hover:shadow-[0_12px_30px_rgba(0,0,0,0.12)]
      "
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* =====================================================
          DISCOUNT BADGE
      ===================================================== */}
     {discount > 0 && (
  <div
    className="
      absolute
      left-3
      top-3
      z-20
      rounded-full
      bg-gradient-to-r
      from-red-500
      to-red-600
      px-2.5
      py-0.5
      text-[9px]
      font-extrabold
      tracking-wide
      text-white
      shadow-lg
      shadow-red-500/30
      animate-pulse
    "
  >
    {discount}% OFF
  </div>
)}

      {/* =====================================================
          WISHLIST
      ===================================================== */}
      <button
        type="button"
        onClick={handleWishlist}
        aria-label="Add to wishlist"
        className="
          absolute
          right-3
          top-3
          z-20
          grid
          h-8
          w-8
          place-items-center
          rounded-full
          bg-white/90
          shadow-md
          backdrop-blur-sm
          transition-all
          duration-200
          hover:scale-110
          hover:shadow-lg
        "
      >
        <FiHeart
          className={`text-[15px] transition-all duration-200 ${
            isWishlisted
              ? "fill-red-500 text-red-500 scale-110"
              : "text-gray-500 hover:text-red-400"
          }`}
        />
      </button>

      {/* =====================================================
          PRODUCT IMAGE
      ===================================================== */}
      <div
        className="
          relative
          flex
          h-[150px]
          items-center
          justify-center
          overflow-hidden
          bg-gradient-to-b
          from-gray-50
          to-gray-100/50
          p-4
        "
      >
        <img
          src={image}
          alt={product.name}
          className="
            h-full
            w-full
            object-contain
            transition-transform
            duration-500
            group-hover:scale-110
          "
        />

        {/* =================================================
            QUICK ADD OVERLAY
        ================================================= */}
        {qty === 0 && (
          <div
            className={`
              absolute
              inset-0
              flex
              items-center
              justify-center
              bg-black/30
              backdrop-blur-[2px]
              transition-all
              duration-300
              ${
                isHovered
                  ? "opacity-100"
                  : "pointer-events-none opacity-0"
              }
            `}
          >
            <button
              type="button"
              onClick={handleAddToCart}
              className="
                rounded-full
                bg-white
                px-5
                py-2.5
                text-xs
                font-bold
                text-emerald-600
                shadow-xl
                transition-all
                duration-200
                hover:scale-105
                hover:bg-emerald-50
                active:scale-95
                flex
                items-center
                gap-2
              "
            >
              <FiShoppingBag className="text-sm" />
              Quick Add
            </button>
          </div>
        )}
      </div>

      {/* =====================================================
          PRODUCT INFORMATION
      ===================================================== */}
      <div className="p-3 pt-2.5">

        {/* =================================================
            PRODUCT NAME
        ================================================= */}
        <h4
          className="
            line-clamp-2
            min-h-[36px]
            text-[13px]
            font-semibold
            leading-[18px]
            text-gray-800
            group-hover:text-emerald-700
            transition-colors
          "
        >
          {product.name}
        </h4>

        {/* =================================================
            WEIGHT + ORGANIC + RATING
        ================================================= */}
        <div className="mt-1.5 flex flex-wrap items-center gap-2">

          {weightLabel && (
            <span
              className="
                text-[10px]
                font-medium
                text-gray-400
              "
            >
              {weightLabel}
            </span>
          )}

          {product.isOrganic && (
            <span
              className="
                rounded-full
                border
                border-emerald-200
                bg-emerald-50
                px-2
                py-0.5
                text-[8px]
                font-bold
                uppercase
                tracking-wider
                text-emerald-600
              "
            >
              Organic
            </span>
          )}

          {product.rating > 0 && (
            <div className="flex items-center gap-0.5 rounded-full bg-amber-50 px-1.5 py-0.5 border border-amber-200/50">
              <FiStar className="fill-amber-500 text-[9px] text-amber-500" />
              <span className="text-[9px] font-bold text-amber-700">
                {Number(product.rating || 0).toFixed(1)}
              </span>
            </div>
          )}
        </div>

        {/* =================================================
            PRICE
        ================================================= */}
        <div className="mt-2 flex items-end gap-2">

          <p
            className="
              text-[17px]
              font-extrabold
              leading-none
              text-gray-900
            "
          >
            ₹{price.toFixed(2)}
          </p>

          {mrp > price && (
            <p
              className="
                text-[11px]
                font-medium
                leading-none
                text-gray-400
                line-through
              "
            >
              ₹{mrp.toFixed(2)}
            </p>
          )}
        </div>

        {/* =================================================
            ADD TO CART / QUANTITY
        ================================================= */}
        <div className="mt-3">

          {qty === 0 ? (

            <button
              type="button"
              onClick={handleAddToCart}
              className="
                flex
                h-9
                w-full
                items-center
                justify-center
                gap-2
                rounded-xl
                bg-gradient-to-r
                from-emerald-500
                to-emerald-600
                text-xs
                font-bold
                text-white
                shadow-sm
                shadow-emerald-200/50
                transition-all
                duration-200
                hover:from-emerald-600
                hover:to-emerald-700
                hover:shadow-md
                hover:shadow-emerald-200/70
                active:scale-95
              "
            >
              <FiShoppingBag className="text-sm" />
              ADD TO CART
            </button>

          ) : (

            <div
              className="
                flex
                h-9
                items-center
                justify-between
                rounded-xl
                bg-emerald-50
                border
                border-emerald-200
                p-1
                shadow-inner
              "
            >

              {/* MINUS */}
              <button
                type="button"
                onClick={handleDecrease}
                className="
                  grid
                  h-7
                  w-7
                  place-items-center
                  rounded-lg
                  bg-white
                  text-emerald-600
                  shadow-sm
                  transition-all
                  duration-200
                  hover:bg-emerald-100
                  hover:shadow-md
                  active:scale-90
                "
              >
                <FiMinus className="text-sm" />
              </button>

              {/* QUANTITY */}
              <span
                className="
                  min-w-[24px]
                  text-center
                  text-sm
                  font-extrabold
                  text-emerald-700
                "
              >
                {qty}
              </span>

              {/* PLUS */}
              <button
                type="button"
                onClick={handleIncrease}
                className="
                  grid
                  h-7
                  w-7
                  place-items-center
                  rounded-lg
                  bg-emerald-600
                  text-white
                  shadow-sm
                  transition-all
                  duration-200
                  hover:bg-emerald-700
                  hover:shadow-md
                  active:scale-90
                "
              >
                <FiPlus className="text-sm" />
              </button>

            </div>
          )}
        </div>

        {/* =================================================
            DELIVERY TIME
        ================================================= */}
        <div
          className="
            mt-2.5
            flex
            items-center
            gap-1.5
            text-[9px]
            font-medium
            text-gray-400
          "
        >
          <FiClock className="text-[11px] text-emerald-500" />

          <span>
            Delivery in 10–15 min
          </span>
        </div>

      </div>
    </div>
  );
};

export default ProductCard;