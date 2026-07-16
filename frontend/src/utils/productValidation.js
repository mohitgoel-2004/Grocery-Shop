// utils/productValidation.js
export const validateProduct = (data) => {
  const errors = {};

  if (!data.name?.trim()) errors.name = 'Product name is required';
  if (!data.category) errors.category = 'Category is required';
  if (!data.price || data.price <= 0) errors.price = 'Price must be greater than 0';
  if (data.stock === undefined || data.stock < 0) errors.stock = 'Stock must be a non-negative number';
  if (data.discount && (data.discount < 0 || data.discount > 100)) errors.discount = 'Discount must be between 0 and 100';
  if (data.weight && data.weight < 0) errors.weight = 'Weight must be positive';

  return errors;
};