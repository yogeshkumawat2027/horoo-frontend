"use client";
import { useState } from "react";
import Image from "next/image";
import { 
  FaHome, 
  FaBuilding, 
  FaBed, 
  FaHotel,
  FaUtensils,
  FaWarehouse,
  FaMapMarkerAlt,
  FaPhone,
  FaEnvelope,
  FaStar,
  FaUsers,
  FaShieldAlt,
  FaBars,
  FaTimes
} from 'react-icons/fa';

export default function HomePage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="bg-white shadow-lg sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-orange-500">
                  <Image
                    src="/logo/logo.jpg"
                    alt="Horoo Logo"
                    width={48}
                    height={48}
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
              <div className="ml-3">
                <span className="text-2xl font-bold bg-gradient-to-r from-orange-500 to-red-500 bg-clip-text text-transparent">
                  Horoo
                </span>
              </div>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:block">
              <div className="ml-10 flex items-baseline space-x-8">
                <a href="#" className="text-gray-700 hover:text-orange-500 px-3 py-2 text-sm font-medium transition-colors">
                  Home
                </a>
                <a href="#" className="text-gray-700 hover:text-orange-500 px-3 py-2 text-sm font-medium transition-colors">
                  Properties
                </a>
                <a href="#" className="text-gray-700 hover:text-orange-500 px-3 py-2 text-sm font-medium transition-colors">
                  About
                </a>
                <a href="#" className="text-gray-700 hover:text-orange-500 px-3 py-2 text-sm font-medium transition-colors">
                  Contact
                </a>
                <a href="#" className="bg-gradient-to-r from-orange-500 to-red-500 text-white px-6 py-2 rounded-full text-sm font-medium hover:shadow-lg transition-all">
                  List Property
                </a>
              </div>
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden">
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="text-gray-700 hover:text-orange-500 focus:outline-none"
              >
                {mobileMenuOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-white border-t border-gray-200">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
              <a href="#" className="text-gray-700 hover:text-orange-500 block px-3 py-2 text-base font-medium">
                Home
              </a>
              <a href="#" className="text-gray-700 hover:text-orange-500 block px-3 py-2 text-base font-medium">
                Properties
              </a>
              <a href="#" className="text-gray-700 hover:text-orange-500 block px-3 py-2 text-base font-medium">
                About
              </a>
              <a href="#" className="text-gray-700 hover:text-orange-500 block px-3 py-2 text-base font-medium">
                Contact
              </a>
              <a href="#" className="bg-gradient-to-r from-orange-500 to-red-500 text-white block px-3 py-2 rounded-md text-base font-medium">
                List Property
              </a>
            </div>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-orange-50 via-red-50 to-orange-100 py-20 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
              Find Your Perfect
              <span className="block bg-gradient-to-r from-orange-500 to-red-500 bg-clip-text text-transparent">
                Living Space
              </span>
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
              Discover thousands of rooms, flats, hostels, and commercial spaces across India. 
              Your ideal property is just a click away with Horoo.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <button className="bg-gradient-to-r from-orange-500 to-red-500 text-white px-8 py-4 rounded-full text-lg font-semibold hover:shadow-xl transform hover:scale-105 transition-all">
                Start Searching
              </button>
              <button className="border-2 border-orange-500 text-orange-500 px-8 py-4 rounded-full text-lg font-semibold hover:bg-orange-500 hover:text-white transition-all">
                List Your Property
              </button>
            </div>
          </div>
        </div>
        
        {/* Decorative elements */}
        <div className="absolute top-10 left-10 w-20 h-20 bg-orange-200 rounded-full opacity-50 animate-pulse"></div>
        <div className="absolute bottom-10 right-10 w-32 h-32 bg-red-200 rounded-full opacity-50 animate-pulse"></div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              What We Offer
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Comprehensive property solutions for all your accommodation needs
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Feature cards */}
            {[
              {
                icon: FaBed,
                title: "Rooms & PGs",
                description: "Comfortable single and shared rooms with all amenities for students and working professionals."
              },
              {
                icon: FaHome,
                title: "Flats & Apartments",
                description: "Fully furnished and unfurnished flats for families and individuals looking for independent living."
              },
              {
                icon: FaBuilding,
                title: "Hostels",
                description: "Budget-friendly hostel accommodations with modern facilities and security."
              },
              {
                icon: FaHotel,
                title: "Hotel Rooms",
                description: "Temporary stays and short-term accommodations with hotel-like amenities."
              },
              {
                icon: FaUtensils,
                title: "Mess Services",
                description: "Hygienic and delicious meal services with various cuisine options."
              },
              {
                icon: FaWarehouse,
                title: "Commercial Spaces",
                description: "Office spaces, shops, and commercial properties for your business needs."
              }
            ].map((feature, index) => (
              <div key={index} className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition-shadow border border-gray-100">
                <div className="w-16 h-16 bg-gradient-to-r from-orange-400 to-red-500 rounded-lg flex items-center justify-center mb-6">
                  <feature.icon className="text-2xl text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

   

      {/* Why Choose Us Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Why Choose Horoo?
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              We make property hunting simple, secure, and stress-free
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: FaStar,
                title: "Verified Properties",
                description: "All properties are verified and authenticated for your safety and peace of mind."
              },
              {
                icon: FaUsers,
                title: "Expert Support",
                description: "Our dedicated team provides 24/7 support to help you find the perfect property."
              },
              {
                icon: FaShieldAlt,
                title: "Secure Transactions",
                description: "Safe and secure booking process with transparent pricing and no hidden fees."
              }
            ].map((reason, index) => (
              <div key={index} className="text-center">
                <div className="w-20 h-20 bg-gradient-to-r from-orange-400 to-red-500 rounded-full flex items-center justify-center mx-auto mb-6">
                  <reason.icon className="text-3xl text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">{reason.title}</h3>
                <p className="text-gray-600">{reason.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {/* Company Info */}
            <div className="col-span-1 md:col-span-2">
              <div className="flex items-center mb-6">
                <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-orange-500 mr-3">
                  <Image
                    src="/logo/logo.jpg"
                    alt="Horoo Logo"
                    width={48}
                    height={48}
                    className="w-full h-full object-cover"
                  />
                </div>
                <span className="text-2xl font-bold">Horoo</span>
              </div>
              <p className="text-gray-400 mb-6 max-w-md">
                Your trusted partner in finding the perfect living space. 
                We connect property seekers with verified accommodations across India.
              </p>
              <div className="flex space-x-4">
                <div className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-orange-500 transition-colors cursor-pointer">
                  <span className="text-sm font-bold">f</span>
                </div>
                <div className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-orange-500 transition-colors cursor-pointer">
                  <span className="text-sm font-bold">t</span>
                </div>
                <div className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-orange-500 transition-colors cursor-pointer">
                  <span className="text-sm font-bold">in</span>
                </div>
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h3 className="text-lg font-semibold mb-6">Quick Links</h3>
              <ul className="space-y-3">
                <li><a href="#" className="text-gray-400 hover:text-orange-500 transition-colors">Home</a></li>
                <li><a href="#" className="text-gray-400 hover:text-orange-500 transition-colors">Properties</a></li>
                <li><a href="#" className="text-gray-400 hover:text-orange-500 transition-colors">About Us</a></li>
                <li><a href="#" className="text-gray-400 hover:text-orange-500 transition-colors">Contact</a></li>
                <li><a href="#" className="text-gray-400 hover:text-orange-500 transition-colors">Privacy Policy</a></li>
              </ul>
            </div>

            {/* Contact Info */}
            <div>
              <h3 className="text-lg font-semibold mb-6">Contact Us</h3>
              <ul className="space-y-3">
                <li className="flex items-center">
                  <FaMapMarkerAlt className="text-orange-500 mr-3" />
                  <span className="text-gray-400">Kota,Rajasthan</span>
                </li>
                <li className="flex items-center">
                  <FaPhone className="text-orange-500 mr-3" />
                  <span className="text-gray-400">+91 9166260477</span>
                </li>
                <li className="flex items-center">
                  <FaEnvelope className="text-orange-500 mr-3" />
                  <span className="text-gray-400">horoobooking@gmail.com</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="border-t border-gray-800 mt-12 pt-8 text-center">
            <p className="text-gray-400">
              © 2025 Horoo. All rights reserved. | Made with ❤️ in India
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}