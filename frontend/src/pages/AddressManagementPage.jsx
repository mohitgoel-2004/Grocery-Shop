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
} from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

// import Navbar from "../components/Navbar";
import AddressFormModal from "../components/AddressFormModal";  
 import { useAddress } from "../Context/AddressContext";  


const AddressManagementPage = () => {
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState("profile");
//   const [addresses, setAddresses] = useState([]);
//   const [filteredAddresses, setFilteredAddresses] = useState([]);

  const [search, setSearch] = useState("");

// const [loading, setLoading] = useState(false);

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

//   const loadAddresses = async () => {
//     try {
//       setLoading(true);

//       const res = await getAddresses();
//         console.log(res.data);
 
//       setAddresses(res.data.addresses);
//       setFilteredAddresses(res.data.addresses);
//     } catch (err) {
//          console.log(err.response);
//   console.log(err.response?.data);

//       toast.error(
//     err.response?.data?.message || "Something went wrong"
//   );
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     loadAddresses();
//   }, []);

 const safeAddresses = Array.isArray(addresses) ? addresses : [];

const filteredAddresses = safeAddresses.filter((item) => {
  const value = search.toLowerCase();

  return (
    item.fullName?.toLowerCase().includes(value) ||
    item.address?.toLowerCase().includes(value) ||
    item.city?.toLowerCase().includes(value) ||
    item.state?.toLowerCase().includes(value) ||
    item.pincode?.includes(value)
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
        return <FiHome className="text-green-600 text-xl" />;

      case "Work":
        return <FiBriefcase className="text-blue-600 text-xl" />;

      default:
        return <FiMapPin className="text-orange-500 text-xl" />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="max-w-6xl mx-auto bg-white min-h-screen shadow-lg">
        {/* Header */}

        <div className="sticky top-0 z-20 bg-white border-b px-5 py-4 flex items-center justify-between">
          <button
            onClick={() => navigate(-1)}
            className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center"
          >
            <FiArrowLeft />
          </button>

          <h2 className="font-bold text-lg">Manage Addresses</h2>

          <button
            onClick={handleAdd}
            className="w-10 h-10 rounded-full bg-green-600 text-white flex items-center justify-center"
          >
            <FiPlus />
          </button>
        </div>

        {/* Search */}

        <div className="p-5">
          <div className="relative">
            <FiSearch className="absolute left-4 top-4 text-gray-400" />

            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search address..."
              className="w-full rounded-2xl border pl-12 pr-4 py-3 outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>
        </div>

        {/* Address List */}

        <div className="px-5 pb-24">
          {loading ? (
            <div className="space-y-4">
              {[1, 2, 3].map((item) => (
                <div
                  key={item}
                  className="animate-pulse rounded-3xl border bg-white p-5"
                >
                  <div className="flex justify-between">
                    <div className="space-y-3 flex-1">
                      <div className="h-5 w-40 rounded bg-gray-200"></div>
                      <div className="h-4 w-64 rounded bg-gray-200"></div>
                      <div className="h-4 w-52 rounded bg-gray-200"></div>
                    </div>

                    <div className="h-10 w-10 rounded-full bg-gray-200"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : filteredAddresses.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20">
              <FiMapPin className="text-6xl text-gray-300" />

              <h3 className="mt-4 text-xl font-bold text-gray-700">
                No Address Found
              </h3>

              <p className="mt-2 text-center text-gray-500">
                Add your delivery address to continue shopping.
              </p>

              <button
                onClick={handleAdd}
                className="mt-6 rounded-full bg-green-600 px-6 py-3 font-semibold text-white"
              >
                + Add Address
              </button>
            </div>
          ) : (
            <div className="space-y-5">
              {filteredAddresses.map((item) => (
                <div
                  key={item._id}
                  className="rounded-3xl border border-gray-200 bg-white p-5 shadow-sm hover:shadow-lg transition"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex gap-3">
                      <div className="mt-1">{getIcon(item.type)}</div>

                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="text-lg font-bold">{item.fullName}</h3>

                          <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-semibold">
                            {item.type}
                          </span>

                          {item.isDefault && (
                            <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-semibold text-green-700">
                              Default
                            </span>
                          )}
                        </div>

                        <p className="mt-2 text-gray-600 leading-6">
                          {item.address}
                        </p>

                        <p className="text-gray-500">
                          {item.city}, {item.state} - {item.pincode}
                        </p>

                        <p className="mt-1 font-medium">📞 {item.phone}</p>
                      </div>
                    </div>

                    <button
                      onClick={() => handleEdit(item)}
                      className="rounded-full bg-gray-100 p-2 hover:bg-gray-200"
                    >
                      <FiEdit2 />
                    </button>
                  </div>

                  <div className="mt-5 flex flex-wrap gap-3">
                    {!item.isDefault && (
                      <button
                        onClick={() => handleDefault(item._id)}
                        className="flex items-center gap-2 rounded-full bg-green-600 px-4 py-2 text-sm font-medium text-white"
                      >
                        <FiCheckCircle />
                        Set Default
                      </button>
                    )}

                    <button
                      onClick={() => handleDelete(item._id)}
                      className="flex items-center gap-2 rounded-full bg-red-50 px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-100"
                    >
                      <FiTrash2 />
                      Delete
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

        {/* <Navbar activeTab={activeTab} onTabChange={handleTabChange} /> */}
      </div>
    </div>
  );
};

export default AddressManagementPage;
