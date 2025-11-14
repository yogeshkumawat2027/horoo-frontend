"use client";
import { useRouter } from "next/navigation";
import toast, { Toaster } from 'react-hot-toast';
import { 
  FaHome, 
  FaPlus, 
  FaFilter, 
  FaSearch,
  FaEye,
  FaEdit,
  FaTrash
} from 'react-icons/fa';

import { useState, useEffect } from "react";
import axios from "axios";

export default function HostelPage() {
  const router = useRouter();
  const api = "https://horoo-backend-latest.onrender.com/api";
  const [hostels, setHostels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(false);
  
  // Location data
  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);
  const [areas, setAreas] = useState([]);
  
  // Filter state
  const [filters, setFilters] = useState({
    search: "",
    state: "",
    city: "",
    area: "",
    roomType: "",
    availableFor: "",
    availability: "",
    isVerified: "",
    isShow: ""
  });
  
  // Search suggestions
  const [searchSuggestions, setSearchSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  useEffect(() => {
    fetchHostels();
    fetchStates();
  }, []);

  useEffect(() => {
    if (filters.state) {
      fetchCities(filters.state);
      setFilters(prev => ({ ...prev, city: "", area: "" }));
    }
  }, [filters.state]);

  useEffect(() => {
    if (filters.city) {
      fetchAreas(filters.city);
      setFilters(prev => ({ ...prev, area: "" }));
    }
  }, [filters.city]);

  const fetchHostels = async () => {
    try {
      setLoading(true);
      // Use filter API to get populated location data
      const res = await axios.get(`${api}/hostels/filter`);
      if (res.data.success) setHostels(res.data.hostels);
    } catch (err) {
      toast.error("Failed to fetch hostels");
    } finally {
      setLoading(false);
    }
  };

  const fetchStates = async () => {
    try {
      const res = await axios.get(`${api}/states`);
      if (res.data.success) setStates(res.data.states);
    } catch (error) {
      console.error("Error fetching states:", error);
    }
  };

  const fetchCities = async (stateId) => {
    try {
      const res = await axios.get(`${api}/cities/${stateId}`);
      if (res.data.success) setCities(res.data.cities);
    } catch (error) {
      setCities([]);
    }
  };

  const fetchAreas = async (cityId) => {
    try {
      const res = await axios.get(`${api}/areas/${cityId}`);
      if (res.data.success) setAreas(res.data.areas);
    } catch (error) {
      setAreas([]);
    }
  };

  const handleSearch = async () => {
    if (!filters.search.trim()) {
      fetchHostels();
      return;
    }

    try {
      setLoading(true);
      const queryParams = new URLSearchParams();
      Object.keys(filters).forEach(key => {
        if (filters[key]) queryParams.append(key, filters[key]);
      });

      const res = await axios.get(`${api}/hostels/filter?${queryParams.toString()}`);
      if (res.data.success) {
        setHostels(res.data.hostels);
        toast.success(`Found ${res.data.hostels.length} hostels`);
      }
    } catch (error) {
      toast.error("Search failed");
    } finally {
      setLoading(false);
      setShowSuggestions(false);
    }
  };

  const handleFilterSearch = async () => {
    try {
      setLoading(true);
      const queryParams = new URLSearchParams();
      Object.keys(filters).forEach(key => {
        if (filters[key]) queryParams.append(key, filters[key]);
      });

      const res = await axios.get(`${api}/hostels/filter?${queryParams.toString()}`);
      if (res.data.success) {
        setHostels(res.data.hostels);
        toast.success(`Found ${res.data.hostels.length} hostels`);
      }
    } catch (error) {
      toast.error("Filter search failed");
    } finally {
      setLoading(false);
    }
  };

  const clearAllFilters = () => {
    setFilters({
      search: "",
      state: "",
      city: "",
      area: "",
      roomType: "",
      availableFor: "",
      availability: "",
      isVerified: "",
      isShow: ""
    });
    setCities([]);
    setAreas([]);
    fetchHostels();
  };

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const generateSearchSuggestions = (searchTerm) => {
    if (!searchTerm || searchTerm.length < 2) {
      setSearchSuggestions([]);
      setShowSuggestions(false);
      return;
    }

    const suggestions = new Set();
    
    hostels.forEach(hostel => {
      // Add Horoo IDs
      if (hostel.horooId && hostel.horooId.toLowerCase().includes(searchTerm.toLowerCase())) {
        suggestions.add(`ID: ${hostel.horooId}`);
      }
      
      // Add Owner Names
      if (hostel.ownerName && hostel.ownerName.toLowerCase().includes(searchTerm.toLowerCase())) {
        suggestions.add(`Owner: ${hostel.ownerName}`);
      }
      
      // Add Property Names
      if (hostel.propertyName && hostel.propertyName.toLowerCase().includes(searchTerm.toLowerCase())) {
        suggestions.add(`Property: ${hostel.propertyName}`);
      }
      
      // Add Mobile Numbers
      if (hostel.ownerMobile && hostel.ownerMobile.includes(searchTerm)) {
        suggestions.add(`Mobile: ${hostel.ownerMobile}`);
      }
      
      // Add Pincodes
      if (hostel.pincode && hostel.pincode.includes(searchTerm)) {
        suggestions.add(`Pincode: ${hostel.pincode}`);
      }
      
      // Add Nearby Areas
      if (hostel.nearbyAreas && Array.isArray(hostel.nearbyAreas)) {
        hostel.nearbyAreas.forEach(area => {
          if (area && area.toLowerCase().includes(searchTerm.toLowerCase())) {
            suggestions.add(`Area: ${area}`);
          }
        });
      }
    });

    setSearchSuggestions(Array.from(suggestions).slice(0, 8));
    setShowSuggestions(suggestions.size > 0);
  };

  const handleSearchChange = (value) => {
    setFilters(prev => ({ ...prev, search: value }));
    generateSearchSuggestions(value);
  };

  const selectSuggestion = (suggestion) => {
    setFilters(prev => ({ ...prev, search: suggestion }));
    setShowSuggestions(false);
  };

  return (
    <div className="min-h-screen ml-72 bg-gray-50 p-6">
      <Toaster position="top-right" />
      
      {/* Header */}
      <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-orange-500 p-3 rounded-lg">
              <FaHome className="text-white text-xl" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-800">Hostel Management</h1>
              <p className="text-gray-600">Manage all hostel properties</p>
            </div>
          </div>
          
          <button
            onClick={() => router.push('/master-admin/listing/hostel/addhostel')}
            className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 rounded-lg flex items-center gap-2 font-medium transition-colors"
          >
            <FaPlus /> Add New Hostel
          </button>
        </div>
      </div>

      {/* Search and Filter Section */}
      <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
        {/* Search Bar */}
        <div className="relative mb-4">
          <div className="flex gap-3">
            <div className="flex-1 relative">
              <input
                type="text"
                placeholder="Search by ID, Owner, Property, Mobile, Pincode, Area..."
                value={filters.search}
                onChange={(e) => handleSearchChange(e.target.value)}
                onFocus={() => generateSearchSuggestions(filters.search)}
                className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              />
              <FaSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
              
              {/* Search Suggestions */}
              {showSuggestions && searchSuggestions.length > 0 && (
                <div className="absolute top-full left-0 right-0 bg-white border border-gray-200 rounded-lg shadow-lg z-10 mt-1">
                  {searchSuggestions.map((suggestion, index) => (
                    <div
                      key={index}
                      onClick={() => selectSuggestion(suggestion)}
                      className="px-4 py-2 hover:bg-gray-50 cursor-pointer border-b border-gray-100 last:border-b-0"
                    >
                      {suggestion}
                    </div>
                  ))}
                </div>
              )}
            </div>
            
            <button
              onClick={handleSearch}
              className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 rounded-lg flex items-center gap-2 font-medium transition-colors"
            >
              <FaSearch /> Search
            </button>
            
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`${showFilters ? 'bg-orange-500 text-white' : 'bg-gray-100 text-gray-700'} px-6 py-3 rounded-lg flex items-center gap-2 font-medium transition-colors`}
            >
              <FaFilter /> Filters
            </button>
          </div>
        </div>

        {/* Advanced Filters */}
        {showFilters && (
          <div className="border-t pt-4 mt-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
              
              {/* State Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">State</label>
                <select
                  value={filters.state}
                  onChange={(e) => handleFilterChange('state', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
                >
                  <option value="">All States</option>
                  {states.map((state) => (
                    <option key={state._id} value={state._id}>{state.name}</option>
                  ))}
                </select>
              </div>

              {/* City Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">City</label>
                <select
                  value={filters.city}
                  onChange={(e) => handleFilterChange('city', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
                  disabled={!filters.state}
                >
                  <option value="">All Cities</option>
                  {cities.map((city) => (
                    <option key={city._id} value={city._id}>{city.name}</option>
                  ))}
                </select>
              </div>

              {/* Area Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Area</label>
                <select
                  value={filters.area}
                  onChange={(e) => handleFilterChange('area', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
                  disabled={!filters.city}
                >
                  <option value="">All Areas</option>
                  {areas.map((area) => (
                    <option key={area._id} value={area._id}>{area.name}</option>
                  ))}
                </select>
              </div>

              {/* Room Type Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Room Type</label>
                <select
                  value={filters.roomType}
                  onChange={(e) => handleFilterChange('roomType', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
                >
                  <option value="">All Types</option>
                  <option value="Single">Single</option>
                  <option value="Double">Double</option>
                  <option value="Triple">Triple</option>
                </select>
              </div>

              {/* Available For Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Available For</label>
                <select
                  value={filters.availableFor}
                  onChange={(e) => handleFilterChange('availableFor', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
                >
                  <option value="">All</option>
                  <option value="Boys">Boys</option>
                  <option value="Girls">Girls</option>
                  <option value="Family">Family</option>
                </select>
              </div>

              {/* Availability Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Availability</label>
                <select
                  value={filters.availability}
                  onChange={(e) => handleFilterChange('availability', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
                >
                  <option value="">All</option>
                  <option value="true">Available</option>
                  <option value="false">Not Available</option>
                </select>
              </div>

              {/* Verification Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Verification</label>
                <select
                  value={filters.isVerified}
                  onChange={(e) => handleFilterChange('isVerified', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
                >
                  <option value="">All</option>
                  <option value="true">Verified</option>
                  <option value="false">Not Verified</option>
                </select>
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={handleFilterSearch}
                className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-2 rounded-lg font-medium transition-colors"
              >
                Apply Filters
              </button>
              <button
                onClick={clearAllFilters}
                className="bg-gray-500 hover:bg-gray-600 text-white px-6 py-2 rounded-lg font-medium transition-colors"
              >
                Clear All
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Hostels Grid */}
      <div className="bg-white rounded-lg shadow-sm">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-800">
              All Hostels ({hostels.length})
            </h2>
          </div>
        </div>

        {loading ? (
          <div className="p-12 text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading hostels...</p>
          </div>
        ) : hostels.length === 0 ? (
          <div className="p-12 text-center">
            <FaHome className="mx-auto text-gray-400 text-4xl mb-4" />
            <p className="text-gray-600 text-lg">No hostels found</p>
            <button
              onClick={() => router.push('/master-admin/listing/hostel/addhostel')}
              className="mt-4 bg-orange-500 hover:bg-orange-600 text-white px-6 py-2 rounded-lg flex items-center gap-2 mx-auto"
            >
              <FaPlus /> Add First Hostel
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Hostel Info</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Owner</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Location</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type & Price</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {hostels.map((hostel) => (
                  <tr key={hostel._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        {hostel.mainImage ? (
                          <img
                            src={hostel.mainImage}
                            alt={hostel.horooName}
                            className="h-12 w-12 rounded-lg object-cover mr-4"
                          />
                        ) : (
                          <div className="h-12 w-12 bg-gray-200 rounded-lg flex items-center justify-center mr-4">
                            <FaHome className="text-gray-400" />
                          </div>
                        )}
                        <div>
                          <div className="text-sm font-medium text-gray-900">{hostel.horooId}</div>
                          <div className="text-sm text-gray-500">{hostel.horooName}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{hostel.ownerName}</div>
                      <div className="text-sm text-gray-500">{hostel.ownerMobile}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {hostel.area?.name}, {hostel.city?.name}
                      </div>
                      <div className="text-sm text-gray-500">{hostel.state?.name} - {hostel.pincode}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {hostel.roomType?.join(', ')}
                      </div>
                      <div className="text-sm text-gray-500">
                        ₹{hostel.horooPrice} / {hostel.ownerPrice}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex flex-col gap-1">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          hostel.availability ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                        }`}>
                          {hostel.availability ? 'Available' : 'Unavailable'}
                        </span>
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          hostel.isVerified ? 'bg-orange-100 text-orange-800' : 'bg-yellow-100 text-yellow-800'
                        }`}>
                          {hostel.isVerified ? 'Verified' : 'Pending'}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => router.push(`/master-admin/listing/hostel/show/${hostel.horooId}`)}
                          className="text-orange-600 hover:text-orange-900 p-1"
                          title="View Details"
                        >
                          <FaEye />
                        </button>
                        <button
                          onClick={() => router.push(`/master-admin/listing/hostel/edit/${hostel._id}`)}
                          className="text-green-600 hover:text-green-900 p-1"
                          title="Edit"
                        >
                          <FaEdit />
                        </button>
                        <button
                          onClick={() => {
                            if (confirm('Are you sure you want to delete this hostel?')) {
                              // Handle delete
                              toast.success('Delete functionality to be implemented');
                            }
                          }}
                          className="text-red-600 hover:text-red-900 p-1"
                          title="Delete"
                        >
                          <FaTrash />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
