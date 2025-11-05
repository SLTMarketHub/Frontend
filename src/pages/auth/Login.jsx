// import React, { useState } from 'react';
// import { Link, useNavigate } from 'react-router-dom';
// import { Mail, Lock, Eye, EyeOff, LogIn, AlertCircle } from 'lucide-react';
// import authService from '../../services/authService';
// import Button from '../../components/common/Button';
// import useToast from '../../hooks/useToast';

// export default function Login() {
//   const navigate = useNavigate();
//   const { success, error: showError } = useToast();
//   const [loading, setLoading] = useState(false);
//   const [showPassword, setShowPassword] = useState(false);
//   const [formData, setFormData] = useState({
//     email: '',
//     password: '',
//     rememberMe: false
//   });
//   const [errors, setErrors] = useState({});

//   const validateForm = () => {
//     const newErrors = {};
    
//     if (!formData.email) {
//       newErrors.email = 'Email is required';
//     } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
//       newErrors.email = 'Invalid email address';
//     }
    
//     if (!formData.password) {
//       newErrors.password = 'Password is required';
//     } else if (formData.password.length < 6) {
//       newErrors.password = 'Password must be at least 6 characters';
//     }
    
//     setErrors(newErrors);
//     return Object.keys(newErrors).length === 0;
//   };

//   const handleChange = (e) => {
//     const { name, value, type, checked } = e.target;
//     setFormData(prev => ({
//       ...prev,
//       [name]: type === 'checkbox' ? checked : value
//     }));
//     // Clear error for this field
//     if (errors[name]) {
//       setErrors(prev => ({ ...prev, [name]: '' }));
//     }
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
    
//     if (!validateForm()) return;
    
//     setLoading(true);
//     try {
//       const response = await authService.login({
//         email: formData.email,
//         password: formData.password
//       });
      
//       success('Login successful! Redirecting...');
      
//       // Redirect based on user role
//       const user = response.user;
//       if (user.role === 'admin') {
//         navigate('/admin/dashboard');
//       } else if (user.role === 'seller') {
//         navigate('/seller/dashboard');
//       } else {
//         navigate('/customer/dashboard');
//       }
//     } catch (error) {
//       showError(error.message || 'Invalid credentials. Please try again.');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleDemoLogin = async (role) => {
//     setLoading(true);
//     try {
//       // Demo credentials for testing
//       const credentials = {
//         admin: { email: 'admin@markethub.com', password: 'admin123' },
//         seller: { email: 'seller@markethub.com', password: 'seller123' },
//         customer: { email: 'customer@markethub.com', password: 'customer123' }
//       };
      
//       await authService.login(credentials[role]);
//       success(`Logged in as ${role}!`);
      
//       if (role === 'admin') {
//         navigate('/admin/dashboard');
//       } else if (role === 'seller') {
//         navigate('/seller/dashboard');
//       } else {
//         navigate('/customer/dashboard');
//       }
//     } catch (error) {
//       showError('Demo login failed. Please try manual login.');
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-teal-50 to-green-50">
//       <div className="w-full max-w-md">
//         {/* Logo and Title */}
//         <div className="text-center mb-8">
//           <div className="inline-flex items-center justify-center w-16 h-16 bg-slt-gradient rounded-2xl mb-4">
//             <span className="text-white font-bold text-2xl">SLT</span>
//           </div>
//           <h1 className="text-3xl font-bold bg-slt-gradient bg-clip-text text-transparent">
//             Welcome Back
//           </h1>
//           <p className="text-gray-600 mt-2">Sign in to your MarketHub account</p>
//         </div>

//         {/* Login Form */}
//         <div className="bg-white rounded-2xl shadow-xl p-8">
//           <form onSubmit={handleSubmit} className="space-y-6">
//             {/* Email Field */}
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-2">
//                 Email Address
//               </label>
//               <div className="relative">
//                 <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
//                 <input
//                   type="email"
//                   name="email"
//                   value={formData.email}
//                   onChange={handleChange}
//                   className={`w-full pl-10 pr-4 py-3 border rounded-xl focus:outline-none focus:ring-2 transition-all ${
//                     errors.email 
//                       ? 'border-red-500 focus:ring-red-500' 
//                       : 'border-gray-300 focus:ring-slt-secondary focus:border-transparent'
//                   }`}
//                   placeholder="Enter your email"
//                   disabled={loading}
//                 />
//               </div>
//               {errors.email && (
//                 <p className="mt-1 text-sm text-red-600 flex items-center">
//                   <AlertCircle size={14} className="mr-1" />
//                   {errors.email}
//                 </p>
//               )}
//             </div>

//             {/* Password Field */}
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-2">
//                 Password
//               </label>
//               <div className="relative">
//                 <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
//                 <input
//                   type={showPassword ? 'text' : 'password'}
//                   name="password"
//                   value={formData.password}
//                   onChange={handleChange}
//                   className={`w-full pl-10 pr-12 py-3 border rounded-xl focus:outline-none focus:ring-2 transition-all ${
//                     errors.password 
//                       ? 'border-red-500 focus:ring-red-500' 
//                       : 'border-gray-300 focus:ring-slt-secondary focus:border-transparent'
//                   }`}
//                   placeholder="Enter your password"
//                   disabled={loading}
//                 />
//                 <button
//                   type="button"
//                   onClick={() => setShowPassword(!showPassword)}
//                   className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
//                 >
//                   {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
//                 </button>
//               </div>
//               {errors.password && (
//                 <p className="mt-1 text-sm text-red-600 flex items-center">
//                   <AlertCircle size={14} className="mr-1" />
//                   {errors.password}
//                 </p>
//               )}
//             </div>

//             {/* Remember Me & Forgot Password */}
//             <div className="flex items-center justify-between">
//               <label className="flex items-center">
//                 <input
//                   type="checkbox"
//                   name="rememberMe"
//                   checked={formData.rememberMe}
//                   onChange={handleChange}
//                   className="w-4 h-4 text-slt-primary border-gray-300 rounded focus:ring-slt-primary"
//                 />
//                 <span className="ml-2 text-sm text-gray-600">Remember me</span>
//               </label>
//               <Link
//                 to="/forgot-password"
//                 className="text-sm text-slt-primary hover:text-slt-dark font-medium"
//               >
//                 Forgot password?
//               </Link>
//             </div>

//             {/* Submit Button */}
//             <Button
//               type="submit"
//               variant="primary"
//               fullWidth
//               loading={loading}
//               icon={<LogIn size={20} />}
//               className="py-3"
//             >
//               Sign In
//             </Button>
//           </form>

//           {/* Divider */}
//           <div className="relative my-6">
//             <div className="absolute inset-0 flex items-center">
//               <div className="w-full border-t border-gray-200"></div>
//             </div>
//             <div className="relative flex justify-center text-sm">
//               <span className="px-4 bg-white text-gray-500">Or continue with</span>
//             </div>
//           </div>

//           {/* Demo Logins */}
//           <div className="space-y-3">
//             <p className="text-xs text-gray-500 text-center">Quick demo access:</p>
//             <div className="grid grid-cols-3 gap-2">
//               <button
//                 onClick={() => handleDemoLogin('admin')}
//                 disabled={loading}
//                 className="px-3 py-2 text-xs font-medium text-slt-secondary bg-blue-50 rounded-lg hover:bg-blue-100 transition-all"
//               >
//                 Admin
//               </button>
//               <button
//                 onClick={() => handleDemoLogin('seller')}
//                 disabled={loading}
//                 className="px-3 py-2 text-xs font-medium text-slt-primary bg-green-50 rounded-lg hover:bg-green-100 transition-all"
//               >
//                 Seller
//               </button>
//               <button
//                 onClick={() => handleDemoLogin('customer')}
//                 disabled={loading}
//                 className="px-3 py-2 text-xs font-medium text-slt-cyan bg-teal-50 rounded-lg hover:bg-teal-100 transition-all"
//               >
//                 Customer
//               </button>
//             </div>
//           </div>

//           {/* Sign Up Link */}
//           <p className="text-center text-sm text-gray-600 mt-6">
//             Don't have an account?{' '}
//             <Link
//               to="/register"
//               className="font-medium text-slt-primary hover:text-slt-dark"
//             >
//               Sign up for free
//             </Link>
//           </p>
//         </div>
//       </div>
//     </div>
//   );
// }
