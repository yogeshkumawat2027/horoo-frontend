"use client";
import { useRouter } from "next/navigation";
import toast, { Toaster } from 'react-hot-toast';
import { 
  FaUtensils,
  FaPlus, 
  FaFilter, 
  FaSearch,
  FaEye,
  FaEdit,
  FaTrash
} from 'react-icons/fa';

import { useState, useEffect } from "react";
import axios from "axios";

export default function MessPage() {
  const router = useRouter();
  const api = "https://horoo-backend-latest.onrender.com/api";
  const [messList, setMessList] = useState([]);
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
    availableFor: "",
    availability: "",
    isVerified: "",
    isShow: ""
  });
  
  // Search suggestions
  const [searchSuggestions, setSearchSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  useEffect(() => {
    fetchMess();
    fetchStates();
  }, []);

  const fetchMess = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${api}/mess/filter`);
      if (res.data.success) {
        setMessList(res.data.mess || []);
      }
    } catch (error) {
      toast.error("Failed to fetch mess data");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const fetchStates = async () => {
    try {
      const res = await axios.get(`${api}/states`);
      if (res.data.success) {
        setStates(res.data.states);
      }
    } catch (error) {
      console.error('Failed to fetch states:', error);
    }
  };

  const fetchCities = async (stateId) => {
    try {
      const res = await axios.get(`${api}/cities/${stateId}`);
      if (res.data.success) {
        setCities(res.data.cities);
        setAreas([]);
        setFilters(prev => ({ ...prev, city: "", area: "" }));
      }
    } catch (error) {
      console.error('Failed to fetch cities:', error);
    }
  };

  const fetchAreas = async (cityId) => {
    try {
      const res = await axios.get(`${api}/areas/${cityId}`);
      if (res.data.success) {
        setAreas(res.data.areas);
        setFilters(prev => ({ ...prev, area: "" }));
      }
    } catch (error) {
      console.error('Failed to fetch areas:', error);
    }
  };

  useEffect(() => {
    if (filters.state) {
      fetchCities(filters.state);
    } else {
      setCities([]);
      setAreas([]);
      setFilters(prev => ({ ...prev, city: "", area: "" }));
    }
  }, [filters.state]);

  useEffect(() => {
    if (filters.city) {
      fetchAreas(filters.city);
    } else {
      setAreas([]);
      setFilters(prev => ({ ...prev, area: "" }));
    }
  }, [filters.city]);

  // Search functionality
  const handleSearch = (searchTerm) => {
    setFilters(prev => ({ ...prev, search: searchTerm }));
    generateSearchSuggestions(searchTerm);
    
    if (searchTerm.length > 0) {
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
      
      const res = await axios.get(`${api}/mess/filter?${queryParams}`);
      if (res.data.success) {
        setMessList(res.data.mess);
        toast.success("Filters applied successfully");
      }
    } catch (error) {
      toast.error("Failed to apply filters");
      console.error(error);
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
      availableFor: "",
      availability: "",
      isVerified: "",
      isShow: ""
    });
    setCities([]);
    setAreas([]);
    fetchMess();
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
    
    messList.forEach(mess => {
      // Add Horoo IDs
      if (mess.horooId && mess.horooId.toLowerCase().includes(searchTerm.toLowerCase())) {
        suggestions.add({ type: 'id', value: mess.horooId, label: `ID: ${mess.horooId}` });
      }
      
      // Add Owner Names
      if (mess.ownerName && mess.ownerName.toLowerCase().includes(searchTerm.toLowerCase())) {
        suggestions.add({ type: 'owner', value: mess.ownerName, label: `Owner: ${mess.ownerName}` });
      }
      
      // Add Property Names
      if (mess.propertyName && mess.propertyName.toLowerCase().includes(searchTerm.toLowerCase())) {
        suggestions.add({ type: 'property', value: mess.propertyName, label: `Property: ${mess.propertyName}` });
      }
      
      // Add Mobile Numbers
      if (mess.ownerMobile && mess.ownerMobile.includes(searchTerm)) {
        suggestions.add({ type: 'mobile', value: mess.ownerMobile, label: `Mobile: ${mess.ownerMobile}` });
      }
    });

    setSearchSuggestions(Array.from(suggestions).slice(0, 5));
  };

  const deleteMess = async (id) => {
    if (window.confirm('Are you sure you want to delete this mess?')) {
      try {
        const res = await axios.delete(`${api}/mess-for-admin/${id}`);
        if (res.data.success) {
          await fetchMess();
          toast.success("Mess deleted successfully");
        }
      } catch (error) {
        toast.error("Failed to delete mess");
        console.error(error);
      }
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-orange-500"></div>
      </div>
    );
  }

  return (
    <div className="p-6 bg-gray-50 ml-72 min-h-screen">
      <Toaster position="top-right" />
      
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div className="flex items-center gap-3">
          <FaUtensils className="text-3xl text-orange-500" />
          <h1 className="text-3xl font-bold text-gray-800">Mess Management</h1>
        </div>
        
        <button
          onClick={() => router.push('/master-admin/listing/mess/add')}
          className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 rounded-lg flex items-center gap-2 font-medium transition-colors"
        >
          <FaPlus /> Add New Mess
        </button>
      </div>

      {/* Search and Filter Section */}
      <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
        <div className="flex flex-col lg:flex-row gap-4 items-end">
          {/* Search Input */}
          <div className="flex-1 relative">
            <label className="block text-sm font-medium text-gray-700 mb-2">Search Mess</label>
            <div className="relative">
              <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search by Horoo ID, Owner Name, Property Name, or Mobile..."
                value={filters.search}
                onChange={(e) => handleSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              />
              
              {/* Search Suggestions */}
              {showSuggestions && searchSuggestions.length > 0 && (
                <div className="absolute top-full left-0 right-0 bg-white border border-gray-300 rounded-lg mt-1 shadow-lg z-10">
                  {searchSuggestions.map((suggestion, index) => (
                    <div
                      key={index}
                      onClick={() => selectSuggestion(suggestion)}
                      className="p-3 hover:bg-gray-100 cursor-pointer border-b border-gray-100 last:border-b-0"
                    >
                      {suggestion.label}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="flex gap-3">
            <button
              onClick={applyFilters}
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

              {/* Verified Filter */}
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

              {/* Show Status Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Show Status</label>
                <select
                  value={filters.isShow}
                  onChange={(e) => handleFilterChange('isShow', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
                >
                  <option value="">All</option>
                  <option value="true">Showing</option>
                  <option value="false">Hidden</option>
                </select>
              </div>

            </div>

            <div className="flex gap-3">
              <button
                onClick={applyFilters}
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

      {/* Results Summary */}
      <div className="mb-4">
        <p className="text-gray-600">
          Found {messList.length} mess{messList.length !== 1 ? 'es' : ''}
        </p>
      </div>

      {/* Mess Table */}
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-orange-50">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-700">Image</th>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-700">Horoo ID</th>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-700">Property Details</th>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-700">Owner Info</th>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-700">Location</th>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-700">Pricing</th>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-700">Status</th>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-700">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {messList.length === 0 ? (
                <tr>
                  <td colSpan="8" className="px-6 py-12 text-center text-gray-500">
                    No mess found. Try adjusting your filters or add a new mess.
                  </td>
                </tr>
              ) : (
                messList.map((mess, index) => (
                  <tr key={mess._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 text-sm">
                      {mess.mainImage ? (
                        <img
                          src={mess.mainImage}
                          alt={mess.horooName}
                          className="h-12 w-12 rounded-lg object-cover"
                        />
                      ) : (
                        <div className="h-12 w-12 rounded-lg bg-gray-200 flex items-center justify-center">
                          <FaUtensils className="text-gray-400 text-lg" />
                        </div>
                      )}
                    </td>
                    
                    <td className="px-6 py-4 text-sm">
                      <div className="font-medium text-orange-600">{mess.horooId}</div>
                      <div className="text-gray-500 text-xs">ID: {mess._id.slice(-6)}</div>
                    </td>
                    
                    <td className="px-6 py-4 text-sm">
                      <div className="font-medium text-gray-900">{mess.horooName}</div>
                      <div className="text-gray-500">{mess.propertyName}</div>
                      {mess.availableFor && mess.availableFor.length > 0 && (
                        <div className="flex gap-1 mt-1">
                          {mess.availableFor.map((type, idx) => (
                            <span key={idx} className="px-2 py-1 text-xs bg-orange-100 text-orange-800 rounded">
                              {type}
                            </span>
                          ))}
                        </div>
                      )}
                    </td>
                    
                    <td className="px-6 py-4 text-sm">
                      <div className="font-medium text-gray-900">{mess.ownerName}</div>
                      <div className="text-gray-500">{mess.ownerMobile}</div>
                      {mess.anotherNo && (
                        <div className="text-gray-500 text-xs">{mess.anotherNo}</div>
                      )}
                    </td>
                    
                    <td className="px-6 py-4 text-sm">
                      <div className="text-gray-900">{mess.area?.name}</div>
                      <div className="text-gray-500 text-xs">{mess.city?.name}, {mess.state?.name}</div>
                      <div className="text-gray-500 text-xs">{mess.pincode}</div>
                    </td>
                    
                    <td className="px-6 py-4 text-sm">
                      <div className="font-medium text-green-600">₹{mess.horooPrice?.toLocaleString()}</div>
                      <div className="text-gray-500 text-xs">Owner: ₹{mess.ownerPrice?.toLocaleString()}</div>
                      {mess.offerType && (
                        <div className="text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded mt-1 inline-block">
                          {mess.offerType}
                        </div>
                      )}
                    </td>
                    
                    <td className="px-6 py-4 text-sm">
                      <div className="flex flex-col gap-1">
                        <span className={`inline-flex items-center px-2 py-1 text-xs font-medium rounded-full ${
                          mess.availability ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                        }`}>
                          {mess.availability ? 'Available' : 'Unavailable'}
                        </span>
                        
                        <span className={`inline-flex items-center px-2 py-1 text-xs font-medium rounded-full ${
                          mess.isVerified ? 'bg-blue-100 text-blue-800' : 'bg-yellow-100 text-yellow-800'
                        }`}>
                          {mess.isVerified ? 'Verified' : 'Pending'}
                        </span>
                        
                        <span className={`inline-flex items-center px-2 py-1 text-xs font-medium rounded-full ${
                          mess.isShow ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                        }`}>
                          {mess.isShow ? 'Visible' : 'Hidden'}
                        </span>
                      </div>
                    </td>
                    
                    <td className="px-6 py-4 text-sm">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => router.push(`/master-admin/listing/mess/show/${mess.horooId}`)}
                          className="text-blue-600 hover:text-blue-800 p-1 hover:bg-blue-100 rounded transition-colors"
                          title="View Details"
                        >
                          <FaEye />
                        </button>
                        
                        <button
                          onClick={() => router.push(`/master-admin/listing/mess/edit/${mess._id}`)}
                          className="text-green-600 hover:text-green-800 p-1 hover:bg-green-100 rounded transition-colors"
                          title="Edit"
                        >
                          <FaEdit />
                        </button>
                        
                        <button
                          onClick={() => deleteMess(mess._id)}
                          className="text-red-600 hover:text-red-800 p-1 hover:bg-red-100 rounded transition-colors"
                          title="Delete"
                        >
                          <FaTrash />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
