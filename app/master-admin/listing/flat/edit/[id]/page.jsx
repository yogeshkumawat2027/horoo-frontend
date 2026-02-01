"use client";
import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import axios from "axios";
import toast, { Toaster } from 'react-hot-toast';
import { 
  FaHome, 
  FaPlus, 
  FaTrash, 
  FaSave,
  FaArrowLeft,
  FaMapMarkerAlt,
  FaDollarSign,
  FaImage,
  FaCog,
  FaSpinner
} from 'react-icons/fa';
import QuillEditor from '../../../../../../components/QuillEditor';

export default function EditFlat() {
  const router = useRouter();
  const params = useParams();
  // const api = "https://horoo-backend-latest.onrender.com/api";
  const api = process.env.NEXT_PUBLIC_API_URL;
  const flatId = params.id;

  // Form state
  const [formData, setFormData] = useState({
    // Basic Details
    propertyName: "",
    horooName: "",
    ownerName: "",
    ownerMobile: "",
    ownerWhatsapp: "",
    anotherNo: "",
    
    // Location
    state: "",
    city: "",
    area: "",
    pincode: "",
    mapLink: "",
    realAddress: "",
    horooAddress: "",
    latitude: "",
    longitude: "",
    
    // Pricing
    ownerPrice: "",
    horooPrice: "",
    priceSuffix: "per month",
    offerType: "",
    
    // Flat Details
    flatType: [],
    roomSize: "",
    roomType: [],
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
  const [initialLoading, setInitialLoading] = useState(true);
  const [nearbyAreas, setNearbyAreas] = useState([""]);
  const [newFacility, setNewFacility] = useState("");
  const [newPricePlan, setNewPricePlan] = useState("");

  useEffect(() => {
    if (flatId) {
      fetchFlatData();
      fetchStates();
    }
  }, [flatId]);

  useEffect(() => {
    if (formData.state) {
      fetchCities(formData.state);
    }
  }, [formData.state]);

  useEffect(() => {
    if (formData.city) {
      fetchAreas(formData.city);
    }
  }, [formData.city]);

  const fetchFlatData = async () => {
    try {
      setInitialLoading(true);
      const res = await axios.get(`${api}/flat-for-admin/${flatId}`);
      
      if (res.data.success) {
        const flat = res.data.flat;
        
        setFormData({
          propertyName: flat.propertyName || "",
          horooName: flat.horooName || "",
          ownerName: flat.ownerName || "",
          ownerMobile: flat.ownerMobile || "",
          ownerWhatsapp: flat.ownerWhatsapp || "",
          anotherNo: flat.anotherNo || "",
          
          state: flat.state || "",
          city: flat.city || "",
          area: flat.area || "",
          pincode: flat.pincode || "",
          mapLink: flat.mapLink || "",
          realAddress: flat.realAddress || "",
          horooAddress: flat.horooAddress || "",
          latitude: flat.latitude || "",
          longitude: flat.longitude || "",
          
          ownerPrice: flat.ownerPrice || "",
          horooPrice: flat.horooPrice || "",
          priceSuffix: flat.priceSuffix || "per month",
          offerType: flat.offerType || "",
          
          flatType: flat.flatType || [],
          roomSize: flat.roomSize || "",
          roomType: flat.roomType || [],
          quantity: flat.quantity || 1,
          availability: flat.availability !== undefined ? flat.availability : true,
          isVerified: flat.isVerified !== undefined ? flat.isVerified : true,
          isShow: flat.isShow !== undefined ? flat.isShow : false,
          
          facilities: flat.facilities || [],
          availableFor: flat.availableFor || [],
          pricePlans: flat.pricePlans || [],
          
          mainImage: flat.mainImage || null,
          otherImages: flat.otherImages || [],
          youtubeLink: flat.youtubeLink || "",
          
          description: flat.description || "",
          horooDescription: flat.horooDescription || ""
        });

        setNearbyAreas(flat.nearbyAreas?.length ? flat.nearbyAreas : [""]);
      }
    } catch (error) {
      console.error("Error fetching flat data:", error);
      toast.error("Failed to load flat data");
      router.push('/master-admin/listing/flat');
    } finally {
      setInitialLoading(false);
    }
  };

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
      pincode: "Pincode",
      ownerPrice: "Owner Price",
      horooPrice: "Horoo Price"
    };

    for (const [key, label] of Object.entries(requiredFields)) {
      if (!formData[key]) {
        toast.error(`${label} is required`);
        return false;
      }
    }

    if (formData.ownerMobile.length !== 10) {
      toast.error("Mobile number must be 10 digits");
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    try {
      setLoading(true);
      
      const submitData = {
        ...formData,
        nearbyAreas: nearbyAreas.filter(area => area.trim() !== ""),
        ownerPrice: Number(formData.ownerPrice),
        horooPrice: Number(formData.horooPrice),
        quantity: Number(formData.quantity)
      };

      const res = await axios.put(`${api}/flat/edit/${flatId}`, submitData);
      
      if (res.data.success) {
        toast.success("Flat updated successfully!");
        setTimeout(() => {
          router.push('/master-admin/listing/flat');
        }, 2000);
      }
    } catch (error) {
      console.error("Error:", error);
      toast.error(error.response?.data?.message || "Failed to update flat");
    } finally {
      setLoading(false);
    }
  };

  if (initialLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <FaSpinner className="animate-spin text-4xl text-orange-500 mx-auto mb-4" />
          <p className="text-gray-600">Loading flat data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen ml-72 bg-gray-50 p-6">
      <Toaster position="top-right" />
      
      {/* Header */}
      <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={() => router.back()}
              className="bg-gray-100 hover:bg-gray-200 p-3 rounded-lg transition-colors"
            >
              <FaArrowLeft className="text-gray-600" />
            </button>
            <div className="bg-orange-500 p-3 rounded-lg">
              <FaHome className="text-white text-xl" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-800">Edit Flat</h1>
              <p className="text-gray-600">Update flat property details</p>
            </div>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        
        {/* Basic Details Section */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center gap-2 mb-6">
            <FaHome className="text-blue-500" />
            <h2 className="text-xl font-semibold text-gray-800">Basic Details</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Property Name (Real Name) *
              </label>
              <input
                type="text"
                value={formData.propertyName}
                onChange={(e) => handleInputChange('propertyName', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter actual property name"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Horoo Name (Display Name) *
              </label>
              <input
                type="text"
                value={formData.horooName}
                onChange={(e) => handleInputChange('horooName', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter name to show on website"
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
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter owner name"
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
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter 10-digit mobile number"
                maxLength="10"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Owner WhatsApp
              </label>
              <input
                type="tel"
                value={formData.ownerWhatsapp}
                onChange={(e) => handleInputChange('ownerWhatsapp', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="WhatsApp number (optional)"
                maxLength="10"
              />
            </div>
            
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Another Number (Optional)
              </label>
              <input
                type="tel"
                value={formData.anotherNo}
                onChange={(e) => handleInputChange('anotherNo', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter alternative contact number"
              />
            </div>
          </div>
        </div>

        {/* Location Details */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center gap-2 mb-6">
            <FaMapMarkerAlt className="text-blue-500" />
            <h2 className="text-xl font-semibold text-gray-800">Location Details</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                State *
              </label>
              <select
                value={formData.state}
                onChange={(e) => handleInputChange('state', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
                Area *
              </label>
              <select
                value={formData.area}
                onChange={(e) => handleInputChange('area', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
                Pincode *
              </label>
              <input
                type="text"
                value={formData.pincode}
                onChange={(e) => handleInputChange('pincode', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter pincode"
                maxLength="6"
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
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter Google Maps link"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Latitude
              </label>
              <input
                type="number"
                step="any"
                value={formData.latitude}
                onChange={(e) => handleInputChange('latitude', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="e.g., 28.7041"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Longitude
              </label>
              <input
                type="number"
                step="any"
                value={formData.longitude}
                onChange={(e) => handleInputChange('longitude', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="e.g., 77.1025"
              />
            </div>
            
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Real Address
              </label>
              <textarea
                value={formData.realAddress}
                onChange={(e) => handleInputChange('realAddress', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                rows="2"
                placeholder="Enter complete address"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Horoo Address (Display)
              </label>
              <textarea
                value={formData.horooAddress}
                onChange={(e) => handleInputChange('horooAddress', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                rows="2"
                placeholder="Enter address to show on website"
              />
            </div>
          </div>

          {/* Nearby Areas */}
          <div className="mt-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Nearby Areas
            </label>
            {nearbyAreas.map((area, index) => (
              <div key={index} className="flex gap-2 mb-2">
                <input
                  type="text"
                  value={area}
                  onChange={(e) => updateNearbyArea(index, e.target.value)}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter nearby area name"
                />
                {nearbyAreas.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeNearbyArea(index)}
                    className="px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg"
                  >
                    <FaTrash />
                  </button>
                )}
              </div>
            ))}
            <button
              type="button"
              onClick={addNearbyArea}
              className="text-blue-600 hover:text-blue-700 flex items-center gap-1"
            >
              <FaPlus /> Add Nearby Area
            </button>
          </div>
        </div>

        {/* Flat Details */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center gap-2 mb-6">
            <FaHome className="text-blue-500" />
            <h2 className="text-xl font-semibold text-gray-800">Flat Details</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Flat Type */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Flat Type
              </label>
              <div className="space-y-2">
                {['1BHK', '2BHK', '3BHK'].map((type) => (
                  <label key={type} className="flex items-center">
                    <input
                      type="checkbox"
                      checked={formData.flatType.includes(type)}
                      onChange={() => handleArrayChange('flatType', type)}
                      className="mr-2 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    {type}
                  </label>
                ))}
              </div>
            </div>

            {/* Room Type */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Room Type
              </label>
              <div className="space-y-2">
                {['Single', 'Double', 'Triple'].map((type) => (
                  <label key={type} className="flex items-center">
                    <input
                      type="checkbox"
                      checked={formData.roomType.includes(type)}
                      onChange={() => handleArrayChange('roomType', type)}
                      className="mr-2 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    {type}
                  </label>
                ))}
              </div>
            </div>

            {/* Available For */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Available For
              </label>
              <div className="space-y-2">
                {['Boys', 'Girls', 'Family'].map((type) => (
                  <label key={type} className="flex items-center">
                    <input
                      type="checkbox"
                      checked={formData.availableFor.includes(type)}
                      onChange={() => handleArrayChange('availableFor', type)}
                      className="mr-2 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    {type}
                  </label>
                ))}
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Room Size
              </label>
              <input
                type="text"
                value={formData.roomSize}
                onChange={(e) => handleInputChange('roomSize', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="e.g., 10x12 ft"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Quantity
              </label>
              <input
                type="number"
                value={formData.quantity}
                onChange={(e) => handleInputChange('quantity', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                min="1"
              />
            </div>
          </div>
        </div>

        {/* Pricing */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center gap-2 mb-6">
            <FaDollarSign className="text-blue-500" />
            <h2 className="text-xl font-semibold text-gray-800">Pricing Details</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Owner Price *
              </label>
              <input
                type="number"
                value={formData.ownerPrice}
                onChange={(e) => handleInputChange('ownerPrice', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter owner price"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Horoo Price *
              </label>
              <input
                type="number"
                value={formData.horooPrice}
                onChange={(e) => handleInputChange('horooPrice', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter horoo price"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Price Suffix *
              </label>
              <select
                value={formData.priceSuffix}
                onChange={(e) => handleInputChange('priceSuffix', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="per month">Per Month</option>
                <option value="per day">Per Day</option>
                <option value="per night">Per Night</option>
                <option value="per hour">Per Hour</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Offer Type
              </label>
              <input
                type="text"
                value={formData.offerType}
                onChange={(e) => handleInputChange('offerType', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="e.g., discount, special, festival"
              />
            </div>
          </div>

          {/* Price Plans */}
          <div className="mt-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Price Plans
            </label>
            <div className="flex gap-2 mb-3">
              <input
                type="text"
                value={newPricePlan}
                onChange={(e) => setNewPricePlan(e.target.value)}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Add price plan"
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addPricePlan())}
              />
              <button
                type="button"
                onClick={addPricePlan}
                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
              >
                <FaPlus />
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              {formData.pricePlans.map((plan, index) => (
                <span
                  key={index}
                  className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm flex items-center gap-2"
                >
                  {plan}
                  <button
                    type="button"
                    onClick={() => removePricePlan(plan)}
                    className="text-blue-600 hover:text-blue-800"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Facilities */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center gap-2 mb-6">
            <FaCog className="text-blue-500" />
            <h2 className="text-xl font-semibold text-gray-800">Facilities & Features</h2>
          </div>
          
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Facilities
            </label>
            <div className="flex gap-2 mb-3">
              <input
                type="text"
                value={newFacility}
                onChange={(e) => setNewFacility(e.target.value)}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Add facility"
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addFacility())}
              />
              <button
                type="button"
                onClick={addFacility}
                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
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
                    ×
                  </button>
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Images */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center gap-2 mb-6">
            <FaImage className="text-blue-500" />
            <h2 className="text-xl font-semibold text-gray-800">Images & Media</h2>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Main Image */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Main Image
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={handleMainImageChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              {formData.mainImage && (
                <div className="mt-3">
                  <img
                    src={formData.mainImage}
                    alt="Main"
                    className="h-32 w-full object-cover rounded-lg"
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
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              {formData.otherImages.length > 0 && (
                <div className="mt-3 grid grid-cols-3 gap-2">
                  {formData.otherImages.map((image, index) => (
                    <div key={index} className="relative">
                      <img
                        src={image}
                        alt={`Other ${index + 1}`}
                        className="h-20 w-full object-cover rounded-lg"
                      />
                      <button
                        type="button"
                        onClick={() => removeOtherImage(index)}
                        className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 text-xs"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* YouTube Link */}
          <div className="mt-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              YouTube Video Link
            </label>
            <input
              type="url"
              value={formData.youtubeLink}
              onChange={(e) => handleInputChange('youtubeLink', e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Enter YouTube video URL"
            />
          </div>
        </div>

        {/* Descriptions */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-6">Descriptions</h2>
          
          <div className="grid grid-cols-1 gap-6">
            <QuillEditor
              label="Description (Public)"
              value={formData.description}
              onChange={(content) => handleInputChange('description', content)}
              placeholder="Enter description to show on website..."
              showPreview={true}
            />
            
            <QuillEditor
              label="Horoo Description (Internal)"
              value={formData.horooDescription}
              onChange={(content) => handleInputChange('horooDescription', content)}
              placeholder="Enter internal notes for customer support..."
              showPreview={true}
            />
          </div>
        </div>

        {/* Status Settings */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-6">Status Settings</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
              <span className="text-sm font-medium text-gray-700">Available</span>
              <input
                type="checkbox"
                checked={formData.availability}
                onChange={(e) => handleInputChange('availability', e.target.checked)}
                className="h-5 w-5 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
            </div>
            
            <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
              <span className="text-sm font-medium text-gray-700">Verified</span>
              <input
                type="checkbox"
                checked={formData.isVerified}
                onChange={(e) => handleInputChange('isVerified', e.target.checked)}
                className="h-5 w-5 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
            </div>
            
            <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
              <span className="text-sm font-medium text-gray-700">Show on Website</span>
              <input
                type="checkbox"
                checked={formData.isShow}
                onChange={(e) => handleInputChange('isShow', e.target.checked)}
                className="h-5 w-5 text-orange-600 focus:ring-orange-500 border-gray-300 rounded"
              />
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex justify-end gap-4">
            <button
              type="button"
              onClick={() => router.back()}
              className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-3 bg-orange-500 hover:bg-orange-600 text-white rounded-lg font-medium transition-colors flex items-center gap-2 disabled:opacity-50"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  Updating...
                </>
              ) : (
                <>
                  <FaSave /> Update Flat
                </>
              )}
            </button>
          </div>
        </div>

      </form>
    </div>
  );
}