// utils/uploadImage.js
// Simulate image upload – returns a base64 or URL
export const uploadImage = async (file) => {
  // In real app, you'd upload to cloud storage and return URL
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
};