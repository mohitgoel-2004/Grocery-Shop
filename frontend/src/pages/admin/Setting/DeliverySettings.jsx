// DeliverySettings.jsx
import { useEffect, useState } from "react";
import axios from "axios";
import { 
    FiTruck, 
    FiDollarSign, 
    FiShoppingBag, 
    FiToggleLeft, 
    FiToggleRight,
    FiSave,
    FiAlertCircle,
    FiCheckCircle,
    FiLoader
} from "react-icons/fi";

const API_BASE_URL =
    import.meta.env.VITE_API_BASE_URL ||
    "http://localhost:5000/api";

const DeliverySettings = () => {
    const [settings, setSettings] = useState({
        deliveryCharge: 30,
        freeDeliveryThreshold: 499,
        minimumOrderValue: 99,
        isDeliveryChargeEnabled: true,
    });

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");

    useEffect(() => {
        fetchSettings();
    }, []);

    const fetchSettings = async () => {
        try {
            setLoading(true);
            setError("");

            const token =
                localStorage.getItem("adminToken") ||
                sessionStorage.getItem("adminToken");

            const response = await axios.get(
                `${API_BASE_URL}/admin/delivery-settings`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            const data =
                response.data?.data?.settings ||
                response.data?.settings;

            if (data) {
                setSettings({
                    deliveryCharge: data.deliveryCharge ?? 30,
                    freeDeliveryThreshold:
                        data.freeDeliveryThreshold ?? 499,
                    minimumOrderValue:
                        data.minimumOrderValue ?? 99,
                    isDeliveryChargeEnabled:
                        data.isDeliveryChargeEnabled ?? true,
                });
            }
        } catch (err) {
            console.error(
                "Failed to fetch delivery settings:",
                err
            );

            setError(
                err.response?.data?.message ||
                    "Failed to load delivery settings"
            );
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;

        setSettings((prev) => ({
            ...prev,
            [name]:
                type === "checkbox"
                    ? checked
                    : Number(value),
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            setSaving(true);
            setMessage("");
            setError("");

            const token =
                localStorage.getItem("adminToken") ||
                sessionStorage.getItem("adminToken");

            const response = await axios.put(
                `${API_BASE_URL}/admin/delivery-settings`,
                settings,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            const updatedSettings =
                response.data?.data?.settings ||
                response.data?.settings;

            if (updatedSettings) {
                setSettings(updatedSettings);
            }

            setMessage(
                "Delivery settings updated successfully."
            );
        } catch (err) {
            console.error(
                "Failed to update delivery settings:",
                err
            );

            setError(
                err.response?.data?.message ||
                    "Failed to update delivery settings"
            );
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center py-8 md:py-12">
                <div className="flex flex-col items-center gap-3">
                    <FiLoader className="text-3xl text-gray-400 animate-spin" />
                    <p className="text-sm text-gray-500">
                        Loading delivery settings...
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="p-0 md:p-1">
            <div className="max-w-3xl">
                {/* Mobile Optimized Header */}
                <div className="mb-4 md:mb-6">
                    <div className="flex items-center gap-3">
                        <div className="p-2 rounded-xl bg-emerald-50 text-emerald-600">
                            <FiTruck className="text-xl" />
                        </div>
                        <div>
                            <h2 className="text-lg md:text-2xl font-bold text-gray-900">
                                Delivery Settings
                            </h2>
                            <p className="text-xs md:text-sm text-gray-500 mt-0.5">
                                Manage delivery charges and free delivery rules.
                            </p>
                        </div>
                    </div>
                </div>

                <form
                    onSubmit={handleSubmit}
                    className="rounded-xl border border-gray-200 bg-white p-4 md:p-6 shadow-sm"
                >
                    {/* Delivery Charge */}
                    <div className="mb-4 md:mb-5">
                        <label className="flex items-center gap-2 mb-1.5 md:mb-2 text-sm font-medium text-gray-700">
                            <FiDollarSign className="text-gray-400" />
                            Delivery Charge
                        </label>

                        <div className="relative">
                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 font-medium">
                                ₹
                            </span>

                            <input
                                type="number"
                                name="deliveryCharge"
                                value={settings.deliveryCharge}
                                onChange={handleChange}
                                min="0"
                                className="w-full rounded-lg border border-gray-300 py-2.5 md:py-3 pl-8 pr-3 text-sm md:text-base outline-none focus:border-black focus:ring-2 focus:ring-black/10 transition"
                            />
                        </div>

                        <p className="mt-1 text-[11px] md:text-xs text-gray-500">
                            Charge applied when the order does not qualify for free delivery.
                        </p>
                    </div>

                    {/* Free Delivery Threshold */}
                    <div className="mb-4 md:mb-5">
                        <label className="flex items-center gap-2 mb-1.5 md:mb-2 text-sm font-medium text-gray-700">
                            <FiShoppingBag className="text-gray-400" />
                            Free Delivery Above
                        </label>

                        <div className="relative">
                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 font-medium">
                                ₹
                            </span>

                            <input
                                type="number"
                                name="freeDeliveryThreshold"
                                value={settings.freeDeliveryThreshold}
                                onChange={handleChange}
                                min="0"
                                className="w-full rounded-lg border border-gray-300 py-2.5 md:py-3 pl-8 pr-3 text-sm md:text-base outline-none focus:border-black focus:ring-2 focus:ring-black/10 transition"
                            />
                        </div>

                        <p className="mt-1 text-[11px] md:text-xs text-gray-500">
                            Orders at or above this amount will get free delivery.
                        </p>
                    </div>

                    {/* Minimum Order */}
                    <div className="mb-4 md:mb-5">
                        <label className="flex items-center gap-2 mb-1.5 md:mb-2 text-sm font-medium text-gray-700">
                            <FiAlertCircle className="text-gray-400" />
                            Minimum Order Value
                        </label>

                        <div className="relative">
                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 font-medium">
                                ₹
                            </span>

                            <input
                                type="number"
                                name="minimumOrderValue"
                                value={settings.minimumOrderValue}
                                onChange={handleChange}
                                min="0"
                                className="w-full rounded-lg border border-gray-300 py-2.5 md:py-3 pl-8 pr-3 text-sm md:text-base outline-none focus:border-black focus:ring-2 focus:ring-black/10 transition"
                            />
                        </div>

                        <p className="mt-1 text-[11px] md:text-xs text-gray-500">
                            Customers cannot place an order below this amount.
                        </p>
                    </div>

                    {/* Enable Delivery Charge - Mobile Optimized Toggle */}
                    <div className="mb-5 md:mb-6">
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 rounded-lg bg-gray-50 p-3 md:p-4">
                            <div className="flex items-start gap-3">
                                <div className="p-1.5 rounded-lg bg-gray-200/50 mt-0.5">
                                    {settings.isDeliveryChargeEnabled ? (
                                        <FiToggleRight className="text-emerald-600 text-2xl" />
                                    ) : (
                                        <FiToggleLeft className="text-gray-400 text-2xl" />
                                    )}
                                </div>
                                <div>
                                    <p className="font-medium text-gray-900 text-sm md:text-base">
                                        Enable Delivery Charge
                                    </p>
                                    <p className="text-xs md:text-sm text-gray-500">
                                        Apply delivery charges to eligible orders.
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-center justify-between sm:justify-end w-full sm:w-auto">
                                <span className="text-xs text-gray-500 mr-2 sm:hidden">
                                    {settings.isDeliveryChargeEnabled ? "On" : "Off"}
                                </span>
                                <label className="relative inline-flex items-center cursor-pointer">
                                    <input
                                        type="checkbox"
                                        name="isDeliveryChargeEnabled"
                                        checked={settings.isDeliveryChargeEnabled}
                                        onChange={handleChange}
                                        className="sr-only peer"
                                    />
                                    <div className="w-11 h-6 bg-gray-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-black"></div>
                                </label>
                            </div>
                        </div>
                    </div>

                    {/* Messages - Mobile Optimized */}
                    {message && (
                        <div className="mb-4 rounded-lg bg-emerald-50 border border-emerald-200 p-3 md:p-4 text-sm text-emerald-700 flex items-start gap-2">
                            <FiCheckCircle className="text-emerald-500 text-lg flex-shrink-0 mt-0.5" />
                            <span>{message}</span>
                        </div>
                    )}

                    {error && (
                        <div className="mb-4 rounded-lg bg-red-50 border border-red-200 p-3 md:p-4 text-sm text-red-700 flex items-start gap-2">
                            <FiAlertCircle className="text-red-500 text-lg flex-shrink-0 mt-0.5" />
                            <span>{error}</span>
                        </div>
                    )}

                    {/* Save Button - Mobile Optimized */}
                    <button
                        type="submit"
                        disabled={saving}
                        className="w-full sm:w-auto flex items-center justify-center gap-2 rounded-lg bg-black px-4 md:px-6 py-2.5 md:py-3 text-sm font-medium text-white transition hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-60 shadow-md shadow-black/5"
                    >
                        {saving ? (
                            <>
                                <FiLoader className="animate-spin text-lg" />
                                Saving...
                            </>
                        ) : (
                            <>
                                <FiSave className="text-lg" />
                                Save Settings
                            </>
                        )}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default DeliverySettings;