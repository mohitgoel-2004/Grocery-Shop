import { useEffect, useState } from "react";
import axios from "axios";

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
            <div className="p-6">
                <p className="text-gray-500">
                    Loading delivery settings...
                </p>
            </div>
        );
    }

    return (
        <div className="p-6">
            <div className="max-w-3xl">
                <div className="mb-6">
                    <h2 className="text-2xl font-bold text-gray-900">
                        Delivery Settings
                    </h2>

                    <p className="mt-1 text-sm text-gray-500">
                        Manage delivery charges and free
                        delivery rules for customers.
                    </p>
                </div>

                <form
                    onSubmit={handleSubmit}
                    className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm"
                >
                    {/* Delivery Charge */}

                    <div className="mb-5">
                        <label className="mb-2 block text-sm font-medium text-gray-700">
                            Delivery Charge
                        </label>

                        <div className="relative">
                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">
                                ₹
                            </span>

                            <input
                                type="number"
                                name="deliveryCharge"
                                value={
                                    settings.deliveryCharge
                                }
                                onChange={handleChange}
                                min="0"
                                className="w-full rounded-lg border border-gray-300 py-2.5 pl-8 pr-3 outline-none focus:border-black"
                            />
                        </div>

                        <p className="mt-1 text-xs text-gray-500">
                            Charge applied when the order
                            does not qualify for free delivery.
                        </p>
                    </div>

                    {/* Free Delivery Threshold */}

                    <div className="mb-5">
                        <label className="mb-2 block text-sm font-medium text-gray-700">
                            Free Delivery Above
                        </label>

                        <div className="relative">
                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">
                                ₹
                            </span>

                            <input
                                type="number"
                                name="freeDeliveryThreshold"
                                value={
                                    settings.freeDeliveryThreshold
                                }
                                onChange={handleChange}
                                min="0"
                                className="w-full rounded-lg border border-gray-300 py-2.5 pl-8 pr-3 outline-none focus:border-black"
                            />
                        </div>

                        <p className="mt-1 text-xs text-gray-500">
                            Orders at or above this amount
                            will get free delivery.
                        </p>
                    </div>

                    {/* Minimum Order */}

                    <div className="mb-5">
                        <label className="mb-2 block text-sm font-medium text-gray-700">
                            Minimum Order Value
                        </label>

                        <div className="relative">
                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">
                                ₹
                            </span>

                            <input
                                type="number"
                                name="minimumOrderValue"
                                value={
                                    settings.minimumOrderValue
                                }
                                onChange={handleChange}
                                min="0"
                                className="w-full rounded-lg border border-gray-300 py-2.5 pl-8 pr-3 outline-none focus:border-black"
                            />
                        </div>

                        <p className="mt-1 text-xs text-gray-500">
                            Customers cannot place an order
                            below this amount.
                        </p>
                    </div>

                    {/* Enable Delivery Charge */}

                    <div className="mb-6 flex items-center justify-between rounded-lg bg-gray-50 p-4">
                        <div>
                            <p className="font-medium text-gray-900">
                                Enable Delivery Charge
                            </p>

                            <p className="text-sm text-gray-500">
                                Apply delivery charges to
                                eligible orders.
                            </p>
                        </div>

                        <input
                            type="checkbox"
                            name="isDeliveryChargeEnabled"
                            checked={
                                settings.isDeliveryChargeEnabled
                            }
                            onChange={handleChange}
                            className="h-5 w-5"
                        />
                    </div>

                    {/* Messages */}

                    {message && (
                        <div className="mb-4 rounded-lg bg-green-50 p-3 text-sm text-green-700">
                            {message}
                        </div>
                    )}

                    {error && (
                        <div className="mb-4 rounded-lg bg-red-50 p-3 text-sm text-red-700">
                            {error}
                        </div>
                    )}

                    {/* Save */}

                    <button
                        type="submit"
                        disabled={saving}
                        className="rounded-lg bg-black px-5 py-2.5 text-sm font-medium text-white transition hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                        {saving
                            ? "Saving..."
                            : "Save Settings"}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default DeliverySettings;