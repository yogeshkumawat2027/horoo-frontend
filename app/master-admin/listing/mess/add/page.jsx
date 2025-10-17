"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import toast, { Toaster } from 'react-hot-toast';
import { 
  FaUtensils,
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

export default function AddMess() {
  const router = useRouter();
  const api = "https://horoo-backend-latest.onrender.com/api";

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
    
    // Mess Details
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
      if (res.data.success) {
        setStates(res.data.states);
      }
    } catch (error) {
      toast.error("Failed to fetch states");
    }
  };

  const fetchCities = async (stateId) => {
    try {
      const res = await axios.get(`${api}/cities/${stateId}`);
      if (res.data.success) {
        setCities(res.data.cities);
      }
    } catch (error) {
      toast.error("Failed to fetch cities");
    }
  };

  const fetchAreas = async (cityId) => {
    try {
      const res = await axios.get(`${api}/areas/${cityId}`);
      if (res.data.success) {
        setAreas(res.data.areas);
      }
    } catch (error) {
      toast.error("Failed to fetch areas");
    }
  };

  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  // Handle array field changes (checkboxes)
  const handleArrayChange = (field, value) => {
    setFormData(prev => {
      const currentArray = prev[field];
      if (currentArray.includes(value)) {
        return { ...prev, [field]: currentArray.filter(item => item !== value) };
      } else {
        return { ...prev, [field]: [...currentArray, value] };
      }
    });
  };

  // Handle nearby areas
  const addNearbyArea = () => {
    setNearbyAreas([...nearbyAreas, ""]);
  };

  const removeNearbyArea = (index) => {
    setNearbyAreas(nearbyAreas.filter((_, i) => i !== index));
  };

  const updateNearbyArea = (index, value) => {
    const updated = [...nearbyAreas];
    updated[index] = value;
    setNearbyAreas(updated);
  };

  // Handle facilities
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

  // Handle price plans
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

  // Handle image uploads
  const handleMainImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setFormData(prev => ({ ...prev, mainImage: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleOtherImagesUpload = (e) => {
    const files = Array.from(e.target.files);
    if (files.length > 0) {
      const readers = files.map(file => {
        return new Promise(resolve => {
          const reader = new FileReader();
          reader.onload = () => resolve(reader.result);
          reader.readAsDataURL(file);
        });
      });

      Promise.all(readers).then(results => {
        setFormData(prev => ({
          ...prev,
          otherImages: [...prev.otherImages, ...results]
        }));
      });
    }
  };

  const removeOtherImage = (index) => {
    setFormData(prev => ({
      ...prev,
      otherImages: prev.otherImages.filter((_, i) => i !== index)
    }));
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Validation
      const requiredFields = ['propertyName', 'horooName', 'ownerName', 'ownerMobile', 'state', 'city', 'area', 'pincode', 'ownerPrice', 'horooPrice'];
      const missingFields = requiredFields.filter(field => !formData[field]);
      
      if (missingFields.length > 0) {
        toast.error(`Please fill required fields: ${missingFields.join(', ')}`);
        setLoading(false);
        return;
      }

      // Prepare data for submission
      const submitData = {
        ...formData,
        nearbyAreas: nearbyAreas.filter(area => area.trim()),
        ownerPrice: Number(formData.ownerPrice),
        horooPrice: Number(formData.horooPrice)
      };

      const res = await axios.post(`${api}/mess/mess`, submitData);
      
      if (res.data.success) {
        toast.success("Mess added successfully!");
        setTimeout(() => {
          router.push('/master-admin/listing/mess');
        }, 2000);
      }
    } catch (error) {
      console.error('Error adding mess:', error);
      toast.error(error.response?.data?.message || "Failed to add mess");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen ml-72">
      <Toaster position="top-right" />
      
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <FaArrowLeft />
            Back
          </button>
          
          <div className="flex items-center gap-3">
            <FaUtensils className="text-3xl text-orange-500" />
            <h1 className="text-3xl font-bold text-gray-800">Add New Mess</h1>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Basic Details */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center gap-2 mb-6">
            <FaUtensils className="text-orange-500" />
            <h2 className="text-xl font-semibold text-gray-800">Basic Details</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Property Name (Real) <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="propertyName"
                value={formData.propertyName}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                placeholder="Enter actual property name"
                required
              />
              <p className="text-xs text-gray-500 mt-1">This will not be shown to users</p>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Horoo Name (Display) <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="horooName"
                value={formData.horooName}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                placeholder="Name to show on website"
                required
              />
              <p className="text-xs text-gray-500 mt-1">This will be shown to users</p>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Owner Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="ownerName"
                value={formData.ownerName}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                placeholder="Enter owner name"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Owner Mobile <span className="text-red-500">*</span>
              </label>
              <input
                type="tel"
                name="ownerMobile"
                value={formData.ownerMobile}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                placeholder="Enter mobile number"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Alternative Number</label>
              <input
                type="tel"
                name="anotherNo"
                value={formData.anotherNo}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                placeholder="Enter alternative number"
              />
            </div>
          </div>
        </div>

        {/* Location Details */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center gap-2 mb-6">
            <FaMapMarkerAlt className="text-orange-500" />
            <h2 className="text-xl font-semibold text-gray-800">Location Details</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                State <span className="text-red-500">*</span>
              </label>
              <select
                name="state"
                value={formData.state}
                onChange={handleInputChange}
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
                City <span className="text-red-500">*</span>
              </label>
              <select
                name="city"
                value={formData.city}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                required
                disabled={!formData.state}
              >
                <option value="">Select City</option>
                {cities.map((city) => (
                  <option key={city._id} value={city._id}>{city.name}</option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Area <span className="text-red-500">*</span>
              </label>
              <select
                name="area"
                value={formData.area}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                required
                disabled={!formData.city}
              >
                <option value="">Select Area</option>
                {areas.map((area) => (
                  <option key={area._id} value={area._id}>{area.name}</option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Pincode <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="pincode"
                value={formData.pincode}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                placeholder="Enter pincode"
                required
              />
            </div>
            
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">Map Link</label>
              <input
                type="url"
                name="mapLink"
                value={formData.mapLink}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                placeholder="Enter Google Maps link"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Real Address</label>
              <textarea
                name="realAddress"
                value={formData.realAddress}
                onChange={handleInputChange}
                rows={3}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                placeholder="Enter complete address"
              />
              <p className="text-xs text-gray-500 mt-1">Internal use only</p>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Horoo Address (Display)</label>
              <textarea
                name="horooAddress"
                value={formData.horooAddress}
                onChange={handleInputChange}
                rows={3}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                placeholder="Address to show to users"
              />
              <p className="text-xs text-gray-500 mt-1">This will be shown to users</p>
            </div>
          </div>

          {/* Nearby Areas */}
          <div className="mt-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">Nearby Areas</label>
            {nearbyAreas.map((area, index) => (
              <div key={index} className="flex gap-2 mb-2">
                <input
                  type="text"
                  value={area}
                  onChange={(e) => updateNearbyArea(index, e.target.value)}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  placeholder="Enter nearby area name"
                />
                {nearbyAreas.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeNearbyArea(index)}
                    className="px-3 py-2 text-red-600 hover:text-red-800 hover:bg-red-100 rounded-lg transition-colors"
                  >
                    <FaTrash />
                  </button>
                )}
              </div>
            ))}
            <button
              type="button"
              onClick={addNearbyArea}
              className="flex items-center gap-2 px-4 py-2 text-orange-600 hover:text-orange-800 hover:bg-orange-100 rounded-lg transition-colors"
            >
              <FaPlus /> Add Nearby Area
            </button>
          </div>
        </div>

        {/* Pricing Details */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center gap-2 mb-6">
            <FaDollarSign className="text-orange-500" />
            <h2 className="text-xl font-semibold text-gray-800">Pricing Details</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Owner Price <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                name="ownerPrice"
                value={formData.ownerPrice}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                placeholder="Enter owner price"
                required
              />
              <p className="text-xs text-gray-500 mt-1">Price given by owner</p>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Horoo Price <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                name="horooPrice"
                value={formData.horooPrice}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                placeholder="Enter final price"
                required
              />
              <p className="text-xs text-gray-500 mt-1">Price to show to users</p>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Offer Type</label>
              <select
                name="offerType"
                value={formData.offerType}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              >
                <option value="">Select Offer Type</option>
                <option value="discount">Discount</option>
                <option value="special">Special Offer</option>
                <option value="festival">Festival Offer</option>
                <option value="limited">Limited Time</option>
              </select>
            </div>
          </div>

          {/* Price Plans */}
          <div className="mt-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">Price Plans</label>
            <div className="flex gap-2 mb-3">
              <input
                type="text"
                value={newPricePlan}
                onChange={(e) => setNewPricePlan(e.target.value)}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                placeholder="Enter price plan (e.g., Monthly ₹3000, Quarterly ₹8500)"
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
                  className="bg-orange-100 text-orange-800 px-3 py-1 rounded-full text-sm flex items-center gap-2"
                >
                  {plan}
                  <button
                    type="button"
                    onClick={() => removePricePlan(plan)}
                    className="text-orange-600 hover:text-orange-800"
                  >
                    <FaTrash size={12} />
                  </button>
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Features & Options */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center gap-2 mb-6">
            <FaCog className="text-orange-500" />
            <h2 className="text-xl font-semibold text-gray-800">Features & Options</h2>
          </div>
          
          {/* Available For */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-3">Available For</label>
            <div className="flex flex-wrap gap-3">
              {["Boys", "Girls", "Family"].map((option) => (
                <label key={option} className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.availableFor.includes(option)}
                    onChange={() => handleArrayChange('availableFor', option)}
                    className="w-4 h-4 text-orange-500 rounded border-gray-300 focus:ring-orange-500"
                  />
                  <span className="text-sm text-gray-700">{option}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Facilities */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">Facilities</label>
            <div className="flex gap-2 mb-3">
              <input
                type="text"
                value={newFacility}
                onChange={(e) => setNewFacility(e.target.value)}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                placeholder="Enter facility name"
              />
              <button
                type="button"
                onClick={addFacility}
                className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
              >
                <FaPlus />
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              {formData.facilities.map((facility, index) => (
                <span
                  key={index}
                  className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm flex items-center gap-2"
                >
                  {facility}
                  <button
                    type="button"
                    onClick={() => removeFacility(facility)}
                    className="text-green-600 hover:text-green-800"
                  >
                    <FaTrash size={12} />
                  </button>
                </span>
              ))}
            </div>
          </div>

          {/* Status Options */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                name="availability"
                checked={formData.availability}
                onChange={handleInputChange}
                className="w-5 h-5 text-orange-500 rounded border-gray-300 focus:ring-orange-500"
              />
              <label className="text-sm font-medium text-gray-700">Available</label>
            </div>
            
            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                name="isVerified"
                checked={formData.isVerified}
                onChange={handleInputChange}
                className="w-5 h-5 text-orange-500 rounded border-gray-300 focus:ring-orange-500"
              />
              <label className="text-sm font-medium text-gray-700">Verified</label>
            </div>
            
            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                name="isShow"
                checked={formData.isShow}
                onChange={handleInputChange}
                className="w-5 h-5 text-orange-500 rounded border-gray-300 focus:ring-orange-500"
              />
              <label className="text-sm font-medium text-gray-700">Show on Website</label>
            </div>
          </div>
        </div>

        {/* Media */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center gap-2 mb-6">
            <FaImage className="text-orange-500" />
            <h2 className="text-xl font-semibold text-gray-800">Media</h2>
          </div>
          
          <div className="space-y-6">
            {/* Main Image */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Main Image</label>
              <input
                type="file"
                accept="image/*"
                onChange={handleMainImageUpload}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              />
              {formData.mainImage && (
                <div className="mt-2">
                  <img src={formData.mainImage} alt="Main" className="w-32 h-32 object-cover rounded-lg" />
                </div>
              )}
            </div>
            
            {/* Other Images */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Other Images</label>
              <input
                type="file"
                accept="image/*"
                multiple
                onChange={handleOtherImagesUpload}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              />
              {formData.otherImages.length > 0 && (
                <div className="mt-2 grid grid-cols-4 gap-2">
                  {formData.otherImages.map((image, index) => (
                    <div key={index} className="relative">
                      <img src={image} alt={`Other ${index + 1}`} className="w-full h-24 object-cover rounded-lg" />
                      <button
                        type="button"
                        onClick={() => removeOtherImage(index)}
                        className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs hover:bg-red-600"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
            
            {/* YouTube Link */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">YouTube Link</label>
              <input
                type="url"
                name="youtubeLink"
                value={formData.youtubeLink}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                placeholder="Enter YouTube video URL"
              />
            </div>
          </div>
        </div>

        {/* Descriptions */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-6">Descriptions</h2>
          
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Public Description</label>
              <QuillEditor
                value={formData.description}
                onChange={(value) => setFormData(prev => ({ ...prev, description: value }))}
                placeholder="Enter description for users..."
              />
              <p className="text-xs text-gray-500 mt-1">This will be shown to users</p>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Internal Description</label>
              <QuillEditor
                value={formData.horooDescription}
                onChange={(value) => setFormData(prev => ({ ...prev, horooDescription: value }))}
                placeholder="Enter internal notes..."
              />
              <p className="text-xs text-gray-500 mt-1">Internal use only (customer support)</p>
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <div className="flex justify-end gap-4">
          <button
            type="button"
            onClick={() => router.back()}
            className="px-8 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors"
          >
            Cancel
          </button>
          
          <button
            type="submit"
            disabled={loading}
            className="px-8 py-3 bg-orange-500 text-white rounded-lg hover:bg-orange-600 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 transition-colors"
          >
            {loading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                Adding Mess...
              </>
            ) : (
              <>
                <FaSave />
                Add Mess
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
