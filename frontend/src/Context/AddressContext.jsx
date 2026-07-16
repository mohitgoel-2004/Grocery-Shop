import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

import toast from "react-hot-toast";

import {
  getAddresses,
  createAddress,
  updateAddress,
  deleteAddress,
  updateDefaultAddress,
} from "../services/addressService";

const AddressContext = createContext();

export const useAddress = () => useContext(AddressContext);

// ============================
// Provider
// ============================
export const AddressProvider = ({ children }) => {
  const [addresses, setAddresses] = useState([]);
  const [loading, setLoading] = useState(false);

  // ============================
  // Fetch Addresses
  // ============================
const refreshAddresses = async () => {
  try {
    setLoading(true);

    const res = await getAddresses();

    // console.log("GET ADDRESS RESPONSE:", res.data);

    const data = res?.data?.addresses || [];

    // console.log("Fetched Addresses:", data);

    setAddresses(data);
  } catch (err) {
    console.error("ADDRESS ERROR:", err);

    toast.error(
      err?.response?.data?.message || "Failed to fetch addresses"
    );
  } finally {
    setLoading(false);
  }
};



  // ============================
  // Default Address (derived)
  // ============================
  // const defaultAddress = useMemo(() => {
  //   if (!Array.isArray(addresses) || addresses.length === 0)
  //     return null;

  //   return (
  //     addresses.find((item) => item?.isDefault) ||
  //     addresses[0]
  //   );
  // }, [addresses]);

  const defaultAddress = useMemo(() => {
  if (!Array.isArray(addresses) || addresses.length === 0) return null;

  return (
    addresses.find((item) => item?.isDefault) ||
    addresses[0]
  );
}, [addresses]);

useEffect(() => {
  // console.log("Context Addresses:", addresses);
  // console.log("Context Default:", defaultAddress);
}, [addresses, defaultAddress]);

useEffect(() => {
  // console.log("Address Provider Mounted");
  refreshAddresses();
}, []);
  // ============================
  // Add Address
  // ============================
  const addAddress = async (data) => {
    try {
      const res = await createAddress(data);

      toast.success("Address added");

      await refreshAddresses();

      return res;
    } catch (err) {
      toast.error(
        err?.response?.data?.message ||
          "Failed to add address"
      );
      return null;
    }
  };

  

  // ============================
  // Edit Address
  // ============================
  const editAddress = async (id, data) => {
    try {
      const res = await updateAddress(id, data);

      toast.success("Address updated");

      await refreshAddresses();

      return res;
    } catch (err) {
      toast.error(
        err?.response?.data?.message ||
          "Failed to update address"
      );
      return null;
    }
  };

  // ============================
  // Remove Address
  // ============================
  const removeAddress = async (id) => {
    try {
      const res = await deleteAddress(id);

      toast.success("Address deleted");

      await refreshAddresses();

      return res;
    } catch (err) {
      toast.error(
        err?.response?.data?.message ||
          "Failed to delete address"
      );
      return null;
    }
  };

  // ============================
  // Set Default Address
  // ============================
  const makeDefault = async (id) => {
    try {
      await updateDefaultAddress(id);

      toast.success("Default address updated");

      await refreshAddresses();
    } catch (err) {
      toast.error(
        err?.response?.data?.message ||
          "Failed to update default address"
      );
    }
  };

  // ============================
  // CONTEXT VALUE
  // ============================
  const value = {
    addresses,
    loading,
    defaultAddress,

    refreshAddresses,
    addAddress,
    editAddress,
    removeAddress,
    makeDefault,
  };

  return (
    <AddressContext.Provider value={value}>
      {children}
    </AddressContext.Provider>
  );
};

export default AddressContext;