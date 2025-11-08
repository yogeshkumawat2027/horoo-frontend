'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { FaHome, FaPlus, FaSearch, FaFilter, FaEye, FaEdit, FaTrash } from 'react-icons/fa';
import { Toaster, toast } from 'react-hot-toast';
import axios from 'axios';

export default function HouseManagement() {
  const router = useRouter();
  const api = "https://horoo-backend-latest.onrender.com/api";
  const [houses, setHouses] = useState([]);
  const [loading, setLoading] = useState(false);
  
  // Location data
  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);
  const [areas, setAreas] = useState([]);
  
  // Filters
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    search: '',
    state: '',
    city: '',
    area: '',
    houseType: '',
    availableFor: '',
    availability: '',
    isVerified: ''
  });
  
  // Search suggestions
  const [searchSuggestions, setSearchSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  useEffect(() => {
    fetchHouses();
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

  const fetchHouses = async () => {
    try {
      setLoading(true);
      // Use filter API to get populated location data like flat page
      const response = await axios.get(`${api}/houses/house/filter`);
      if (response.data.success) {
        setHouses(response.data.houses || []);
      }
    } catch (error) {
      console.error('Error fetching houses:', error);
      toast.error('Failed to fetch houses');
    } finally {
      setLoading(false);
    }
  };

  const fetchStates = async () => {
    try {
      const response = await axios.get(`${api}/states`);
      if (response.data.success) {
        setStates(response.data.states || []);
      }
    } catch (error) {
      console.error('Error fetching states:', error);
    }
  };

  const fetchCities = async (stateId) => {
    try {
      const response = await axios.get(`${api}/cities/${stateId}`);
      if (response.data.success) {
        setCities(response.data.cities || []);
      }
    } catch (error) {
      console.error('Error fetching cities:', error);
    }
  };

  const fetchAreas = async (cityId) => {
    try {
      const response = await axios.get(`${api}/areas/${cityId}`);
      if (response.data.success) {
        setAreas(response.data.areas || []);
      }
    } catch (error) {
      console.error('Error fetching areas:', error);
    }
  };

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({
      ...prev,
      [key]: value,
      // Reset dependent filters
      ...(key === 'state' && { city: '', area: '' }),
      ...(key === 'city' && { area: '' })
    }));
  };

  const handleSearch = () => {
    const filtered = houses.filter(house => {
      const searchTerm = filters.search.toLowerCase();
      return (
        house.horooId?.toLowerCase().includes(searchTerm) ||
        house.horooName?.toLowerCase().includes(searchTerm) ||
        house.ownerName?.toLowerCase().includes(searchTerm) ||
        house.ownerMobile?.includes(searchTerm) ||
        house.pincode?.includes(searchTerm) ||
        (house.nearbyAreas && house.nearbyAreas.some(area => 
          area.toLowerCase().includes(searchTerm)
        ))
      );
    });
    setHouses(filtered);
    setShowSuggestions(false);
  };

  const handleFilterSearch = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      
      Object.keys(filters).forEach(key => {
        if (filters[key]) {
          params.append(key, filters[key]);
        }
      });
      
      const response = await axios.get(`${api}/houses/house/filter?${params}`);
      if (response.data.success) {
        setHouses(response.data.houses || []);
      }
    } catch (error) {
      console.error('Error filtering houses:', error);
      toast.error('Failed to filter houses');
    } finally {
      setLoading(false);
    }
  };

  const clearAllFilters = () => {
    setFilters({
      search: '',
      state: '',
      city: '',
      area: '',
      houseType: '',
      availableFor: '',
      availability: '',
      isVerified: ''
    });
    fetchHouses();
    setShowSuggestions(false);
  };

  const generateSearchSuggestions = (searchTerm) => {
    if (!searchTerm.trim()) {
      setShowSuggestions(false);
      return;
    }

    const suggestions = new Set();
    
    houses.forEach(house => {
      // Add IDs
      if (house.horooId && house.horooId.toLowerCase().includes(searchTerm.toLowerCase())) {
        suggestions.add(`ID: ${house.horooId}`);
      }
      
      // Add Property Names
      if (house.horooName && house.horooName.toLowerCase().includes(searchTerm.toLowerCase())) {
        suggestions.add(`Property: ${house.horooName}`);
      }
      
      // Add Owner Names
      if (house.ownerName && house.ownerName.toLowerCase().includes(searchTerm.toLowerCase())) {
        suggestions.add(`Owner: ${house.ownerName}`);
      }
      
      // Add Mobile Numbers
      if (house.ownerMobile && house.ownerMobile.includes(searchTerm)) {
        suggestions.add(`Mobile: ${house.ownerMobile}`);
      }
      
      // Add Pincodes
      if (house.pincode && house.pincode.includes(searchTerm)) {
        suggestions.add(`Pincode: ${house.pincode}`);
      }
      
      // Add Nearby Areas
      if (house.nearbyAreas && Array.isArray(house.nearbyAreas)) {
        house.nearbyAreas.forEach(area => {
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
              <h1 className="text-2xl font-bold text-gray-800">House Management</h1>
              <p className="text-gray-600">Manage all house properties</p>
            </div>
          </div>
          
          <button
            onClick={() => router.push('/master-admin/listing/house/addhouse')}
            className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 rounded-lg flex items-center gap-2 font-medium transition-colors"
          >
            <FaPlus /> Add New House
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

              {/* House Type Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">House Type</label>
                <select
                  value={filters.houseType}
                  onChange={(e) => handleFilterChange('houseType', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
                >
                  <option value="">All Types</option>
                  <option value="1BHK">1BHK</option>
                  <option value="2BHK">2BHK</option>
                  <option value="3BHK">3BHK</option>
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

      {/* Houses Grid */}
      <div className="bg-white rounded-lg shadow-sm">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-800">
              All Houses ({houses.length})
            </h2>
          </div>
        </div>

        {loading ? (
          <div className="p-12 text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading houses...</p>
          </div>
        ) : houses.length === 0 ? (
          <div className="p-12 text-center">
            <FaHome className="mx-auto text-gray-400 text-4xl mb-4" />
            <p className="text-gray-600 text-lg">No houses found</p>
            <button
              onClick={() => router.push('/master-admin/listing/house/addhouse')}
              className="mt-4 bg-orange-500 hover:bg-orange-600 text-white px-6 py-2 rounded-lg flex items-center gap-2 mx-auto"
            >
              <FaPlus /> Add First House
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">House Info</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Owner</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Location</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type & Price</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {houses.map((house) => (
                  <tr key={house._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        {house.mainImage ? (
                          <img
                            src={house.mainImage}
                            alt={house.horooName}
                            className="h-12 w-12 rounded-lg object-cover mr-4"
                          />
                        ) : (
                          <div className="h-12 w-12 bg-gray-200 rounded-lg flex items-center justify-center mr-4">
                            <FaHome className="text-gray-400" />
                          </div>
                        )}
                        <div>
                          <div className="text-sm font-medium text-gray-900">{house.horooId}</div>
                          <div className="text-sm text-gray-500">{house.horooName}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{house.ownerName}</div>
                      <div className="text-sm text-gray-500">{house.ownerMobile}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {house.area?.name}, {house.city?.name}
                      </div>
                      <div className="text-sm text-gray-500">{house.state?.name} - {house.pincode}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {house.houseType?.join(', ')}
                      </div>
                      <div className="text-sm text-gray-500">
                        ₹{house.horooPrice} / {house.ownerPrice}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex flex-col gap-1">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          house.availability ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                        }`}>
                          {house.availability ? 'Available' : 'Unavailable'}
                        </span>
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          house.isVerified ? 'bg-orange-100 text-orange-800' : 'bg-yellow-100 text-yellow-800'
                        }`}>
                          {house.isVerified ? 'Verified' : 'Pending'}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => router.push(`/master-admin/listing/house/show/${house._id}`)}
                          className="text-orange-600 hover:text-orange-900 p-1"
                          title="View Details"
                        >
                          <FaEye />
                        </button>
                        <button
                          onClick={() => router.push(`/master-admin/listing/house/edit/${house._id}`)}
                          className="text-green-600 hover:text-green-900 p-1"
                          title="Edit"
                        >
                          <FaEdit />
                        </button>
                        <button
                          onClick={() => {
                            if (confirm('Are you sure you want to delete this house?')) {
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
