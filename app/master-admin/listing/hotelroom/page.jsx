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

export default function HotelRoomPage() {
  const router = useRouter();
  const api = "https://horoo-backend.onrender.com/api";
  const [hotelRooms, setHotelRooms] = useState([]);
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
    fetchHotelRooms();
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

  const fetchHotelRooms = async () => {
    try {
      setLoading(true);
      // Use filter API to get populated location data
      const res = await axios.get(`${api}/hotelroom/hotel/filter`);
      if (res.data.success) setHotelRooms(res.data.hotelRooms);
    } catch (err) {
      toast.error("Failed to fetch hotel rooms");
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

  // Search suggestions
  const generateSearchSuggestions = (searchTerm) => {
    const suggestions = [];
    
    hotelRooms.forEach(hotelRoom => {
      // Horoo ID suggestions
      if (hotelRoom.horooId?.toLowerCase().includes(searchTerm.toLowerCase())) {
        suggestions.push({ type: 'id', value: hotelRoom.horooId, label: `ID: ${hotelRoom.horooId}` });
      }
      
      // Name suggestions
      if (hotelRoom.horooName?.toLowerCase().includes(searchTerm.toLowerCase())) {
        suggestions.push({ type: 'name', value: hotelRoom.horooName, label: `Name: ${hotelRoom.horooName}` });
      }
      
      // Owner suggestions
      if (hotelRoom.ownerName?.toLowerCase().includes(searchTerm.toLowerCase())) {
        suggestions.push({ type: 'owner', value: hotelRoom.ownerName, label: `Owner: ${hotelRoom.ownerName}` });
      }
      
      // Mobile suggestions
      if (hotelRoom.ownerMobile?.includes(searchTerm)) {
        suggestions.push({ type: 'mobile', value: hotelRoom.ownerMobile, label: `Mobile: ${hotelRoom.ownerMobile}` });
      }
      
      // Area suggestions
      if (hotelRoom.area?.name?.toLowerCase().includes(searchTerm.toLowerCase())) {
        suggestions.push({ type: 'area', value: hotelRoom.area.name, label: `Area: ${hotelRoom.area.name}` });
      }
    });
    
    // Remove duplicates and limit suggestions
    const uniqueSuggestions = suggestions.filter((suggestion, index, self) => 
      index === self.findIndex(s => s.value === suggestion.value)
    );
    
    setSearchSuggestions(uniqueSuggestions.slice(0, 5));
  };

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setFilters(prev => ({ ...prev, search: value }));
    
    if (value.trim()) {
      generateSearchSuggestions(value);
      setShowSuggestions(true);
    } else {
      setShowSuggestions(false);
    }
  };

  const selectSuggestion = (suggestion) => {
    setFilters(prev => ({ ...prev, search: suggestion.value }));
    setShowSuggestions(false);
  };

  const applyFilters = async () => {
    try {
      setLoading(true);
      const queryParams = new URLSearchParams();
      
      Object.entries(filters).forEach(([key, value]) => {
        if (value) queryParams.append(key, value);
      });
      
      const res = await axios.get(`${api}/hotelroom/hotel/filter?${queryParams}`);
      if (res.data.success) {
        setHotelRooms(res.data.hotelRooms);
        toast.success("Filters applied successfully");
      }
    } catch (err) {
      toast.error("Failed to apply filters");
    } finally {
      setLoading(false);
    }
  };

  const clearFilters = () => {
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
    fetchHotelRooms();
  };

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
    }).format(price);
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
              <h1 className="text-2xl font-bold text-gray-800">Hotel Room Management</h1>
              <p className="text-gray-600">Manage hotel room properties and listings</p>
            </div>
          </div>
          
          <button
            onClick={() => router.push('/master-admin/listing/hotelroom/add')}
            className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 rounded-lg flex items-center gap-2 font-medium transition-colors"
          >
            <FaPlus /> Add Hotel Room
          </button>
        </div>
      </div>

      {/* Search and Filter Section */}
      <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
        <div className="flex flex-col lg:flex-row gap-4 items-end">
          {/* Search */}
          <div className="flex-1 relative">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Search Hotel Rooms
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FaSearch className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                value={filters.search}
                onChange={handleSearchChange}
                onFocus={() => filters.search && setShowSuggestions(true)}
                onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                placeholder="Search by ID, name, owner, mobile, area..."
              />
              
              {/* Search Suggestions */}
              {showSuggestions && searchSuggestions.length > 0 && (
                <div className="absolute z-10 w-full bg-white border border-gray-300 rounded-lg mt-1 shadow-lg">
                  {searchSuggestions.map((suggestion, index) => (
                    <button
                      key={index}
                      onClick={() => selectSuggestion(suggestion)}
                      className="w-full text-left px-4 py-2 hover:bg-gray-100 first:rounded-t-lg last:rounded-b-lg"
                    >
                      <span className="text-sm text-gray-700">{suggestion.label}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Filter Toggle */}
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-6 py-3 rounded-lg flex items-center gap-2 font-medium transition-colors"
          >
            <FaFilter /> Filters
          </button>

          {/* Action Buttons */}
          <div className="flex gap-2">
            <button
              onClick={applyFilters}
              className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 rounded-lg font-medium transition-colors"
            >
              Apply
            </button>
            <button
              onClick={clearFilters}
              className="bg-red-500 hover:bg-red-600 text-white px-6 py-3 rounded-lg font-medium transition-colors"
            >
              Clear
            </button>
          </div>
        </div>

        {/* Advanced Filters */}
        {showFilters && (
          <div className="mt-6 pt-6 border-t border-gray-200">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Location Filters */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">State</label>
                <select
                  value={filters.state}
                  onChange={(e) => handleFilterChange('state', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                >
                  <option value="">All States</option>
                  {states.map((state) => (
                    <option key={state._id} value={state._id}>{state.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">City</label>
                <select
                  value={filters.city}
                  onChange={(e) => handleFilterChange('city', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  disabled={!filters.state}
                >
                  <option value="">All Cities</option>
                  {cities.map((city) => (
                    <option key={city._id} value={city._id}>{city.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Area</label>
                <select
                  value={filters.area}
                  onChange={(e) => handleFilterChange('area', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
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
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
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
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                >
                  <option value="">All</option>
                  <option value="Boys">Boys</option>
                  <option value="Girls">Girls</option>
                  <option value="Family">Family</option>
                </select>
              </div>

              {/* Status Filters */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Availability</label>
                <select
                  value={filters.availability}
                  onChange={(e) => handleFilterChange('availability', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                >
                  <option value="">All</option>
                  <option value="true">Available</option>
                  <option value="false">Not Available</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Verified</label>
                <select
                  value={filters.isVerified}
                  onChange={(e) => handleFilterChange('isVerified', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                >
                  <option value="">All</option>
                  <option value="true">Verified</option>
                  <option value="false">Not Verified</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Show Status</label>
                <select
                  value={filters.isShow}
                  onChange={(e) => handleFilterChange('isShow', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                >
                  <option value="">All</option>
                  <option value="true">Shown</option>
                  <option value="false">Hidden</option>
                </select>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Results Section */}
      <div className="bg-white rounded-lg shadow-sm">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-800">
              Hotel Rooms ({hotelRooms.length})
            </h2>
          </div>
        </div>

        {loading ? (
          <div className="p-12 text-center">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500"></div>
            <p className="mt-2 text-gray-600">Loading hotel rooms...</p>
          </div>
        ) : hotelRooms.length === 0 ? (
          <div className="p-12 text-center">
            <FaHome className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <p className="text-gray-600 text-lg">No hotel rooms found</p>
            <p className="text-gray-500">Try adjusting your search criteria</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Hotel Room Details
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Owner Information
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Location
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Pricing
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {hotelRooms.map((hotelRoom) => (
                  <tr key={hotelRoom._id} className="hover:bg-gray-50">
                    {/* Hotel Room Details */}
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <div className="h-12 w-12 flex-shrink-0">
                          {hotelRoom.mainImage ? (
                            <img
                              className="h-12 w-12 rounded-lg object-cover"
                              src={hotelRoom.mainImage}
                              alt={hotelRoom.horooName}
                            />
                          ) : (
                            <div className="h-12 w-12 rounded-lg bg-orange-100 flex items-center justify-center">
                              <FaHome className="text-orange-500" />
                            </div>
                          )}
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">
                            {hotelRoom.horooName}
                          </div>
                          <div className="text-sm text-orange-600 font-mono">
                            {hotelRoom.horooId}
                          </div>
                          <div className="text-xs text-gray-500">
                            {hotelRoom.roomSize || 'Size not specified'} • {hotelRoom.quantity} rooms
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* Owner Information */}
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900">{hotelRoom.ownerName}</div>
                      <div className="text-sm text-gray-500">{hotelRoom.ownerMobile}</div>
                      {hotelRoom.anotherNo && (
                        <div className="text-xs text-gray-400">{hotelRoom.anotherNo}</div>
                      )}
                    </td>

                    {/* Location */}
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900">
                        {hotelRoom.area?.name}, {hotelRoom.city?.name}
                      </div>
                      <div className="text-sm text-gray-500">{hotelRoom.state?.name}</div>
                      <div className="text-xs text-gray-400">PIN: {hotelRoom.pincode}</div>
                    </td>

                    {/* Pricing */}
                    <td className="px-6 py-4">
                      <div className="text-sm font-medium text-gray-900">
                        {formatPrice(hotelRoom.horooPrice)}
                      </div>
                      <div className="text-xs text-gray-500">
                        Owner: {formatPrice(hotelRoom.ownerPrice)}
                      </div>
                      {hotelRoom.offerType && (
                        <div className="text-xs text-orange-600 font-medium">
                          {hotelRoom.offerType}
                        </div>
                      )}
                    </td>

                    {/* Status */}
                    <td className="px-6 py-4">
                      <div className="flex flex-col gap-1">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          hotelRoom.availability 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {hotelRoom.availability ? 'Available' : 'Unavailable'}
                        </span>
                        
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          hotelRoom.isVerified 
                            ? 'bg-blue-100 text-blue-800' 
                            : 'bg-yellow-100 text-yellow-800'
                        }`}>
                          {hotelRoom.isVerified ? 'Verified' : 'Unverified'}
                        </span>

                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          hotelRoom.isShow 
                            ? 'bg-orange-100 text-orange-800' 
                            : 'bg-gray-100 text-gray-800'
                        }`}>
                          {hotelRoom.isShow ? 'Visible' : 'Hidden'}
                        </span>
                      </div>
                    </td>

                    {/* Actions */}
                    <td className="px-6 py-4 text-right text-sm font-medium">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => router.push(`/master-admin/listing/hotelroom/show/${hotelRoom._id}`)}
                          className="text-orange-600 hover:text-orange-900 p-2 rounded-lg hover:bg-orange-50 transition-colors"
                          title="View Details"
                        >
                          <FaEye />
                        </button>
                        <button
                          onClick={() => router.push(`/master-admin/listing/hotelroom/edit/${hotelRoom._id}`)}
                          className="text-blue-600 hover:text-blue-900 p-2 rounded-lg hover:bg-blue-50 transition-colors"
                          title="Edit"
                        >
                          <FaEdit />
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
