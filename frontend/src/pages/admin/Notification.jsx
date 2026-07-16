import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { sendNotification } from "../../services/notificationService";
import { fetchCustomers } from "../../services/customerService";

const AdminNotifications = () => {
  const [form, setForm] = useState({
    title: "",
    message: "",
    type: "system",
    userId: "all",
  });

  const [loading, setLoading] = useState(false);
  const [customers, setCustomers] = useState([]);

  // ===========================
  // Load Customers
  // ===========================
  useEffect(() => {
    loadCustomers();
  }, []);

  const loadCustomers = async () => {
    try {
      const res = await fetchCustomers();

      console.log("CUSTOMERS =", res);

      setCustomers(res.customers || []);
    } catch (err) {
      console.log(err);
      toast.error("Failed to load customers");
    }
  };

  // ===========================
  // Handle Form Change
  // ===========================
  const handleChange = (e) => {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  // ===========================
  // Send Notification
  // ===========================
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      const res = await sendNotification(form);

      console.log(res);

      toast.success("Notification sent successfully");

      setForm({
        title: "",
        message: "",
        type: "system",
        userId: "all",
      });
    } catch (error) {
      console.log(error);

      toast.error(
        error?.response?.data?.message ||
          "Failed to send notification"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">
        Send Customer Notification
      </h1>

      <form
        onSubmit={handleSubmit}
        className="max-w-xl space-y-5 bg-white p-6 rounded-xl shadow"
      >
        {/* Send To */}
        <div>
          <label className="block mb-2 font-medium">
            Send To
          </label>

          <select
            name="userId"
            value={form.userId}
            onChange={handleChange}
            className="w-full border p-3 rounded"
          >
            <option value="all">
              📢 All Customers
            </option>

            {customers.map((customer) => (
              <option
                key={customer._id}
                value={customer._id}
              >
                {customer.fullName || "No Name"} (
                {customer.mobile})
              </option>
            ))}
          </select>
        </div>

        {/* Title */}
        <input
          name="title"
          value={form.title}
          onChange={handleChange}
          placeholder="Notification Title"
          className="w-full border p-3 rounded"
          required
        />

        {/* Message */}
        <textarea
          name="message"
          value={form.message}
          onChange={handleChange}
          placeholder="Notification Message"
          rows={4}
          className="w-full border p-3 rounded"
          required
        />

        {/* Type */}
        <select
          name="type"
          value={form.type}
          onChange={handleChange}
          className="w-full border p-3 rounded"
        >
          <option value="system">System</option>
          <option value="offer">Offer</option>
          <option value="delivery">Delivery</option>
          <option value="payment">Payment</option>
        </select>

        {/* Preview */}
        <div className="bg-gray-100 rounded-lg p-4">
          <p className="text-sm text-gray-500 mb-2">
            Notification Preview
          </p>

          <h3 className="font-bold text-lg">
            {form.title || "Notification Title"}
          </h3>

          <p className="text-gray-600 mt-2">
            {form.message || "Notification Message"}
          </p>

          <p className="mt-3 text-sm text-green-600">
            {form.userId === "all"
              ? "📢 This will be sent to ALL customers"
              : "👤 This will be sent to ONE customer"}
          </p>
        </div>

        {/* Button */}
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg"
        >
          {loading
            ? "Sending..."
            : "Send Notification"}
        </button>
      </form>
    </div>
  );
};

export default AdminNotifications;