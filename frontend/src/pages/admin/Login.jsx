import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  FiMail,
  FiLock,
  FiEye,
  FiEyeOff,
  FiShoppingCart,
} from "react-icons/fi";
import toast from "react-hot-toast";
import { Link, useNavigate } from "react-router-dom";
import { loginAdmin } from "../../services/adminService";

const Login = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    remember: false,
  });

  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value, checked, type } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));

    setErrors((prev) => ({
      ...prev,
      [name]: "",
    }));
  };

  useEffect(() => {
    const token = localStorage.getItem("adminToken");

    if (token) {
      navigate("/admin/dashboard", {
        replace: true,
      });
    }
  }, [navigate]);

  const validate = () => {
    const newErrors = {};

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (
      !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(formData.email)
    ) {
      newErrors.email = "Enter a valid email";
    }

    if (!formData.password.trim()) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 6) {
      newErrors.password = "Minimum 6 characters required";
    }

    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const validationErrors = validate();

    if (Object.keys(validationErrors).length) {
      setErrors(validationErrors);
      return;
    }

    try {
      setLoading(true);

    const response = await loginAdmin(formData.email, formData.password);

console.log(response);
console.log(response.success);
console.log(response.message);
console.log(response.data);

const token = response?.data?.accessToken;
const admin = response?.data?.admin;

console.log("Token:", token);
console.log("Admin:", admin);

if (!token) {
  throw new Error("Token not found in response");
}

localStorage.setItem("adminToken", token);
localStorage.setItem("adminInfo", JSON.stringify(admin));

console.log("Saved Token:", localStorage.getItem("adminToken"));

toast.success("Login Successful");

navigate("/admin/dashboard", { replace: true });
    } catch (error) {
      console.error(error);

      toast.error(
        error?.response?.data?.message || error.message || "Login Failed",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-emerald-100 flex items-center justify-center p-6">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="grid lg:grid-cols-2 bg-white rounded-3xl shadow-2xl overflow-hidden max-w-6xl w-full"
      >
        {/* Left Section */}
        <div className="hidden lg:flex flex-col justify-center bg-gradient-to-br from-green-600 to-emerald-700 text-white p-14">
          <div className="w-20 h-20 rounded-full bg-white/20 flex items-center justify-center mb-8">
            <FiShoppingCart size={40} />
          </div>

          <h1 className="text-5xl font-bold leading-tight">
            Grocery Admin Panel
          </h1>

          <p className="mt-6 text-lg text-green-100 leading-8">
            Manage products, categories, orders, customers, inventory, coupons
            and reports from one dashboard.
          </p>

          <div className="mt-12 space-y-4">
            <div className="flex items-center gap-3">
              ✅ Secure Authentication
            </div>

            <div className="flex items-center gap-3">
              ✅ Inventory Management
            </div>

            <div className="flex items-center gap-3">✅ Real Time Orders</div>

            <div className="flex items-center gap-3">✅ Sales Analytics</div>
          </div>
        </div>

        {/* Right Section */}
        <div className="p-8 sm:p-12">
          <div className="max-w-md mx-auto">
            <h2 className="text-4xl font-bold text-gray-800">
              Welcome Back 👋
            </h2>

            <p className="text-gray-500 mt-3">
              Login to continue managing your grocery store.
            </p>

            <form onSubmit={handleSubmit} className="mt-10 space-y-6">
              {/* Email */}
              <div>
                <label className="block mb-2 font-semibold text-gray-700">
                  Email Address
                </label>

                <div className="relative">
                  <FiMail className="absolute left-4 top-4 text-gray-400" />

                  <input
                    type="email"
                    name="email"
                    autoComplete="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="admin@gmail.com"
                    className={`w-full pl-12 pr-4 py-3 rounded-xl border focus:outline-none transition
                    ${
                      errors.email
                        ? "border-red-500"
                        : "border-gray-300 focus:border-green-500"
                    }`}
                  />
                </div>

                {errors.email && (
                  <p className="text-red-500 text-sm mt-2">{errors.email}</p>
                )}
              </div>

              {/* Password */}
              <div>
                <label className="block mb-2 font-semibold text-gray-700">
                  Password
                </label>

                <div className="relative">
                  <FiLock className="absolute left-4 top-4 text-gray-400" />

                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    autoComplete="current-password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="********"
                    className={`w-full pl-12 pr-12 py-3 rounded-xl border focus:outline-none transition
                    ${
                      errors.password
                        ? "border-red-500"
                        : "border-gray-300 focus:border-green-500"
                    }`}
                  />

                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-4 text-gray-500"
                  >
                    {showPassword ? <FiEyeOff /> : <FiEye />}
                  </button>
                </div>

                {errors.password && (
                  <p className="text-red-500 text-sm mt-2">{errors.password}</p>
                )}
              </div>

              {/* Remember */}
              <div className="flex justify-between items-center">
                <label className="flex items-center gap-2 text-sm">
                  <input
                    type="checkbox"
                    name="remember"
                    checked={formData.remember}
                    onChange={handleChange}
                    className="accent-green-600"
                  />
                  Remember Me
                </label>

                <Link
                  to="/forgot-password"
                  className="text-green-600 hover:underline text-sm"
                >
                  Forgot Password?
                </Link>
              </div>

              {/* Login Button */}
              <button
                type="submit"
                disabled={loading}
                className={`w-full py-3 rounded-xl font-semibold text-white transition-all duration-300 flex items-center justify-center gap-2
    ${
      loading
        ? "bg-green-400 cursor-not-allowed"
        : "bg-green-600 hover:bg-green-700"
    }`}
              >
                {loading ? (
                  <>
                    <svg
                      className="animate-spin h-5 w-5"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>

                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                      ></path>
                    </svg>
                    Signing In...
                  </>
                ) : (
                  "Login"
                )}
              </button>

              <div className="text-center text-gray-500 text-sm">
                © 2026 Grocery Admin Panel
              </div>
            </form>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Login;
