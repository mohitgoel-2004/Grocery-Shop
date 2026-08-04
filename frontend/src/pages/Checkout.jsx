import React, { useEffect, useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../Context/context";
import toast from "react-hot-toast";
import { fetchProfile, placeOrder } from "../services/api";
import { getDeliverySettings } from "../services/deliverySettingsService";

const Checkout = () => {
    const navigate = useNavigate();
 const { cart, clearCart } = useCart();
  const [deliverySettings, setDeliverySettings] = useState(null);
    const [formData, setFormData] = useState({
        fullName: "",
        phone: "",
        address: "",
        paymentMethod: "cod",
    });

    const [isPlacingOrder, setIsPlacingOrder] = useState(false);

    useEffect(() => {
        const loadProfile = async () => {
            try {
                const response = await fetchProfile();
                const user = response.data.user || {};

                setFormData((prev) => ({
                    ...prev,
                    fullName: user.fullName || prev.fullName,
                    phone: user.mobile || prev.phone,
                    address: user.address || prev.address,
                }));
            } catch (error) {
                // keep current form values if profile load fails
            }
        };

        loadProfile();
    }, []);

     useEffect(() => {
        const loadDeliverySettings = async () => {
            try {
                const settings =
                    await getDeliverySettings();

                console.log(
                    "Checkout Delivery Settings:",
                    settings
                );

                setDeliverySettings(settings);
            } catch (error) {
                console.error(
                    "Failed to load delivery settings:",
                    error
                );

                toast.error(
                    "Unable to load delivery settings"
                );
            }
        };

        loadDeliverySettings();
    }, []);

      const subtotal = useMemo(() => {
        return cart.reduce(
            (acc, item) =>
                acc + Number(item.price || 0) * item.qty,
            0
        );
    }, [cart]);

   const delivery = useMemo(() => {
        if (!deliverySettings) {
            return 0;
        }

        // Admin has disabled delivery charge
        if (
            !deliverySettings.isDeliveryChargeEnabled
        ) {
            return 0;
        }

        // Free delivery if threshold is reached
        if (
            subtotal >=
            Number(
                deliverySettings.freeDeliveryThreshold || 0
            )
        ) {
            return 0;
        }

        // Normal delivery charge
        return Number(
            deliverySettings.deliveryCharge || 0
        );
    }, [subtotal, deliverySettings]);
    const tax = useMemo(() => {
        return Math.round(subtotal * 0.05);
    }, [subtotal]);
     const total = useMemo(() => {
        return subtotal + delivery + tax;
    }, [subtotal, delivery, tax]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

     const handlePlaceOrder = async () => {
    if (!formData.address) {
        toast.error("Please fill in delivery address.");
    return;
  }

  setIsPlacingOrder(true);

    try {
        const response = await placeOrder({
            paymentMethod: formData.paymentMethod,
            deliveryAddress: formData.address,
            fullName: formData.fullName,
            phone: formData.phone,
        });

        await clearCart();

        toast.success(response?.message || "Order placed successfully");
        navigate("/orders");
    } catch (error) {
        toast.error(error?.response?.data?.message || "Failed to place order");
    } finally {
        setIsPlacingOrder(false);
    }
};

    return (
        <div className="min-h-screen w-full bg-gradient-to-br from-emerald-50 via-white to-teal-50 flex flex-col">
            {/* Main container – full width, no max-width */}
            <div className="w-full flex-1 bg-white/80 backdrop-blur-sm border-b border-white/50 shadow-xl shadow-emerald-900/5 flex flex-col overflow-hidden">

                {/* Header – sticky */}
                <div className="bg-gradient-to-r from-emerald-700 to-teal-600 text-white px-5 py-4 flex items-center gap-3 sticky top-0 z-10 shadow-sm">
                    <button
                        onClick={() => navigate(-1)}
                        className="w-10 h-10 flex items-center justify-center rounded-full bg-white/20 hover:bg-white/30 transition-colors duration-200 text-xl"
                        aria-label="Go back"
                    >
                        ←
                    </button>
                    <h2 className="text-xl font-semibold tracking-tight">Checkout</h2>
                    <span className="ml-auto text-xs bg-white/20 px-3 py-1 rounded-full font-medium">
                        {cart.length} items
                    </span>
                </div>

                {/* Scrollable content – takes remaining height */}
                <div className="flex-1 overflow-y-auto px-5 py-6 space-y-6">
                    {/* Delivery Address */}
                    <section>
                        <div className="flex items-center gap-2 mb-4">
                            <div className="w-1 h-6 bg-emerald-600 rounded-full"></div>
                            <h3 className="text-base font-bold text-gray-800">Delivery Address</h3>
                        </div>

                        <div className="space-y-3">
                            <input
                                type="text"
                                name="fullName"
                                placeholder="Full Name"
                                value={formData.fullName}
                                onChange={handleInputChange}
                                className="w-full border border-gray-200 rounded-xl px-4 py-3.5 text-sm outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 transition-all duration-200 bg-gray-50/50"
                            />
                            <input
                                type="tel"
                                name="phone"
                                placeholder="Phone Number"
                                value={formData.phone}
                                onChange={handleInputChange}
                                className="w-full border border-gray-200 rounded-xl px-4 py-3.5 text-sm outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 transition-all duration-200 bg-gray-50/50"
                            />
                            <textarea
                                rows="3"
                                name="address"
                                placeholder="Complete Address"
                                value={formData.address}
                                onChange={handleInputChange}
                                className="w-full border border-gray-200 rounded-xl px-4 py-3.5 text-sm outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 transition-all duration-200 bg-gray-50/50 resize-none"
                            />
                        </div>
                    </section>

                    {/* Order Summary */}
                    <section>
                        <div className="flex items-center gap-2 mb-4">
                            <div className="w-1 h-6 bg-emerald-600 rounded-full"></div>
                            <h3 className="text-base font-bold text-gray-800">Order Summary</h3>
                        </div>

                        {cart.length === 0 ? (
                            <div className="text-center py-8 text-gray-400 text-sm">
                                Your cart is empty.
                            </div>
                        ) : (
                            <div className="space-y-2.5 max-h-[220px] overflow-y-auto pr-1 custom-scrollbar">
                                {cart.map((item) => (
                                    <div
                                        key={item.id}
                                        className="flex items-center justify-between bg-gradient-to-r from-emerald-50/80 to-teal-50/80 rounded-xl px-4 py-3 border border-emerald-100/50"
                                    >
                                        <div className="flex items-center gap-3 min-w-0">
                                            <div className="w-10 h-10 rounded-lg bg-emerald-200/50 flex items-center justify-center text-emerald-700 font-bold text-xs flex-shrink-0">
                                                {item.qty}
                                            </div>
                                            <div className="min-w-0">
                                                <h4 className="font-semibold text-sm text-gray-800 truncate">
                                                    {item.name}
                                                </h4>
                                                <p className="text-gray-400 text-xs">
                                                    Qty: {item.qty}
                                                </p>
                                            </div>
                                        </div>
                                        <span className="font-bold text-emerald-700 text-sm whitespace-nowrap ml-2">
                                            ₹
                                            {(
                                                Number(
                                                    item.price || 0
                                                ) *
                                                item.qty
                                            ).toFixed(2)}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        )}
                    </section>

                    {/* Payment Method */}
                    <section>
                        <div className="flex items-center gap-2 mb-4">
                            <div className="w-1 h-6 bg-emerald-600 rounded-full"></div>
                            <h3 className="text-base font-bold text-gray-800">Payment Method</h3>
                        </div>

                        <div className="space-y-2.5">
                            {[
                                { value: "cod", label: "Cash on Delivery", icon: "💰" },
                                { value: "upi", label: "UPI", icon: "📱" },
                                { value: "card", label: "Credit / Debit Card", icon: "💳" },
                            ].map((method) => (
                                <label
                                    key={method.value}
                                    className={`flex items-center gap-3 border rounded-xl px-4 py-3.5 cursor-pointer transition-all duration-200 ${formData.paymentMethod === method.value
                                            ? "border-emerald-500 bg-emerald-50/80 ring-2 ring-emerald-500/20"
                                            : "border-gray-200 hover:border-emerald-300 hover:bg-gray-50/50"
                                        }`}
                                >
                                    <input
                                        type="radio"
                                        name="paymentMethod"
                                        value={method.value}
                                        checked={formData.paymentMethod === method.value}
                                        onChange={handleInputChange}
                                        className="w-4 h-4 text-emerald-600 focus:ring-emerald-500 accent-emerald-600"
                                    />
                                    <span className="text-sm">{method.icon}</span>
                                    <span className="text-sm font-medium text-gray-700">{method.label}</span>
                                </label>
                            ))}
                        </div>
                    </section>

                    {/* Bill Details */}
                    <section className="bg-gradient-to-br from-gray-50 to-emerald-50/50 rounded-2xl p-4 border border-gray-100/80">
                        <div className="flex items-center gap-2 mb-3">
                            <div className="w-1 h-6 bg-emerald-600 rounded-full"></div>
                            <h3 className="text-base font-bold text-gray-800">Bill Details</h3>
                        </div>

                        <div className="space-y-2 text-sm">
                            <div className="flex justify-between py-1.5 border-b border-gray-200/60">
                                <span className="text-gray-500">Subtotal</span>
                                <span className="font-medium text-gray-700">  ₹{subtotal.toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between py-1.5 border-b border-gray-200/60">
                                <span className="text-gray-500">Delivery</span>
                                <span className="font-medium text-gray-700">₹{delivery.toFixed(2)}</span>
                            </div>
                             {/* Free Delivery Message */}
                            {deliverySettings &&
                                deliverySettings.isDeliveryChargeEnabled &&
                                subtotal <
                                    Number(
                                        deliverySettings.freeDeliveryThreshold ||
                                            0
                                    ) && (
                                    <p className="text-xs text-emerald-600">
                                        Add{" "}
                                        {(
                                            Number(
                                                deliverySettings.freeDeliveryThreshold ||
                                                    0
                                            ) - subtotal
                                        ).toFixed(2)}{" "}
                                        more to get free delivery
                                    </p>
                                )}
                            <div className="flex justify-between py-1.5 border-b border-gray-200/60">
                                <span className="text-gray-500">GST</span>
                                <span className="font-medium text-gray-700">₹{tax.toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between py-2 text-base font-bold text-emerald-700">
                                <span>Total</span>
                                <span>₹{total.toFixed(2)}</span>
                            </div>
                        </div>
                    </section>

                    {/* Place Order – fixed at bottom? We'll keep it inside scroll for now, but can be sticky if desired */}
                    <button
                        onClick={handlePlaceOrder}
                        disabled={isPlacingOrder || cart.length === 0}
                        className={`w-full py-4 rounded-2xl font-semibold text-white text-base transition-all duration-300 flex items-center justify-center gap-2 ${isPlacingOrder || cart.length === 0
                                ? "bg-gray-300 cursor-not-allowed"
                                : "bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 shadow-lg shadow-emerald-600/25 hover:shadow-emerald-600/40 active:scale-[0.98]"
                            }`}
                    >
                        {isPlacingOrder ? (
                            <>
                                <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                Processing...
                            </>
                        ) : (
                            "Place Order"
                        )}
                    </button>

                    {/* Secure note */}
                    <div className="flex items-center justify-center gap-1.5 text-xs text-gray-400 pt-1 pb-4">
                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                        </svg>
                        <span>Secure checkout · 100% safe</span>
                    </div>
                </div>
            </div>

            {/* Custom scrollbar styles */}
            <style>{`
                .custom-scrollbar::-webkit-scrollbar {
                    width: 4px;
                }
                .custom-scrollbar::-webkit-scrollbar-track {
                    background: transparent;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb {
                    background: #d1d5db;
                    border-radius: 8px;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb:hover {
                    background: #9ca3af;
                }
            `}</style>
        </div>
    );
};

export default Checkout;