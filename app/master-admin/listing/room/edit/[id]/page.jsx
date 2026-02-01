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

export default function EditRoom() {
  const router = useRouter();
  const params = useParams();
  // const api = "https://horoo-backend-latest.onrender.com/api";
  const api = process.env.NEXT_PUBLIC_API_URL;
  const roomId = params.id;

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
    
    // Room Details
    roomType: [],
    roomSize: "",
    availableFor: [],
    quantity: 1,
    
    // Features
    facilities: [],
    pricePlans: [],
    
    // Media
    mainImage: "",
    otherImages: [],
    youtubeLink: "",
    
    // Descriptions
    description: "",
    horooDescription: "",
    
    // Status
    availability: true,
    isVerified: true,
    isShow: false
  });

  // Location data
  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);
  const [areas, setAreas] = useState([]);
  
  // Dynamic arrays
  const [nearbyAreas, setNearbyAreas] = useState([""]);
  const [newFacility, setNewFacility] = useState("");
  const [newPricePlan, setNewPricePlan] = useState("");
  
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);

  useEffect(() => {
    if (roomId) {
      fetchRoomData();
      fetchStates();
    }
  }, [roomId]);

  const fetchRoomData = async () => {
    try {
      setInitialLoading(true);
      const res = await axios.get(`${api}/room-for-admin/${roomId}`);
      
      if (res.data.success) {
        const room = res.data.room;
        setFormData({
          propertyName: room.propertyName || "",
          horooName: room.horooName || "",
          ownerName: room.ownerName || "",
          ownerMobile: room.ownerMobile || "",
          ownerWhatsapp: room.ownerWhatsapp || "",
          anotherNo: room.anotherNo || "",
          state: room.state?._id || "",
          city: room.city?._id || "",
          area: room.area?._id || "",
          pincode: room.pincode || "",
          mapLink: room.mapLink || "",
          realAddress: room.realAddress || "",
          horooAddress: room.horooAddress || "",
          latitude: room.latitude || "",
          longitude: room.longitude || "",
          ownerPrice: room.ownerPrice || "",
          horooPrice: room.horooPrice || "",
          priceSuffix: room.priceSuffix || "per month",
          offerType: room.offerType || "",
          roomType: room.roomType || [],
          roomSize: room.roomSize || "",
          availableFor: room.availableFor || [],
          quantity: room.quantity || 1,
          facilities: room.facilities || [],
          pricePlans: room.pricePlans || [],
          mainImage: room.mainImage || "",
          otherImages: room.otherImages || [],
          youtubeLink: room.youtubeLink || "",
          description: room.description || "",
          horooDescription: room.horooDescription || "",
          availability: room.availability !== false,
          isVerified: room.isVerified !== false,
          isShow: room.isShow === true
        });
        
        // Fetch related location data
        if (room.state?._id) {
          await fetchCities(room.state._id);
          if (room.city?._id) {
            await fetchAreas(room.city._id);
          }
        }
        
        setNearbyAreas(room.nearbyAreas?.length ? room.nearbyAreas : [""]);
      }
    } catch (error) {
      console.error("Error fetching room data:", error);
      toast.error("Failed to load room data");
      router.push('/master-admin/listing/room');
    } finally {
      setInitialLoading(false);
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

  const handleInputChange = (key, value) => {
    setFormData(prev => ({ ...prev, [key]: value }));
    
    if (key === "state" && value) {
      fetchCities(value);
    } else if (key === "city" && value) {
      fetchAreas(value);
    }
  };

  const handleArrayChange = (key, value) => {
    setFormData(prev => ({
      ...prev,
      [key]: prev[key].includes(value)
        ? prev[key].filter(item => item !== value)
        : [...prev[key], value]
    }));
  };

  const handleNearbyAreaChange = (index, value) => {
    setNearbyAreas(prev => prev.map((item, i) => i === index ? value : item));
  };

  const addNearbyArea = () => {
    setNearbyAreas(prev => [...prev, ""]);
  };

  const removeNearbyArea = (index) => {
    if (nearbyAreas.length > 1) {
      setNearbyAreas(prev => prev.filter((_, i) => i !== index));
    }
  };

  const addFacility = () => {
    if (newFacility.trim()) {
      setFormData(prev => ({
        ...prev,
        facilities: [...prev.facilities, newFacility.trim()]
      }));
      setNewFacility("");
    }
  };

  const removeFacility = (index) => {
    setFormData(prev => ({
      ...prev,
      facilities: prev.facilities.filter((_, i) => i !== index)
    }));
  };

  const addPricePlan = () => {
    if (newPricePlan.trim()) {
      setFormData(prev => ({
        ...prev,
        pricePlans: [...prev.pricePlans, newPricePlan.trim()]
      }));
      setNewPricePlan("");
    }
  };

  const removePricePlan = (index) => {
    setFormData(prev => ({
      ...prev,
      pricePlans: prev.pricePlans.filter((_, i) => i !== index)
    }));
  };

  const handleImageUpload = async (file, isMainImage = false) => {
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      const base64String = reader.result;
      
      if (isMainImage) {
        setFormData(prev => ({ ...prev, mainImage: base64String }));
      } else {
        setFormData(prev => ({
          ...prev,
          otherImages: [...prev.otherImages, base64String]
        }));
      }
    };
    reader.readAsDataURL(file);
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

      const res = await axios.put(`${api}/room/edit/${roomId}`, submitData);
      
      if (res.data.success) {
        toast.success("Room updated successfully!");
        setTimeout(() => {
          router.push('/master-admin/listing/room');
        }, 2000);
      }
    } catch (error) {
      console.error("Error:", error);
      toast.error(error.response?.data?.message || "Failed to update room");
    } finally {
      setLoading(false);
    }
  };

  if (initialLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <FaSpinner className="animate-spin text-4xl text-orange-500 mx-auto mb-4" />
          <p className="text-gray-600">Loading room data...</p>
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
              <h1 className="text-2xl font-bold text-gray-800">Edit Room</h1>
              <p className="text-gray-600">Update room property details</p>
            </div>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        
        {/* Basic Details Section */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center gap-2 mb-6">
            <FaHome className="text-orange-500" />
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
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
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
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                placeholder="Name shown to users"
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
                placeholder="Property owner name"
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
                maxLength={10}
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
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                placeholder="WhatsApp number (optional)"
                maxLength={10}
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Alternative Number
              </label>
              <input
                type="tel"
                value={formData.anotherNo}
                onChange={(e) => handleInputChange('anotherNo', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                placeholder="Alternative contact number"
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
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                State *
              </label>
              <select
                value={formData.state}
                onChange={(e) => handleInputChange('state', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
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
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                placeholder="Area pincode"
              />
            </div>

            <div>
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
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Latitude
              </label>
              <input
                type="number"
                step="any"
                value={formData.latitude}
                onChange={(e) => handleInputChange('latitude', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
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
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                placeholder="e.g., 77.1025"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Real Address
              </label>
              <textarea
                value={formData.realAddress}
                onChange={(e) => handleInputChange('realAddress', e.target.value)}
                rows={3}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                placeholder="Actual property address"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Horoo Address (Display)
              </label>
              <textarea
                value={formData.horooAddress}
                onChange={(e) => handleInputChange('horooAddress', e.target.value)}
                rows={3}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                placeholder="Address shown to users"
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
                  onChange={(e) => handleNearbyAreaChange(index, e.target.value)}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  placeholder="Enter nearby area"
                />
                <button
                  type="button"
                  onClick={() => removeNearbyArea(index)}
                  className="px-3 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
                  disabled={nearbyAreas.length === 1}
                >
                  <FaTrash />
                </button>
              </div>
            ))}
            <button
              type="button"
              onClick={addNearbyArea}
              className="text-orange-600 hover:text-orange-700 flex items-center gap-1"
            >
              <FaPlus /> Add Nearby Area
            </button>
          </div>
        </div>

        {/* Room Details */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center gap-2 mb-6">
            <FaHome className="text-orange-500" />
            <h2 className="text-xl font-semibold text-gray-800">Room Details</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Room Type */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Room Type</label>
              <div className="space-y-2">
                {['Single', 'Double', 'Triple'].map((type) => (
                  <label key={type} className="flex items-center">
                    <input
                      type="checkbox"
                      checked={formData.roomType.includes(type)}
                      onChange={() => handleArrayChange('roomType', type)}
                      className="mr-2 h-4 w-4 text-orange-600 focus:ring-orange-500 border-gray-300 rounded"
                    />
                    {type}
                  </label>
                ))}
              </div>
            </div>

            {/* Available For */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Available For</label>
              <div className="space-y-2">
                {['Boys', 'Girls', 'Family'].map((type) => (
                  <label key={type} className="flex items-center">
                    <input
                      type="checkbox"
                      checked={formData.availableFor.includes(type)}
                      onChange={() => handleArrayChange('availableFor', type)}
                      className="mr-2 h-4 w-4 text-orange-600 focus:ring-orange-500 border-gray-300 rounded"
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
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                placeholder="e.g., 10x12 feet"
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
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                min="1"
              />
            </div>
          </div>
        </div>

        {/* Pricing */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center gap-2 mb-6">
            <FaDollarSign className="text-orange-500" />
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
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                placeholder="Price paid to owner"
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
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                placeholder="Price shown to users"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Price Suffix *
              </label>
              <select
                value={formData.priceSuffix}
                onChange={(e) => handleInputChange('priceSuffix', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
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
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                placeholder="e.g., Festival Offer, Discount"
              />
            </div>
          </div>

          {/* Price Plans */}
          <div className="mt-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Price Plans
            </label>
            <div className="flex gap-2 mb-2">
              <input
                type="text"
                value={newPricePlan}
                onChange={(e) => setNewPricePlan(e.target.value)}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                placeholder="Add price plan (e.g., Monthly, Quarterly)"
              />
              <button
                type="button"
                onClick={addPricePlan}
                className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600"
              >
                Add
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              {formData.pricePlans.map((plan, index) => (
                <span
                  key={index}
                  className="inline-flex items-center px-3 py-1 bg-orange-100 text-orange-800 rounded-full text-sm"
                >
                  {plan}
                  <button
                    type="button"
                    onClick={() => removePricePlan(index)}
                    className="ml-2 text-orange-600 hover:text-orange-800"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Features & Facilities */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center gap-2 mb-6">
            <FaCog className="text-orange-500" />
            <h2 className="text-xl font-semibold text-gray-800">Features & Facilities</h2>
          </div>
          
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Add Facilities
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={newFacility}
                onChange={(e) => setNewFacility(e.target.value)}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                placeholder="Add facility (e.g., WiFi, AC, Parking)"
              />
              <button
                type="button"
                onClick={addFacility}
                className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600"
              >
                Add
              </button>
            </div>
          </div>
          
          <div className="flex flex-wrap gap-2">
            {formData.facilities.map((facility, index) => (
              <span
                key={index}
                className="inline-flex items-center px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm"
              >
                {facility}
                <button
                  type="button"
                  onClick={() => removeFacility(index)}
                  className="ml-2 text-green-600 hover:text-green-800"
                >
                  ×
                </button>
              </span>
            ))}
          </div>
        </div>

        {/* Media Upload */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center gap-2 mb-6">
            <FaImage className="text-orange-500" />
            <h2 className="text-xl font-semibold text-gray-800">Media Upload</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Main Image */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Main Image
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => handleImageUpload(e.target.files[0], true)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
              />
              {formData.mainImage && (
                <img 
                  src={formData.mainImage} 
                  alt="Main" 
                  className="mt-2 h-32 w-full object-cover rounded-lg"
                />
              )}
            </div>

            {/* YouTube Link */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                YouTube Video Link
              </label>
              <input
                type="url"
                value={formData.youtubeLink}
                onChange={(e) => handleInputChange('youtubeLink', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                placeholder="YouTube video URL"
              />
            </div>
          </div>

          {/* Other Images */}
          <div className="mt-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Additional Images
            </label>
            <input
              type="file"
              accept="image/*"
              multiple
              onChange={(e) => {
                Array.from(e.target.files).forEach(file => {
                  handleImageUpload(file, false);
                });
              }}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
            />
            {formData.otherImages.length > 0 && (
              <div className="grid grid-cols-3 md:grid-cols-6 gap-2 mt-4">
                {formData.otherImages.map((image, index) => (
                  <div key={index} className="relative">
                    <img 
                      src={image} 
                      alt={`Additional ${index + 1}`} 
                      className="h-20 w-full object-cover rounded-lg"
                    />
                    <button
                      type="button"
                      onClick={() => removeOtherImage(index)}
                      className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Descriptions */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-6">Descriptions</h2>
          
          <div className="grid grid-cols-1 gap-6">
            <QuillEditor
              label="Public Description"
              value={formData.description}
              onChange={(content) => handleInputChange('description', content)}
              placeholder="Enter description shown to users..."
              showPreview={true}
            />
            
            <QuillEditor
              label="Internal Description (Horoo Only)"
              value={formData.horooDescription}
              onChange={(content) => handleInputChange('horooDescription', content)}
              placeholder="Enter internal notes for Horoo team..."
              showPreview={true}
            />
          </div>
        </div>

        {/* Status Settings */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-6">Status Settings</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="flex items-center">
              <input
                type="checkbox"
                id="availability"
                checked={formData.availability}
                onChange={(e) => handleInputChange('availability', e.target.checked)}
                className="h-5 w-5 text-orange-600 focus:ring-orange-500 border-gray-300 rounded"
              />
              <label htmlFor="availability" className="ml-3 text-sm font-medium text-gray-700">
                Available for Booking
              </label>
            </div>
            
            <div className="flex items-center">
              <input
                type="checkbox"
                id="isVerified"
                checked={formData.isVerified}
                onChange={(e) => handleInputChange('isVerified', e.target.checked)}
                className="h-5 w-5 text-orange-600 focus:ring-orange-500 border-gray-300 rounded"
              />
              <label htmlFor="isVerified" className="ml-3 text-sm font-medium text-gray-700">
                Verified Property
              </label>
            </div>
            
            <div className="flex items-center">
              <input
                type="checkbox"
                id="isShow"
                checked={formData.isShow}
                onChange={(e) => handleInputChange('isShow', e.target.checked)}
                className="h-5 w-5 text-orange-600 focus:ring-orange-500 border-gray-300 rounded"
              />
              <label htmlFor="isShow" className="ml-3 text-sm font-medium text-gray-700">
                Show on Website
              </label>
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
                  <FaSave /> Update Room
                </>
              )}
            </button>
          </div>
        </div>

      </form>
    </div>
  );
}
