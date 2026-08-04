import { useState } from "react";
import DeliverySettings from "./DeliverySettings";

const Settings = () => {
    const [activeTab, setActiveTab] =
        useState("delivery");

    return (
        <div className="min-h-full bg-gray-50 p-6">
            <div className="mb-6">
                <h1 className="text-2xl font-bold text-gray-900">
                    Settings
                </h1>

                <p className="mt-1 text-sm text-gray-500">
                    Manage your grocery application settings.
                </p>
            </div>

            <div className="grid grid-cols-1 gap-6 lg:grid-cols-4">
                {/* Settings Menu */}

                <div className="rounded-xl border border-gray-200 bg-white p-3 shadow-sm">
                    <button
                        onClick={() =>
                            setActiveTab("delivery")
                        }
                        className={`w-full rounded-lg px-4 py-3 text-left text-sm font-medium transition ${
                            activeTab === "delivery"
                                ? "bg-black text-white"
                                : "text-gray-600 hover:bg-gray-100"
                        }`}
                    >
                        Delivery Settings
                    </button>

                    {/* Future settings */}

                    <button
                        disabled
                        className="mt-1 w-full cursor-not-allowed rounded-lg px-4 py-3 text-left text-sm text-gray-400"
                    >
                        Payment Settings
                    </button>

                    <button
                        disabled
                        className="mt-1 w-full cursor-not-allowed rounded-lg px-4 py-3 text-left text-sm text-gray-400"
                    >
                        Store Settings
                    </button>

                    <button
                        disabled
                        className="mt-1 w-full cursor-not-allowed rounded-lg px-4 py-3 text-left text-sm text-gray-400"
                    >
                        Notification Settings
                    </button>
                </div>

                {/* Settings Content */}

                <div className="lg:col-span-3">
                    {activeTab === "delivery" && (
                        <DeliverySettings />
                    )}
                </div>
            </div>
        </div>
    );
};

export default Settings;