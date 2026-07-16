import React, { useEffect, useState } from "react";
import {
  FiX,
  FiHome,
  FiBriefcase,
  FiMapPin,
} from "react-icons/fi";

const initialForm = {
  fullName: "",
  phone: "",
  address: "",
  landmark: "",
  city: "",
  state: "",
  pincode: "",
  type: "Home",
};

const AddressFormModal = ({
  open,
  onClose,
  onSave,
  address,
}) => {
  const [form, setForm] = useState(initialForm);

  useEffect(() => {
    if (address) {
      setForm({
        fullName: address.fullName || "",
        phone: address.phone || "",
        address: address.address || "",
        landmark: address.landmark || "",
        city: address.city || "",
        state: address.state || "",
        pincode: address.pincode || "",
        type: address.type || "Home",
      });
    } else {
      setForm(initialForm);
    }
  }, [address, open]);

  if (!open) return null;

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const submit = () => {
    if (
      !form.fullName ||
      !form.phone ||
      !form.address ||
      !form.city ||
      !form.state ||
      !form.pincode
    ) {
      alert("Please fill all required fields");
      return;
    }

    onSave(form);
  };

  return (
    <div
  className="fixed inset-0 z-50 bg-black/40 flex items-end justify-center"
  onClick={onClose}
>
    <div
  onClick={(e) => e.stopPropagation()}
  className="w-full max-w-md bg-white rounded-t-[32px] shadow-2xl overflow-hidden animate-slideUp max-h-[90vh]"
>
    <div className="flex justify-center pt-3 pb-1">
  <div className="h-1.5 w-14 rounded-full bg-gray-300"></div>
</div>

        {/* Header */}

        <div className="flex items-center justify-between border-b px-6 py-5">

          <h2 className="text-xl font-bold">
            {address ? "Edit Address" : "Add Address"}
          </h2>

          <button
            onClick={onClose}
            className="rounded-full bg-gray-100 p-2 hover:bg-gray-200"
          >
            <FiX size={20} />
          </button>

        </div>

        {/* Body */}

        <div className="max-h-[75vh] overflow-y-auto px-6 pb-8 pt-4 space-y-5">

          <input
            name="fullName"
            value={form.fullName}
            onChange={handleChange}
            placeholder="Full Name"
            className="w-full rounded-xl border p-3"
          />

          <input
            name="phone"
            value={form.phone}
            onChange={handleChange}
            placeholder="Mobile Number"
            className="w-full rounded-xl border p-3"
          />

          <textarea
            name="address"
            value={form.address}
            onChange={handleChange}
            placeholder="House No, Building, Street..."
            rows={3}
            className="w-full rounded-xl border p-3 resize-none"
          />

          <input
            name="landmark"
            value={form.landmark}
            onChange={handleChange}
            placeholder="Landmark"
            className="w-full rounded-xl border p-3"
          />

          <div className="grid grid-cols-2 gap-4">

            <input
              name="city"
              value={form.city}
              onChange={handleChange}
              placeholder="City"
              className="rounded-xl border p-3"
            />

            <input
              name="state"
              value={form.state}
              onChange={handleChange}
              placeholder="State"
              className="rounded-xl border p-3"
            />

          </div>

          <input
            name="pincode"
            value={form.pincode}
            onChange={handleChange}
            placeholder="Pincode"
            className="w-full rounded-xl border p-3"
          />

          {/* Address Type */}

          <div>

            <p className="mb-3 font-semibold">
              Address Type
            </p>

            <div className="flex gap-3">

              <button
                type="button"
                onClick={() =>
                  setForm({
                    ...form,
                    type: "Home",
                  })
                }
                className={`flex items-center gap-2 rounded-full px-5 py-3 border transition ${
                  form.type === "Home"
                    ? "bg-green-600 text-white"
                    : "bg-white"
                }`}
              >
                <FiHome />
                Home
              </button>

              <button
                type="button"
                onClick={() =>
                  setForm({
                    ...form,
                    type: "Work",
                  })
                }
                className={`flex items-center gap-2 rounded-full px-5 py-3 border transition ${
                  form.type === "Work"
                    ? "bg-blue-600 text-white"
                    : "bg-white"
                }`}
              >
                <FiBriefcase />
                Work
              </button>

              <button
                type="button"
                onClick={() =>
                  setForm({
                    ...form,
                    type: "Other",
                  })
                }
                className={`flex items-center gap-2 rounded-full px-5 py-3 border transition ${
                  form.type === "Other"
                    ? "bg-orange-500 text-white"
                    : "bg-white"
                }`}
              >
                <FiMapPin />
                Other
              </button>

            </div>

          </div>
                    {/* Footer Buttons */}

          <div className="flex gap-3 pt-4">

            <button
              type="button"
              onClick={onClose}
              className="flex-1 rounded-xl border border-gray-300 py-3 font-semibold text-gray-700 transition hover:bg-gray-100"
            >
              Cancel
            </button>

            <button
              type="button"
              onClick={submit}
              className="flex-1 rounded-xl bg-green-600 py-3 font-semibold text-white transition hover:bg-green-700"
            >
              {address ? "Update Address" : "Save Address"}
            </button>

          </div>

        </div>

      </div>

    </div>
  );
};

export default AddressFormModal;