// import React, { useState } from 'react';
// import { Link, useNavigate } from 'react-router-dom';
// import { User, Mail, Lock, Phone, Store, Eye, EyeOff, UserPlus, AlertCircle } from 'lucide-react';
// import authService from '../../services/authService';
// import Button from '../../components/common/Button';
// import useToast from '../../hooks/useToast';

// export default function Register() {
//   const navigate = useNavigate();
//   const { success, error: showError } = useToast();
//   const [loading, setLoading] = useState(false);
//   const [showPassword, setShowPassword] = useState(false);
//   const [formData, setFormData] = useState({
//     name: '',
//     email: '',
//     phone: '',
//     password: '',
//     confirmPassword: '',
//     role: 'customer', // customer, seller
//     shopName: '', // for sellers only
//     shopDescription: '', // for sellers only
//     agreeTerms: false
//   });
//   const [errors, setErrors] = useState({});

//   const validateForm = () => {
//     const newErrors = {};
    
//     if (!formData.name) {
//       newErrors.name = 'Name is required';
//     } else if (formData.name.length < 3) {
//       newErrors.name = 'Name must be at least 3 characters';
//     }
    
//     if (!formData.email) {
//       newErrors.email = 'Email is required';
//     } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
//       newErrors.email = 'Invalid email address';
//     }
    
//     if (!formData.phone) {
//       newErrors.phone = 'Phone number is required';
//     } else if (!/^\+?[\d\s-()]+$/.test(formData.phone)) {
//       newErrors.phone = 'Invalid phone number';
//     }
    
//     if (!formData.password) {
//       newErrors.password = 'Password is required';
//     } else if (formData.password.length < 8) {
//       newErrors.password = 'Password must be at least 8 characters';
//     } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(formData.password)) {
//       newErrors.password = 'Password must contain uppercase, lowercase and number';
//     }
    
//     if (!formData.confirmPassword) {
//       newErrors.confirmPassword = 'Please confirm your password';
//     } else if (formData.password !== formData.confirmPassword) {
//       newErrors.confirmPassword = 'Passwords do not match';
//     }
    
//     if (formData.role === 'seller') {
//       if (!formData.shopName) {
//         newErrors.shopName = 'Shop name is required for sellers';
//       }
//       if (!formData.shopDescription) {
//         newErrors.shopDescription = 'Shop description is required';
//       }
//     }
    
//     if (!formData.agreeTerms) {
//       newErrors.agreeTerms = 'You must agree to the terms and conditions';
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
//       const registrationData = {
//         name: formData.name,
//         email: formData.email,
//         phone: formData.phone,
//         password: formData.password,
//         role: formData.role,
//         ...(formData.role === 'seller' && {
//           shopName: formData.shopName,
//           shopDescription: formData.shopDescription
//         })
//       };
      
//       const response = await authService.register(registrationData);
      
//       success('Registration successful! Welcome to MarketHub!');
      
//       // Redirect based on user role
//       if (formData.role === 'seller') {
//         navigate('/seller/dashboard');
//       } else {
//         navigate('/customer/dashboard');
//       }
//     } catch (error) {
//       showError(error.message || 'Registration failed. Please try again.');
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-teal-50 to-green-50 py-8">
//       <div className="w-full max-w-md">
//         {/* Logo and Title */}
//         <div className="text-center mb-8">
//           <div className="inline-flex items-center justify-center w-16 h-16 bg-slt-gradient rounded-2xl mb-4">
//             <span className="text-white font-bold text-2xl">SLT</span>
//           </div>
//           <h1 className="text-3xl font-bold bg-slt-gradient bg-clip-text text-transparent">
//             Create Account
//           </h1>
//           <p className="text-gray-600 mt-2">Join MarketHub today</p>
//         </div>

//         {/* Registration Form */}
//         <div className="bg-white rounded-2xl shadow-xl p-8">
//           {/* Role Selection */}
//           <div className="mb-6">
//             <label className="block text-sm font-medium text-gray-700 mb-3">
//               I want to:
//             </label>
//             <div className="grid grid-cols-2 gap-3">
//               <button
//                 type="button"
//                 onClick={() => setFormData(prev => ({ ...prev, role: 'customer' }))}
//                 className={`px-4 py-3 rounded-xl border-2 transition-all ${
//                   formData.role === 'customer'
//                     ? 'border-slt-secondary bg-blue-50 text-slt-secondary'
//                     : 'border-gray-200 hover:border-gray-300'
//                 }`}
//               >
//                 <User className="inline-block mr-2" size={18} />
//                 Buy Products
//               </button>
//               <button
//                 type="button"
//                 onClick={() => setFormData(prev => ({ ...prev, role: 'seller' }))}
//                 className={`px-4 py-3 rounded-xl border-2 transition-all ${
//                   formData.role === 'seller'
//                     ? 'border-slt-primary bg-green-50 text-slt-primary'
//                     : 'border-gray-200 hover:border-gray-300'
//                 }`}
//               >
//                 <Store className="inline-block mr-2" size={18} />
//                 Sell Products
//               </button>
//             </div>
//           </div>

//           <form onSubmit={handleSubmit} className="space-y-5">
//             {/* Name Field */}
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-2">
//                 Full Name
//               </label>
//               <div className="relative">
//                 <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
//                 <input
//                   type="text"
//                   name="name"
//                   value={formData.name}
//                   onChange={handleChange}
//                   className={`w-full pl-10 pr-4 py-3 border rounded-xl focus:outline-none focus:ring-2 transition-all ${
//                     errors.name 
//                       ? 'border-red-500 focus:ring-red-500' 
//                       : 'border-gray-300 focus:ring-slt-secondary focus:border-transparent'
//                   }`}
//                   placeholder="Enter your full name"
//                   disabled={loading}
//                 />
//               </div>
//               {errors.name && (
//                 <p className="mt-1 text-sm text-red-600 flex items-center">
//                   <AlertCircle size={14} className="mr-1" />
//                   {errors.name}
//                 </p>
//               )}
//             </div>

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

//             {/* Phone Field */}
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-2">
//                 Phone Number
//               </label>
//               <div className="relative">
//                 <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
//                 <input
//                   type="tel"
//                   name="phone"
//                   value={formData.phone}
//                   onChange={handleChange}
//                   className={`w-full pl-10 pr-4 py-3 border rounded-xl focus:outline-none focus:ring-2 transition-all ${
//                     errors.phone 
//                       ? 'border-red-500 focus:ring-red-500' 
//                       : 'border-gray-300 focus:ring-slt-secondary focus:border-transparent'
//                   }`}
//                   placeholder="+94 77 123 4567"
//                   disabled={loading}
//                 />
//               </div>
//               {errors.phone && (
//                 <p className="mt-1 text-sm text-red-600 flex items-center">
//                   <AlertCircle size={14} className="mr-1" />
//                   {errors.phone}
//                 </p>
//               )}
//             </div>

//             {/* Seller-specific fields */}
//             {formData.role === 'seller' && (
//               <>
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-2">
//                     Shop Name
//                   </label>
//                   <div className="relative">
//                     <Store className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
//                     <input
//                       type="text"
//                       name="shopName"
//                       value={formData.shopName}
//                       onChange={handleChange}
//                       className={`w-full pl-10 pr-4 py-3 border rounded-xl focus:outline-none focus:ring-2 transition-all ${
//                         errors.shopName 
//                           ? 'border-red-500 focus:ring-red-500' 
//                           : 'border-gray-300 focus:ring-slt-secondary focus:border-transparent'
//                       }`}
//                       placeholder="Enter your shop name"
//                       disabled={loading}
//                     />
//                   </div>
//                   {errors.shopName && (
//                     <p className="mt-1 text-sm text-red-600 flex items-center">
//                       <AlertCircle size={14} className="mr-1" />
//                       {errors.shopName}
//                     </p>
//                   )}
//                 </div>

//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-2">
//                     Shop Description
//                   </label>
//                   <textarea
//                     name="shopDescription"
//                     value={formData.shopDescription}
//                     onChange={handleChange}
//                     rows="3"
//                     className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 transition-all ${
//                       errors.shopDescription 
//                         ? 'border-red-500 focus:ring-red-500' 
//                         : 'border-gray-300 focus:ring-slt-secondary focus:border-transparent'
//                     }`}
//                     placeholder="Describe what you'll be selling..."
//                     disabled={loading}
//                   />
//                   {errors.shopDescription && (
//                     <p className="mt-1 text-sm text-red-600 flex items-center">
//                       <AlertCircle size={14} className="mr-1" />
//                       {errors.shopDescription}
//                     </p>
//                   )}
//                 </div>
//               </>
//             )}

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
//                   placeholder="Create a strong password"
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

//             {/* Confirm Password Field */}
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-2">
//                 Confirm Password
//               </label>
//               <div className="relative">
//                 <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
//                 <input
//                   type={showPassword ? 'text' : 'password'}
//                   name="confirmPassword"
//                   value={formData.confirmPassword}
//                   onChange={handleChange}
//                   className={`w-full pl-10 pr-4 py-3 border rounded-xl focus:outline-none focus:ring-2 transition-all ${
//                     errors.confirmPassword 
//                       ? 'border-red-500 focus:ring-red-500' 
//                       : 'border-gray-300 focus:ring-slt-secondary focus:border-transparent'
//                   }`}
//                   placeholder="Confirm your password"
//                   disabled={loading}
//                 />
//               </div>
//               {errors.confirmPassword && (
//                 <p className="mt-1 text-sm text-red-600 flex items-center">
//                   <AlertCircle size={14} className="mr-1" />
//                   {errors.confirmPassword}
//                 </p>
//               )}
//             </div>

//             {/* Terms and Conditions */}
//             <div>
//               <label className="flex items-start">
//                 <input
//                   type="checkbox"
//                   name="agreeTerms"
//                   checked={formData.agreeTerms}
//                   onChange={handleChange}
//                   className="w-4 h-4 mt-1 text-slt-primary border-gray-300 rounded focus:ring-slt-primary"
//                 />
//                 <span className="ml-2 text-sm text-gray-600">
//                   I agree to the{' '}
//                   <Link to="/terms" className="text-slt-primary hover:text-slt-dark">
//                     Terms and Conditions
//                   </Link>{' '}
//                   and{' '}
//                   <Link to="/privacy" className="text-slt-primary hover:text-slt-dark">
//                     Privacy Policy
//                   </Link>
//                 </span>
//               </label>
//               {errors.agreeTerms && (
//                 <p className="mt-1 text-sm text-red-600 flex items-center">
//                   <AlertCircle size={14} className="mr-1" />
//                   {errors.agreeTerms}
//                 </p>
//               )}
//             </div>

//             {/* Submit Button */}
//             <Button
//               type="submit"
//               variant="primary"
//               fullWidth
//               loading={loading}
//               icon={<UserPlus size={20} />}
//               className="py-3"
//             >
//               Create Account
//             </Button>
//           </form>

//           {/* Sign In Link */}
//           <p className="text-center text-sm text-gray-600 mt-6">
//             Already have an account?{' '}
//             <Link
//               to="/login"
//               className="font-medium text-slt-primary hover:text-slt-dark"
//             >
//               Sign in
//             </Link>
//           </p>
//         </div>
//       </div>
//     </div>
//   );
// }
