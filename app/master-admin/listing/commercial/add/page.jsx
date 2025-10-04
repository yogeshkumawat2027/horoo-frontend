"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import toast, { Toaster } from 'react-hot-toast';
import { 
  FaBuilding, 
  FaPlus, 
  FaTrash, 
  FaSave,
  FaArrowLeft,
  FaMapMarkerAlt,
  FaDollarSign,
  FaImage,
  FaCog
} from 'react-icons/fa';
import QuillEditor from '../../../../../components/QuillEditor';

export default function AddCommercial() {
  const router = useRouter();
  const api = "https://horoo-backend.onrender.com/api";

  // Form state
  const [formData, setFormData] = useState({
    // Basic Details
    propertyName: "",
    horooName: "",
    ownerName: "",
    ownerMobile: "",
    anotherNo: "",
    
    // Location
    state: "",
    city: "",
    area: "",
    pincode: "",
    mapLink: "",
    realAddress: "",
    horooAddress: "",
    
    // Pricing
    ownerPrice: "",
    horooPrice: "",
    offerType: "",
    
    // Commercial Details
    commercialType: [],
    commercialSize: "",
    quantity: 1,
    availability: true,
    isVerified: true,
    isShow: false,
    
    // Features & Facilities
    facilities: [],
    availableFor: [],
    pricePlans: [],
    
    // Media
    mainImage: null,
    otherImages: [],
    youtubeLink: "",
    
    // Descriptions
    description: "",
    horooDescription: ""
  });

  // Location data
  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);
  const [areas, setAreas] = useState([]);
  
  // UI state
  const [loading, setLoading] = useState(false);
  const [nearbyAreas, setNearbyAreas] = useState([""]);
  const [newFacility, setNewFacility] = useState("");
  const [newPricePlan, setNewPricePlan] = useState("");
  const [newCommercialType, setNewCommercialType] = useState("");
  const [newAvailableFor, setNewAvailableFor] = useState("");

  useEffect(() => {
    fetchStates();
  }, []);

  useEffect(() => {
    if (formData.state) {
      fetchCities(formData.state);
      setFormData(prev => ({ ...prev, city: "", area: "" }));
    }
  }, [formData.state]);

  useEffect(() => {
    if (formData.city) {
      fetchAreas(formData.city);
      setFormData(prev => ({ ...prev, area: "" }));
    }
  }, [formData.city]);

  const fetchStates = async () => {
    try {
      const res = await axios.get(`${api}/states`);
      if (res.data.success) setStates(res.data.states);
    } catch (error) {
      toast.error("Error fetching states");
    }
  };

  const fetchCities = async (stateId) => {
    try {
      const res = await axios.get(`${api}/cities/${stateId}`);
      if (res.data.success) setCities(res.data.cities);
    } catch (error) {
      setCities([]);
      toast.error("Error fetching cities");
    }
  };

  const fetchAreas = async (cityId) => {
    try {
      const res = await axios.get(`${api}/areas/${cityId}`);
      if (res.data.success) setAreas(res.data.areas);
    } catch (error) {
      setAreas([]);
      toast.error("Error fetching areas");
    }
  };

  const handleInputChange = (key, value) => {
    setFormData(prev => ({ ...prev, [key]: value }));
  };

  const handleArrayChange = (key, value) => {
    setFormData(prev => ({
      ...prev,
      [key]: prev[key].includes(value)
        ? prev[key].filter(item => item !== value)
        : [...prev[key], value]
    }));
  };

  // Nearby Areas Management
  const addNearbyArea = () => {
    setNearbyAreas([...nearbyAreas, ""]);
  };

  const removeNearbyArea = (index) => {
    if (nearbyAreas.length > 1) {
      const newAreas = nearbyAreas.filter((_, i) => i !== index);
      setNearbyAreas(newAreas);
    }
  };

  const updateNearbyArea = (index, value) => {
    const newAreas = [...nearbyAreas];
    newAreas[index] = value;
    setNearbyAreas(newAreas);
  };

  // Facilities Management
  const addFacility = () => {
    if (newFacility.trim() && !formData.facilities.includes(newFacility.trim())) {
      setFormData(prev => ({
        ...prev,
        facilities: [...prev.facilities, newFacility.trim()]
      }));
      setNewFacility("");
    }
  };

  const removeFacility = (facility) => {
    setFormData(prev => ({
      ...prev,
      facilities: prev.facilities.filter(f => f !== facility)
    }));
  };

  // Price Plans Management
  const addPricePlan = () => {
    if (newPricePlan.trim() && !formData.pricePlans.includes(newPricePlan.trim())) {
      setFormData(prev => ({
        ...prev,
        pricePlans: [...prev.pricePlans, newPricePlan.trim()]
      }));
      setNewPricePlan("");
    }
  };

  const removePricePlan = (plan) => {
    setFormData(prev => ({
      ...prev,
      pricePlans: prev.pricePlans.filter(p => p !== plan)
    }));
  };

  // Commercial Type Management
  const addCommercialType = () => {
    if (newCommercialType.trim() && !formData.commercialType.includes(newCommercialType.trim())) {
      setFormData(prev => ({
        ...prev,
        commercialType: [...prev.commercialType, newCommercialType.trim()]
      }));
      setNewCommercialType("");
    }
  };

  const removeCommercialType = (type) => {
    setFormData(prev => ({
      ...prev,
      commercialType: prev.commercialType.filter(t => t !== type)
    }));
  };

  // Available For Management
  const addAvailableFor = () => {
    if (newAvailableFor.trim() && !formData.availableFor.includes(newAvailableFor.trim())) {
      setFormData(prev => ({
        ...prev,
        availableFor: [...prev.availableFor, newAvailableFor.trim()]
      }));
      setNewAvailableFor("");
    }
  };

  const removeAvailableFor = (option) => {
    setFormData(prev => ({
      ...prev,
      availableFor: prev.availableFor.filter(o => o !== option)
    }));
  };

  // Image handling
  const convertToBase64 = (file) => {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result);
      reader.readAsDataURL(file);
    });
  };

  const handleMainImageChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        toast.error("Image size should be less than 5MB");
        return;
      }
      const base64 = await convertToBase64(file);
      setFormData(prev => ({ ...prev, mainImage: base64 }));
    }
  };

  const handleOtherImagesChange = async (e) => {
    const files = Array.from(e.target.files);
    const base64Images = [];
    
    for (const file of files) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error(`${file.name} is too large. Maximum size is 5MB.`);
        continue;
      }
      const base64 = await convertToBase64(file);
      base64Images.push(base64);
    }
    
    setFormData(prev => ({ 
      ...prev, 
      otherImages: [...prev.otherImages, ...base64Images] 
    }));
  };

  const removeOtherImage = (index) => {
    setFormData(prev => ({
      ...prev,
      otherImages: prev.otherImages.filter((_, i) => i !== index)
    }));
  };

  const validateForm = () => {
    const requiredFields = {
      propertyName: "Property Name",
      horooName: "Horoo Name", 
      ownerName: "Owner Name",
      ownerMobile: "Owner Mobile",
      state: "State",
      city: "City", 
      area: "Area",
      ownerPrice: "Owner Price",
      horooPrice: "Horoo Price"
    };

    for (const [field, label] of Object.entries(requiredFields)) {
      if (!formData[field]) {
        toast.error(`${label} is required`);
        return false;
      }
    }

    // Mobile validation
    if (!/^\d{10}$/.test(formData.ownerMobile)) {
      toast.error("Owner mobile must be 10 digits");
      return false;
    }

    if (formData.anotherNo && !/^\d{10}$/.test(formData.anotherNo)) {
      toast.error("Another mobile number must be 10 digits");
      return false;
    }

    if (formData.commercialType.length === 0) {
      toast.error("Please select at least one commercial type");
      return false;
    }

    if (formData.availableFor.length === 0) {
      toast.error("Please select what the property is available for");
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setLoading(true);
    
    try {
      const submitData = {
        ...formData,
        nearbyAreas: nearbyAreas.filter(area => area.trim()),
        ownerPrice: parseInt(formData.ownerPrice),
        horooPrice: parseInt(formData.horooPrice),
        quantity: parseInt(formData.quantity)
      };
      
      const res = await axios.post(`${api}/commercials/commercial`, submitData);
      
      if (res.data.success) {
        toast.success("Commercial property added successfully!");
        setTimeout(() => {
          router.push('/master-admin/listing/commercial');
        }, 1500);
      } else {
        toast.error(res.data.message || "Failed to add commercial property");
      }
    } catch (error) {
      console.error('Submit error:', error);
      toast.error(error.response?.data?.message || "Failed to add commercial property");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen ml-72 bg-gray-50 p-6">
      <Toaster position="top-right" />
      
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <button
            onClick={() => router.back()}
            className="p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <FaArrowLeft className="text-xl" />
          </button>
          <FaBuilding className="text-3xl text-orange-500" />
          <h1 className="text-3xl font-bold text-gray-800">Add Commercial Property</h1>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="max-w-6xl mx-auto space-y-8">
        
        {/* Basic Details Section */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-6 flex items-center gap-2">
            <FaBuilding className="text-orange-500" />
            Basic Details
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Property Name *
              </label>
              <input
                type="text"
                value={formData.propertyName}
                onChange={(e) => handleInputChange('propertyName', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                placeholder="Enter property name"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Horoo Name *
              </label>
              <input
                type="text"
                value={formData.horooName}
                onChange={(e) => handleInputChange('horooName', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                placeholder="Enter Horoo name"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Owner Name *
              </label>
              <input
                type="text"
                value={formData.ownerName}
                onChange={(e) => handleInputChange('ownerName', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                placeholder="Enter owner name"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Owner Mobile *
              </label>
              <input
                type="tel"
                value={formData.ownerMobile}
                onChange={(e) => handleInputChange('ownerMobile', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                placeholder="10-digit mobile number"
                pattern="[0-9]{10}"
                maxLength="10"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Another Mobile Number
              </label>
              <input
                type="tel"
                value={formData.anotherNo}
                onChange={(e) => handleInputChange('anotherNo', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                placeholder="10-digit mobile number"
                pattern="[0-9]{10}"
                maxLength="10"
              />
            </div>
          </div>
        </div>

        {/* Location Section */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-6 flex items-center gap-2">
            <FaMapMarkerAlt className="text-orange-500" />
            Location Details
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                State *
              </label>
              <select
                value={formData.state}
                onChange={(e) => handleInputChange('state', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                required
              >
                <option value="">Select State</option>
                {states.map((state) => (
                  <option key={state._id} value={state._id}>{state.name}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                City *
              </label>
              <select
                value={formData.city}
                onChange={(e) => handleInputChange('city', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                disabled={!formData.state}
                required
              >
                <option value="">Select City</option>
                {cities.map((city) => (
                  <option key={city._id} value={city._id}>{city.name}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Area *
              </label>
              <select
                value={formData.area}
                onChange={(e) => handleInputChange('area', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                disabled={!formData.city}
                required
              >
                <option value="">Select Area</option>
                {areas.map((area) => (
                  <option key={area._id} value={area._id}>{area.name}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Pin Code
              </label>
              <input
                type="text"
                value={formData.pincode}
                onChange={(e) => handleInputChange('pincode', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                placeholder="Enter pin code"
                maxLength="6"
                pattern="[0-9]{6}"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Map Link
              </label>
              <input
                type="url"
                value={formData.mapLink}
                onChange={(e) => handleInputChange('mapLink', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                placeholder="Google Maps link"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Real Address
              </label>
              <textarea
                value={formData.realAddress}
                onChange={(e) => handleInputChange('realAddress', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                rows="3"
                placeholder="Enter real address"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Horoo Address
              </label>
              <textarea
                value={formData.horooAddress}
                onChange={(e) => handleInputChange('horooAddress', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                rows="3"
                placeholder="Enter Horoo address"
              />
            </div>
          </div>

          {/* Nearby Areas */}
          <div className="mt-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Nearby Areas
            </label>
            <div className="space-y-2">
              {nearbyAreas.map((area, index) => (
                <div key={index} className="flex gap-2">
                  <input
                    type="text"
                    value={area}
                    onChange={(e) => updateNearbyArea(index, e.target.value)}
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    placeholder={`Nearby area ${index + 1}`}
                  />
                  {nearbyAreas.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeNearbyArea(index)}
                      className="px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    >
                      <FaTrash />
                    </button>
                  )}
                </div>
              ))}
              <button
                type="button"
                onClick={addNearbyArea}
                className="flex items-center gap-2 px-4 py-2 text-orange-600 border border-orange-300 rounded-lg hover:bg-orange-50 transition-colors"
              >
                <FaPlus /> Add Nearby Area
              </button>
            </div>
          </div>
        </div>

        {/* Commercial Details Section */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-6 flex items-center gap-2">
            <FaCog className="text-orange-500" />
            Commercial Details
          </h2>
          
          <div className="space-y-6">
            {/* Commercial Type */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Commercial Type *
              </label>
              <div className="flex gap-2 mb-3">
                <input
                  type="text"
                  value={newCommercialType}
                  onChange={(e) => setNewCommercialType(e.target.value)}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  placeholder="Enter commercial type (e.g., Office, Shop, Restaurant)"
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      addCommercialType();
                    }
                  }}
                />
                <button
                  type="button"
                  onClick={addCommercialType}
                  className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
                >
                  <FaPlus />
                </button>
              </div>
              <div className="flex flex-wrap gap-2">
                {formData.commercialType.map((type, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center gap-2 px-3 py-1 bg-orange-100 text-orange-800 rounded-full text-sm"
                  >
                    {type}
                    <button
                      type="button"
                      onClick={() => removeCommercialType(type)}
                      className="text-orange-600 hover:text-orange-800"
                    >
                      <FaTrash className="text-xs" />
                    </button>
                  </span>
                ))}
              </div>
            </div>

            {/* Commercial Size and Quantity */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Commercial Size
                </label>
                <input
                  type="text"
                  value={formData.commercialSize}
                  onChange={(e) => handleInputChange('commercialSize', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  placeholder="e.g., 1000 sq ft, 500-2000 sq ft"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Quantity
                </label>
                <input
                  type="number"
                  value={formData.quantity}
                  onChange={(e) => handleInputChange('quantity', parseInt(e.target.value) || 1)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  min="1"
                />
              </div>
            </div>

            {/* Available For */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Available For *
              </label>
              <div className="flex gap-2 mb-3">
                <input
                  type="text"
                  value={newAvailableFor}
                  onChange={(e) => setNewAvailableFor(e.target.value)}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  placeholder="Enter availability option (e.g., Rent, Sale, Lease)"
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      addAvailableFor();
                    }
                  }}
                />
                <button
                  type="button"
                  onClick={addAvailableFor}
                  className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
                >
                  <FaPlus />
                </button>
              </div>
              <div className="flex flex-wrap gap-2">
                {formData.availableFor.map((option, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center gap-2 px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm"
                  >
                    {option}
                    <button
                      type="button"
                      onClick={() => removeAvailableFor(option)}
                      className="text-green-600 hover:text-green-800"
                    >
                      <FaTrash className="text-xs" />
                    </button>
                  </span>
                ))}
              </div>
            </div>

            {/* Status Options */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.availability}
                    onChange={(e) => handleInputChange('availability', e.target.checked)}
                    className="w-4 h-4 text-orange-600 border-gray-300 rounded focus:ring-orange-500"
                  />
                  <span className="text-sm font-medium text-gray-700">Available</span>
                </label>
              </div>

              <div>
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.isVerified}
                    onChange={(e) => handleInputChange('isVerified', e.target.checked)}
                    className="w-4 h-4 text-orange-600 border-gray-300 rounded focus:ring-orange-500"
                  />
                  <span className="text-sm font-medium text-gray-700">Verified</span>
                </label>
              </div>

              <div>
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.isShow}
                    onChange={(e) => handleInputChange('isShow', e.target.checked)}
                    className="w-4 h-4 text-orange-600 border-gray-300 rounded focus:ring-orange-500"
                  />
                  <span className="text-sm font-medium text-gray-700">Show on Website</span>
                </label>
              </div>
            </div>
          </div>
        </div>

        {/* Pricing Section */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-6 flex items-center gap-2">
            <FaDollarSign className="text-orange-500" />
            Pricing Details
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Owner Price * (₹)
              </label>
              <input
                type="number"
                value={formData.ownerPrice}
                onChange={(e) => handleInputChange('ownerPrice', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                placeholder="Enter owner price"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Horoo Price * (₹)
              </label>
              <input
                type="number"
                value={formData.horooPrice}
                onChange={(e) => handleInputChange('horooPrice', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                placeholder="Enter Horoo price"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Offer Type
              </label>
              <select
                value={formData.offerType}
                onChange={(e) => handleInputChange('offerType', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              >
                <option value="">Select offer type</option>
                <option value="Hot Deal">Hot Deal</option>
                <option value="Limited Time">Limited Time</option>
                <option value="Best Price">Best Price</option>
                <option value="Negotiable">Negotiable</option>
              </select>
            </div>
          </div>

          {/* Price Plans */}
          <div className="mt-6">
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Price Plans
            </label>
            <div className="flex gap-2 mb-3">
              <input
                type="text"
                value={newPricePlan}
                onChange={(e) => setNewPricePlan(e.target.value)}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                placeholder="Enter price plan"
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    addPricePlan();
                  }
                }}
              />
              <button
                type="button"
                onClick={addPricePlan}
                className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
              >
                <FaPlus />
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              {formData.pricePlans.map((plan, index) => (
                <span
                  key={index}
                  className="inline-flex items-center gap-2 px-3 py-1 bg-orange-100 text-orange-800 rounded-full text-sm"
                >
                  {plan}
                  <button
                    type="button"
                    onClick={() => removePricePlan(plan)}
                    className="text-orange-600 hover:text-orange-800"
                  >
                    <FaTrash className="text-xs" />
                  </button>
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Facilities Section */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-6">
            Facilities & Amenities
          </h2>
          
          <div className="mb-4">
            <div className="flex gap-2">
              <input
                type="text"
                value={newFacility}
                onChange={(e) => setNewFacility(e.target.value)}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                placeholder="Add facility (e.g., Parking, AC, WiFi)"
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    addFacility();
                  }
                }}
              />
              <button
                type="button"
                onClick={addFacility}
                className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
              >
                <FaPlus />
              </button>
            </div>
          </div>
          
          <div className="flex flex-wrap gap-2">
            {formData.facilities.map((facility, index) => (
              <span
                key={index}
                className="inline-flex items-center gap-2 px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm"
              >
                {facility}
                <button
                  type="button"
                  onClick={() => removeFacility(facility)}
                  className="text-green-600 hover:text-green-800"
                >
                  <FaTrash className="text-xs" />
                </button>
              </span>
            ))}
          </div>
        </div>

        {/* Media Section */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-6 flex items-center gap-2">
            <FaImage className="text-orange-500" />
            Media
          </h2>
          
          <div className="space-y-6">
            {/* Main Image */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Main Image
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={handleMainImageChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              />
              {formData.mainImage && (
                <div className="mt-3">
                  <img 
                    src={formData.mainImage} 
                    alt="Main preview" 
                    className="h-32 w-32 object-cover rounded-lg"
                  />
                </div>
              )}
            </div>

            {/* Other Images */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Other Images
              </label>
              <input
                type="file"
                accept="image/*"
                multiple
                onChange={handleOtherImagesChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              />
              {formData.otherImages.length > 0 && (
                <div className="mt-3 grid grid-cols-2 md:grid-cols-4 gap-3">
                  {formData.otherImages.map((image, index) => (
                    <div key={index} className="relative">
                      <img 
                        src={image} 
                        alt={`Preview ${index + 1}`} 
                        className="h-24 w-24 object-cover rounded-lg"
                      />
                      <button
                        type="button"
                        onClick={() => removeOtherImage(index)}
                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 text-xs hover:bg-red-600"
                      >
                        <FaTrash />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* YouTube Link */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                YouTube Link
              </label>
              <input
                type="url"
                value={formData.youtubeLink}
                onChange={(e) => handleInputChange('youtubeLink', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                placeholder="YouTube video link"
              />
            </div>
          </div>
        </div>

        {/* Description Section */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-6">
            Descriptions
          </h2>
          
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description
              </label>
              <QuillEditor
                value={formData.description}
                onChange={(value) => handleInputChange('description', value)}
                placeholder="Enter property description..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Horoo Description
              </label>
              <QuillEditor
                value={formData.horooDescription}
                onChange={(value) => handleInputChange('horooDescription', value)}
                placeholder="Enter Horoo-specific description..."
              />
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <div className="flex justify-end gap-4">
          <button
            type="button"
            onClick={() => router.back()}
            className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-3 bg-orange-500 text-white rounded-lg hover:bg-orange-600 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 transition-colors"
          >
            {loading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                Adding...
              </>
            ) : (
              <>
                <FaSave />
                Add Commercial Property
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
