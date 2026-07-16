// src/hooks/useCustomers.js

import { useCustomerContext as useCustomerContext } from "../Context/CustomerContext";

const useCustomers = () => {
  return useCustomerContext();
};

export default useCustomers;