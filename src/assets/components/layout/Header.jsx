import React, { useState, useEffect } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { Search, ShoppingCart, User, Menu, X, Bell } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import { useNotifications } from '../../context/NotificationContext'
import { useCart } from '../../context/CartContext'
import { ThemeToggle } from './ThemeToggle'

export const Header = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false)
    const [isProfileOpen, setIsProfileOpen] = useState(false)
    const [isNotificationOpen, setIsNotificationOpen] = useState(false)
    const { user, logout } = useAuth()
    const { notifications, markAsRead } = useNotifications()
    const { itemCount: cartItemCount } = useCart()
    const location = useLocation()
    const navigate = useNavigate()

    const isActive = (path) => location.pathname === path
    const unreadCount = notifications.filter((n) => !n.read).length

    useEffect(() => {
        const handleClickOutside = (event) => {
            const target = event.target
            if (isNotificationOpen && !target.closest('.notification-container')) {
                setIsNotificationOpen(false)
            }
        }
        document.addEventListener('mousedown', handleClickOutside)
        return () => {
            document.removeEventListener('mousedown', handleClickOutside)
        }
    }, [isNotificationOpen])

    const role = (user?.role || 'customer').toLowerCase()

    return (
        <header className="bg-white dark:bg-gray-900 shadow-sm sticky top-0 z-50 transition-colors duration-200">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    {/* Logo */}
                    <Link to="/" className="flex items-center space-x-2">
                        <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-teal-600 rounded-lg flex items-center justify-center">
                            <span className="text-white font-bold text-sm">MH</span>
                        </div>
                        <span className="text-xl font-bold text-gray-900">Market Hub</span>
                    </Link>

                    {/* Desktop Navigation */}
                    <nav className="hidden md:flex items-center space-x-8">
                        <Link
                            to="/catalog"
                            className={`text-sm font-medium transition-colors ${isActive('/catalog')
                                    ? 'text-blue-600 dark:text-blue-400'
                                    : 'text-gray-700 hover:text-blue-600 dark:text-gray-300 dark:hover:text-blue-400'
                                }`}
                        >
                            Products
                        </Link>
                        <Link
                            to="/orders"
                            className={`text-sm font-medium transition-colors ${isActive('/orders')
                                    ? 'text-blue-600 dark:text-blue-400'
                                    : 'text-gray-700 hover:text-blue-600 dark:text-gray-300 dark:hover:text-blue-400'
                                }`}
                        >
                            Orders
                        </Link>
                        {role === 'partner' && (
                            <Link
                                to="/partner"
                                className={`text-sm font-medium transition-colors ${isActive('/partner')
                                        ? 'text-blue-600 dark:text-blue-400'
                                        : 'text-gray-700 hover:text-blue-600 dark:text-gray-300 dark:hover:text-blue-400'
                                    }`}
                            >
                                Partner Portal
                            </Link>
                        )}
                        {role === 'admin' && (
                            <Link
                                to="/admin"
                                className={`text-sm font-medium transition-colors ${isActive('/admin')
                                        ? 'text-blue-600 dark:text-blue-400'
                                        : 'text-gray-700 hover:text-blue-600 dark:text-gray-300 dark:hover:text-blue-400'
                                    }`}
                            >
                                Admin
                            </Link>
                        )}
                    </nav>

                    {/* Search Bar */}
                    <div className="hidden md:flex items-center flex-1 max-w-lg mx-8">
                        <div className="relative w-full">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                            <input
                                type="text"
                                placeholder="Search products..."
                                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                        </div>
                    </div>

                    {/* Right Side Actions */}
                    <div className="flex items-center space-x-3">
                        <ThemeToggle className="hidden sm:flex" />

                        {/* Notifications */}
                        <div className="relative notification-container">
                            <button
                                className="relative p-2 text-gray-700 hover:text-blue-600 dark:text-gray-300 dark:hover:text-blue-400 transition-colors border border-gray-200 dark:border-gray-700 rounded-md hover:bg-gray-50 dark:hover:bg-gray-800"
                                onClick={() => setIsNotificationOpen(!isNotificationOpen)}
                                aria-expanded={isNotificationOpen}
                                aria-label={`${unreadCount > 0 ? unreadCount + ' unread ' : ''
                                    }notifications`}
                            >
                                <Bell className="w-5 h-5" />
                                {unreadCount > 0 && (
                                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                                        {unreadCount}
                                    </span>
                                )}
                            </button>

                            {isNotificationOpen && (
                                <div className="absolute right-0 mt-2 w-80 bg-white dark:bg-gray-800 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700 z-50">
                                    <div className="p-3 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
                                        <h3 className="font-medium text-gray-900 dark:text-white">
                                            Notifications
                                        </h3>
                                        {unreadCount > 0 && (
                                            <button
                                                onClick={() => {
                                                    notifications.forEach((notification) => {
                                                        if (!notification.read) {
                                                            markAsRead(notification.notificationId)
                                                        }
                                                    })
                                                }}
                                                className="text-xs text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
                                            >
                                                Mark all as read
                                            </button>
                                        )}
                                    </div>
                                    <div className="max-h-96 overflow-y-auto">
                                        {notifications.length > 0 ? (
                                            <ul className="divide-y divide-gray-200 dark:divide-gray-700">
                                                {notifications.map((notification) => (
                                                    <li
                                                        key={notification.notificationId}
                                                        className={`p-3 hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer ${!notification.read
                                                                ? 'bg-blue-50 dark:bg-blue-900/30'
                                                                : ''
                                                            }`}
                                                        onClick={() => {
                                                            markAsRead(notification.notificationId)
                                                            if (
                                                                notification.type === 'OrderConfirmation'
                                                            ) {
                                                                const orderId =
                                                                    notification.message.match(/#(ORD-\d+)/)?.[1]
                                                                if (orderId) {
                                                                    navigate(`/orders/${orderId}`)
                                                                    setIsNotificationOpen(false)
                                                                }
                                                            }
                                                        }}
                                                    >
                                                        <div className="flex items-start">
                                                            <div className="flex-shrink-0 pt-0.5">
                                                                {!notification.read && (
                                                                    <span className="h-2 w-2 bg-blue-500 rounded-full inline-block mr-2"></span>
                                                                )}
                                                            </div>
                                                            <div className="ml-3 w-0 flex-1">
                                                                <p className="text-sm font-medium text-gray-900 dark:text-white">
                                                                    {notification.type ===
                                                                        'OrderConfirmation' && 'Order Update'}
                                                                    {notification.type === 'Promotion' &&
                                                                        'Special Offer'}
                                                                    {notification.type === 'Alert' &&
                                                                        'Important Alert'}
                                                                </p>
                                                                <p className="text-sm text-gray-500 dark:text-gray-400">
                                                                    {notification.message}
                                                                </p>
                                                                <p className="mt-1 text-xs text-gray-400">
                                                                    {new Date(
                                                                        notification.sentAt
                                                                    ).toLocaleString()}
                                                                </p>
                                                            </div>
                                                        </div>
                                                    </li>
                                                ))}
                                            </ul>
                                        ) : (
                                            <div className="p-4 text-center text-sm text-gray-500 dark:text-gray-400">
                                                No notifications
                                            </div>
                                        )}
                                    </div>
                                    <div className="p-2 border-t border-gray-200 dark:border-gray-700 text-center">
                                        <Link
                                            to="/notifications"
                                            className="text-sm font-medium text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
                                            onClick={() => setIsNotificationOpen(false)}
                                        >
                                            View all notifications
                                        </Link>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Cart */}
                        <Link
                            to="/cart"
                            className="relative p-2 text-gray-700 hover:text-blue-600 dark:text-gray-300 dark:hover:text-blue-400 transition-colors border border-gray-200 dark:border-gray-700 rounded-md hover:bg-gray-50 dark:hover:bg-gray-800"
                            aria-label="Shopping Cart"
                        >
                            <ShoppingCart className="w-6 h-6" style={{ display: 'block' }} />
                            {cartItemCount > 0 && (
                                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                                    {cartItemCount > 9 ? '9+' : cartItemCount}
                                </span>
                            )}
                            <span className="sr-only">
                                {cartItemCount === 0
                                    ? 'Shopping Cart'
                                    : `Shopping Cart with ${cartItemCount} ${cartItemCount === 1 ? 'item' : 'items'
                                    }`}
                            </span>
                        </Link>

                        {/* User Menu */}
                        <div className="relative">
                            {user ? (
                                <>
                                    <button
                                        onClick={() => setIsProfileOpen(!isProfileOpen)}
                                        className="flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors border border-gray-200 dark:border-gray-700"
                                        aria-expanded={isProfileOpen}
                                        aria-haspopup="true"
                                    >
                                        <User
                                            className="w-6 h-6 text-blue-600"
                                            style={{ display: 'block' }}
                                        />
                                        <span className="hidden md:block text-sm text-gray-700 dark:text-gray-300">
                                            {user.name}
                                        </span>
                                    </button>
                                </>
                            ) : (
                                <Link
                                    to="/login"
                                    className="flex items-center space-x-2 px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-md transition-colors"
                                >
                                    <User className="w-4 h-4" />
                                    <span>Sign In</span>
                                </Link>
                            )}

                            {isProfileOpen && user && (
                                <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 py-1 z-50">
                                    <Link
                                        to="/dashboard"
                                        className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                                        onClick={() => setIsProfileOpen(false)}
                                    >
                                        Dashboard
                                    </Link>
                                    <Link
                                        to="/profile"
                                        className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                                        onClick={() => setIsProfileOpen(false)}
                                    >
                                        Profile
                                    </Link>
                                    <button
                                        onClick={() => {
                                            logout()
                                            setIsProfileOpen(false)
                                            navigate('/')
                                        }}
                                        className="block w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                                    >
                                        Sign Out
                                    </button>
                                </div>
                            )}
                        </div>

                        {/* Mobile Menu Button */}
                        <button
                            onClick={() => setIsMenuOpen(!isMenuOpen)}
                            className="md:hidden p-2 text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                            aria-expanded={isMenuOpen}
                            aria-label={isMenuOpen ? 'Close menu' : 'Open menu'}
                        >
                            {isMenuOpen ? (
                                <X className="w-5 h-5" />
                            ) : (
                                <Menu className="w-5 h-5" />
                            )}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Menu */}
            {isMenuOpen && (
                <div className="md:hidden bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700">
                    <div className="px-4 py-2 space-y-1">
                        <Link
                            to="/catalog"
                            className="block py-2 text-sm text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400"
                            onClick={() => setIsMenuOpen(false)}
                        >
                            Products
                        </Link>
                        <Link
                            to="/orders"
                            className="block py-2 text-sm text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400"
                            onClick={() => setIsMenuOpen(false)}
                        >
                            Orders
                        </Link>
                        {role === 'partner' && (
                            <Link
                                to="/partner"
                                className="block py-2 text-sm text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400"
                                onClick={() => setIsMenuOpen(false)}
                            >
                                Partner Portal
                            </Link>
                        )}
                        {role === 'admin' && (
                            <Link
                                to="/admin"
                                className="block py-2 text-sm text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400"
                                onClick={() => setIsMenuOpen(false)}
                            >
                                Admin
                            </Link>
                        )}
                    </div>
                </div>
            )}
        </header>
    )
}
