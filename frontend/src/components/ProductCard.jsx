import { FiMinus, FiPlus, FiStar } from "react-icons/fi";
import { useCart } from "../Context/context";

const ProductCard = ({ product }) => {
  const { cart, addToCart, increaseQty, decreaseQty } = useCart();

  const productId = product._id || product.id;
  const cartItem = cart.find((item) => item.id === productId);
  const cartItemId = cartItem?.productId || cartItem?.id || productId;
  const qty = cartItem ? cartItem.qty : 0;
  const image = product.image || product.img || "https://via.placeholder.com/150";
  const price = Number(product.price || 0);

  const formatWeight = (weight, unit) => {
    if (weight === undefined || weight === null || weight === "") {
      return "";
    }

    const weightText = String(weight).trim();

    if (/[a-zA-Z]/.test(weightText)) {
      return weightText;
    }

    return unit ? `${weightText} ${unit}` : weightText;
  };

  const weightLabel = formatWeight(product.weight, product.unit);

  return (
    <div className="group rounded-[28px] border border-[#eef0eb] bg-white p-3 shadow-[0_10px_28px_rgba(15,23,42,0.06)] transition hover:-translate-y-0.5 hover:shadow-[0_16px_40px_rgba(15,23,42,0.1)]">
      <div className="flex h-32 items-center justify-center overflow-hidden rounded-3xl bg-linear-to-br from-[#f8faf8] to-[#eef4ee]">
        <img
          src={image}
          alt={product.name}
          className="h-full w-full object-contain p-3 transition duration-300 group-hover:scale-105"
        />
      </div>

      <h4 className="mt-3 line-clamp-2 text-sm font-semibold leading-snug text-gray-900">
        {product.name}
      </h4>

      {weightLabel ? (
        <p className="mt-1 text-[11px] font-medium text-gray-500">
          {weightLabel}
        </p>
      ) : null}

      <div className="mt-2 flex items-center gap-1 text-xs font-medium text-amber-500">
        <FiStar className="text-sm" />
        {Number(product.rating || 0).toFixed(1)}
      </div>

      <p className="mt-2 text-base font-bold text-gray-900">₹{price.toFixed(2)}</p>

      {qty === 0 ? (
        <button
          onClick={() => addToCart(product)}
          className="mt-3 flex w-full items-center justify-center rounded-2xl bg-[#111827] py-2.5 text-sm font-semibold text-white shadow-md transition hover:scale-[1.01]"
        >
          Add
        </button>
      ) : (
        <div className="mt-3 flex items-center justify-between rounded-2xl bg-[#f3f4f6] p-1.5">
          <button
            onClick={() => decreaseQty(cartItemId)}
            className="grid h-9 w-9 place-items-center rounded-xl bg-white text-gray-800 shadow-sm transition hover:bg-[#f8faf8]"
          >
            <FiMinus />
          </button>

          {/* <span className="min-w-8 text-center text-sm font-semibold text-gray-900">
            {qty}
          </span> */}

          <button
            onClick={() => increaseQty(cartItemId)}
            className="grid h-9 w-9 place-items-center rounded-xl bg-[#111827] text-white shadow-sm transition hover:scale-105"
          >
            <FiPlus />
          </button>
        </div>
      )}
    </div>
  );
};

export default ProductCard;
