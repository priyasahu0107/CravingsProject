import { Outlet, Link, useLocation } from 'react-router-dom';
import { ShoppingCart, Search, MapPin, User, Menu, X } from 'lucide-react';
import { useState } from 'react';
import { useCartStore } from '../store/cartStore';

export default function Layout() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const totalItems = useCartStore(state => state.getTotalItems());
  const location = useLocation();

  const navLinks = [
    { path: '/', label: 'Home' },
    { path: '/restaurants', label: 'Restaurants' },
    { path: '/order-tracking', label: 'Track Order' },
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-2">
              <span className="text-2xl">🍔</span>
              <span className="text-xl font-bold bg-gradient-to-r from-orange-500 to-red-500 bg-clip-text text-transparent">
                Cravings
              </span>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-8">
              {navLinks.map(link => (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`text-sm font-medium transition-colors ${
                    location.pathname === link.path
                      ? 'text-orange-600'
                      : 'text-gray-600 hover:text-orange-500'
                  }`}
                >
                  {link.label}
                </Link>
              ))}
            </nav>

            {/* Right Section */}
            <div className="flex items-center gap-3">
              {/* Location */}
              <div className="hidden lg:flex items-center gap-1 text-sm text-gray-600">
                <MapPin size={16} className="text-orange-500" />
                <span>Bangalore</span>
              </div>

              {/* Search */}
              <Link to="/search" className="hidden sm:flex items-center gap-2 px-3 py-2 bg-gray-100 rounded-full text-sm text-gray-500 hover:bg-gray-200 transition-colors">
                <Search size={16} />
                <span className="hidden md:inline">Search food...</span>
              </Link>

              {/* Cart */}
              <Link to="/cart" className="relative p-2 rounded-full hover:bg-orange-50 transition-colors">
                <ShoppingCart size={22} className="text-gray-700" />
                {totalItems > 0 && (
                  <span className="absolute -top-1 -right-1 bg-orange-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center font-bold">
                    {totalItems}
                  </span>
                )}
              </Link>

              {/* User */}
              <button className="hidden md:flex p-2 rounded-full hover:bg-orange-50 transition-colors">
                <User size={22} className="text-gray-700" />
              </button>

              {/* Mobile Menu Toggle */}
              <button
                className="md:hidden p-2 rounded-full hover:bg-orange-50 transition-colors"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              >
                {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-white border-t">
            <div className="px-4 py-3 space-y-2">
              {navLinks.map(link => (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`block px-3 py-2 rounded-lg text-sm font-medium ${
                    location.pathname === link.path
                      ? 'bg-orange-50 text-orange-600'
                      : 'text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  {link.label}
                </Link>
              ))}
              <Link
                to="/search"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-2 px-3 py-2 text-sm text-gray-600"
              >
                <Search size={16} />
                Search food
              </Link>
            </div>
          </div>
        )}
      </header>

      {/* Main Content */}
      <main className="flex-1">
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <span className="text-2xl">🍔</span>
                <span className="text-xl font-bold">Cravings</span>
              </div>
              <p className="text-gray-400 text-sm">
                Your favorite food, delivered fast. Order from the best restaurants in your city.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-3">Company</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">About Us</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Careers</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Blog</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-3">For You</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Terms & Conditions</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Support</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-3">Partner With Us</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">Register Restaurant</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Become a Rider</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Business Account</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-sm text-gray-400">
            © 2026 Cravings. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}
