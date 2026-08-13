import React, { useEffect, useState } from "react";
import {
  FiArrowLeft,
  FiPlus,
  FiSearch,
  FiMapPin,
  FiHome,
  FiBriefcase,
  FiEdit2,
  FiTrash2,
  FiCheckCircle,
  FiUser,
  FiPhone,
  FiMail,
  FiNavigation,
} from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

import AddressFormModal from "../components/AddressFormModal";  
import { useAddress } from "../Context/AddressContext";  

const AddressManagementPage = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("profile");
  const [search, setSearch] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [selectedAddress, setSelectedAddress] = useState(null);

  const {
    addresses,
    loading,
    addAddress,
    editAddress,
    removeAddress,
    makeDefault,
    defaultAddress,
  } = useAddress();

  const safeAddresses = Array.isArray(addresses) ? addresses : [];

  const filteredAddresses = safeAddresses.filter((item) => {
    const value = search.toLowerCase();
    return (
      item.fullName?.toLowerCase().includes(value) ||
      item.address?.toLowerCase().includes(value) ||
      item.city?.toLowerCase().includes(value) ||
      item.state?.toLowerCase().includes(value) ||
      item.pincode?.includes(value) ||
      item.phone?.includes(value)
    );
  });

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this address?")) return;
    await removeAddress(id);
  };

  const handleDefault = async (id) => {
    await makeDefault(id);
  };

  const handleEdit = (address) => {
    setSelectedAddress(address);
    setShowModal(true);
  };

  const handleAdd = () => {
    setSelectedAddress(null);
    setShowModal(true);
  };

  const handleSave = async (data) => {
    let res;
    if (selectedAddress) {
      res = await editAddress(selectedAddress._id, data);
    } else {
      res = await addAddress(data);
    }
    if (res) {
      setShowModal(false);
      setSelectedAddress(null);
    }
  };

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    switch (tab) {
      case "home":
        navigate("/home");
        break;
      case "products":
        navigate("/products");
        break;
      case "cart":
        navigate("/cart");
        break;
      case "profile":
        navigate("/profile");
        break;
      default:
        navigate("/profile");
    }
  };

  const getIcon = (type) => {
    switch (type) {
      case "Home":
        return <FiHome className="text-emerald-600 text-lg" />;
      case "Work":
        return <FiBriefcase className="text-blue-600 text-lg" />;
      default:
        return <FiMapPin className="text-amber-500 text-lg" />;
    }
  };

  return (
    <div className="min-h-screen bg-white px-0 py-0 md:px-4 md:py-4 lg:px-6">
      <div className="mx-auto flex min-h-screen w-full max-w-107.5 flex-col overflow-hidden bg-white md:min-h-[calc(100vh-2rem)] md:rounded-[30px] md:border md:border-emerald-100 lg:max-w-120">
        
        {/* Header */}
        <div className="shrink-0 bg-gradient-to-b from-emerald-100 via-emerald-50 to-white px-4 pt-4 pb-3">
          <div className="flex items-center justify-between gap-3">
            <button
              onClick={() => navigate(-1)}
              className="grid h-11 w-11 place-items-center rounded-full border border-emerald-100 bg-white shadow-sm transition hover:scale-105 hover:bg-emerald-50"
              aria-label="Go back"
            >
              <FiArrowLeft className="text-lg text-emerald-600" />
            </button>

            <div className="text-center">
              <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-emerald-600">
                Your Addresses
              </p>
              <h2 className="text-base font-bold text-gray-900 sm:text-lg">
                Manage Addresses
              </h2>
            </div>

            <button
              onClick={handleAdd}
              className="grid h-11 w-11 place-items-center rounded-full bg-gradient-to-r from-emerald-500 to-emerald-600 text-white shadow-lg shadow-emerald-200/50 transition hover:scale-105 hover:from-emerald-600 hover:to-emerald-700"
              aria-label="Add address"
            >
              <FiPlus className="text-lg" />
            </button>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 overflow-y-auto px-4 pb-[calc(7rem+env(safe-area-inset-bottom))] pt-4">
          
          {/* Search Bar */}
          <div className="relative mb-4">
            <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search addresses, names, cities..."
              className="w-full rounded-2xl border border-gray-200 bg-gray-50/50 pl-11 pr-4 py-3.5 text-sm text-gray-800 outline-none transition placeholder:text-gray-400 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10"
            />
          </div>

          {/* Address Count */}
          {!loading && filteredAddresses.length > 0 && (
            <div className="mb-3 flex items-center justify-between">
              <p className="text-xs font-medium text-gray-400">
                {filteredAddresses.length} address{filteredAddresses.length > 1 ? "es" : ""} found
              </p>
              <button
                onClick={() => setSearch("")}
                className="text-xs font-medium text-emerald-600 hover:text-emerald-700"
              >
                Clear search
              </button>
            </div>
          )}

          {/* Address List */}
          {loading ? (
            <div className="space-y-3">
              {[1, 2, 3].map((item) => (
                <div
                  key={item}
                  className="rounded-2xl border border-emerald-100/80 bg-white p-3 shadow-sm animate-pulse"
                >
                  <div className="flex items-start justify-between">
                    <div className="space-y-2 flex-1">
                      <div className="flex items-center gap-3">
                        <div className="h-8 w-8 rounded-full bg-gray-200"></div>
                        <div className="h-4 w-32 rounded bg-gray-200"></div>
                      </div>
                      <div className="h-3 w-48 rounded bg-gray-200"></div>
                      <div className="h-3 w-36 rounded bg-gray-200"></div>
                    </div>
                    <div className="h-7 w-7 rounded-full bg-gray-200"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : filteredAddresses.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16">
              <div className="w-24 h-24 rounded-full bg-emerald-50 flex items-center justify-center">
                <FiMapPin className="text-emerald-400 text-5xl" />
              </div>
              <h3 className="mt-4 text-xl font-bold text-gray-800">
                No Address Found
              </h3>
              <p className="mt-2 text-center text-sm text-gray-500 max-w-xs">
                Add your delivery address to continue shopping and get faster delivery.
              </p>
              <button
                onClick={handleAdd}
                className="mt-6 rounded-2xl bg-gradient-to-r from-emerald-500 to-emerald-600 px-8 py-3.5 font-bold text-white shadow-lg shadow-emerald-200/50 transition hover:scale-[1.01] hover:from-emerald-600 hover:to-emerald-700"
              >
                + Add Address
              </button>
            </div>
          ) : (
            <div className="space-y-3 pb-4">
              {filteredAddresses.map((item) => (
                <div
                  key={item._id}
                  className={`group rounded-2xl border transition-all duration-300 p-3 shadow-sm hover:shadow-md ${
                    item.isDefault 
                      ? "border-emerald-200 bg-emerald-50/40" 
                      : "border-emerald-100/60 bg-white hover:border-emerald-200"
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex gap-2.5 flex-1 min-w-0">
                      {/* Icon */}
                      <div className={`mt-0.5 p-1.5 rounded-lg ${
                        item.isDefault ? "bg-emerald-100/70" : "bg-gray-100/70"
                      }`}>
                        {getIcon(item.type)}
                      </div>

                      {/* Details */}
                      <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-center gap-1.5">
                          <h3 className="text-sm font-bold text-gray-800">
                            {item.fullName}
                          </h3>
                          <span className="rounded-full bg-gray-100 px-2 py-0.5 text-[9px] font-semibold text-gray-600">
                            {item.type}
                          </span>
                          {item.isDefault && (
                            <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 px-2 py-0.5 text-[9px] font-semibold text-emerald-700">
                              <FiCheckCircle size={9} />
                              Default
                            </span>
                          )}
                        </div>

                        <p className="mt-1 text-xs text-gray-600 leading-5">
                          {item.address}
                        </p>

                        <p className="text-[10px] text-gray-400">
                          {item.city}, {item.state} - {item.pincode}
                        </p>

                        <div className="mt-1 flex items-center gap-2 text-[10px]">
                          <span className="flex items-center gap-1 text-gray-500">
                            <FiPhone size={10} />
                            {item.phone}
                          </span>
                          {item.email && (
                            <span className="flex items-center gap-1 text-gray-500">
                              <FiMail size={10} />
                              {item.email}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Edit Button */}
                    <button
                      onClick={() => handleEdit(item)}
                      className="ml-1 p-1.5 rounded-lg text-gray-400 transition hover:bg-gray-100 hover:text-gray-600"
                      aria-label="Edit address"
                    >
                      <FiEdit2 size={14} />
                    </button>
                  </div>

                  {/* Actions */}
                  <div className="mt-2.5 flex flex-wrap gap-2 pt-2 border-t border-gray-100/60">
                    {!item.isDefault && (
                      <button
                        onClick={() => handleDefault(item._id)}
                        className="flex items-center gap-1 rounded-lg bg-emerald-600 px-3 py-1.5 text-[10px] font-bold text-white shadow-sm shadow-emerald-200/50 transition hover:bg-emerald-700 hover:scale-[1.02]"
                      >
                        <FiCheckCircle size={12} />
                        Set Default
                      </button>
                    )}

                    <button
                      onClick={() => handleDelete(item._id)}
                      className="flex items-center gap-1 rounded-lg bg-red-50 px-3 py-1.5 text-[10px] font-bold text-red-600 border border-red-200 transition hover:bg-red-100 hover:scale-[1.02]"
                    >
                      <FiTrash2 size={12} />
                      Delete
                    </button>

                    <button
                      onClick={() => {
                        toast.success("Navigating to location...");
                      }}
                      className="flex items-center gap-1 rounded-lg bg-blue-50 px-3 py-1.5 text-[10px] font-bold text-blue-600 border border-blue-200 transition hover:bg-blue-100 hover:scale-[1.02] ml-auto"
                    >
                      <FiNavigation size={12} />
                      Locate
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Modal */}
        <AddressFormModal
          open={showModal}
          onClose={() => setShowModal(false)}
          onSave={handleSave}
          address={selectedAddress}
        />

        {/* Navbar */}
        {/* <Navbar activeTab={activeTab} onTabChange={handleTabChange} /> */}
      </div>
    </div>
  );
};

export default AddressManagementPage;