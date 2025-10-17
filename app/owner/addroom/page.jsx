"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { 
  FaBed, 
  FaPlus, 
  FaTrash, 
  FaSave,
  FaArrowLeft,
  FaMapMarkerAlt,
  FaDollarSign,
  FaUser,
  FaPhone,
  FaCog,
  FaImage,
  FaUpload
} from 'react-icons/fa';
import Image from 'next/image';

export default function AddRoom() {
  const router = useRouter();
  const api = "http://localhost:5000/api";

  // UI state
  const [agreementAccepted, setAgreementAccepted] = useState(false);
  const [showThankYouPopup, setShowThankYouPopup] = useState(false);

  // Form state
  const [formData, setFormData] = useState({
    // Basic Details
    propertyName: "", // optional
    ownerName: "",
    ownerMobile: "",
    anotherNo: "",
    
    // Location
    state: "",
    city: "",
    area: "",
    pincode: "",
    
    // Room Details
    roomType: [],
    roomSize: "",
    quantity: "",
    availableFor: [],
    
    // Pricing
    ownerPrice: "",
    
    // Arrays
    pricePlans: [""],
    facilities: [""],
    
    // Media
    mainImage: "",
    otherImages: [],
    
    // Description
    description: ""
  });

  // Location data
  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);
  const [areas, setAreas] = useState([]);
  const [loading, setLoading] = useState(false);
  const [locationLoading, setLocationLoading] = useState(false);

  // Room type options
  const roomTypes = ["Single", "Double", "Triple"];

  // Available for options
  const availableForOptions = ["Boys", "Girls", "Family"];

  // Load states on component mount
  useEffect(() => {
    fetchStates();
  }, []);

  const fetchStates = async () => {
    try {
      setLocationLoading(true);
      const response = await fetch(`${api}/states`);
      if (response.ok) {
        const data = await response.json();
        setStates(data.success && Array.isArray(data.states) ? data.states : []);
      } else {
        console.error('Failed to fetch states');
        setStates([]);
      }
    } catch (error) {
      console.error('Error fetching states:', error);
      setStates([]);
    } finally {
      setLocationLoading(false);
    }
  };

  const fetchCities = async (stateId) => {
    try {
      const response = await fetch(`${api}/cities/${stateId}`);
      if (response.ok) {
        const data = await response.json();
        setCities(data.success && Array.isArray(data.cities) ? data.cities : []);
        setAreas([]);
        setFormData(prev => ({ ...prev, city: "", area: "" }));
      } else {
        setCities([]);
      }
    } catch (error) {
      console.error('Error fetching cities:', error);
      setCities([]);
    }
  };

  const fetchAreas = async (cityId) => {
    try {
      const response = await fetch(`${api}/areas/${cityId}`);
      if (response.ok) {
        const data = await response.json();
        setAreas(data.success && Array.isArray(data.areas) ? data.areas : []);
        setFormData(prev => ({ ...prev, area: "" }));
      } else {
        setAreas([]);
      }
    } catch (error) {
      console.error('Error fetching areas:', error);
      setAreas([]);
    }
  };

  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // Handle location changes
    if (name === 'state') {
      fetchCities(value);
    } else if (name === 'city') {
      fetchAreas(value);
    }
  };

  // Handle checkbox changes
  const handleCheckboxChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: prev[field].includes(value)
        ? prev[field].filter(item => item !== value)
        : [...prev[field], value]
    }));
  };

  // Handle array inputs
  const updateArrayField = (field, index, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: prev[field].map((item, i) => i === index ? value : item)
    }));
  };

  const addArrayField = (field) => {
    setFormData(prev => ({
      ...prev,
      [field]: [...prev[field], ""]
    }));
  };

  const removeArrayField = (field, index) => {
    setFormData(prev => ({
      ...prev,
      [field]: prev[field].filter((_, i) => i !== index)
    }));
  };

  // Compress image function
  const compressImage = (file, maxWidth = 800, maxHeight = 600, quality = 0.8) => {
    return new Promise((resolve) => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const img = new Image();
      
      img.onload = () => {
        // Calculate new dimensions
        let { width, height } = img;
        
        if (width > maxWidth) {
          height = (height * maxWidth) / width;
          width = maxWidth;
        }
        
        if (height > maxHeight) {
          width = (width * maxHeight) / height;
          height = maxHeight;
        }
        
        // Set canvas dimensions
        canvas.width = width;
        canvas.height = height;
        
        // Draw and compress
        ctx.drawImage(img, 0, 0, width, height);
        const compressedBase64 = canvas.toDataURL('image/jpeg', quality);
        resolve(compressedBase64);
      };
      
      img.src = URL.createObjectURL(file);
    });
  };

  // Handle image upload
  const handleImageUpload = async (e, type) => {
    const file = e.target.files[0];
    if (file) {
      // Check file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert('File size should be less than 5MB');
        return;
      }

      try {
        // Compress the image
        const compressedBase64 = await compressImage(file);
        const sizeInMB = (compressedBase64.length * 0.75) / (1024 * 1024);
        console.log(`Compressed image size: ${sizeInMB.toFixed(2)} MB`);
        
        if (type === 'main') {
          setFormData(prev => ({
            ...prev,
            mainImage: compressedBase64
          }));
        } else {
          setFormData(prev => ({
            ...prev,
            otherImages: [...prev.otherImages, compressedBase64]
          }));
        }
      } catch (error) {
        console.error('Error compressing image:', error);
        alert('Error processing image. Please try again.');
      }
    }
  };

  const removeOtherImage = (index) => {
    setFormData(prev => ({
      ...prev,
      otherImages: prev.otherImages.filter((_, i) => i !== index)
    }));
  };

  // Form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!agreementAccepted) {
      alert('Please accept the terms and conditions');
      return;
    }

    // Validate required fields
    const requiredFields = ['ownerName', 'ownerMobile', 'state', 'city', 'area', 'pincode', 'ownerPrice'];
    const missingFields = requiredFields.filter(field => !formData[field]);
    
    if (missingFields.length > 0) {
      alert(`Please fill in the following required fields: ${missingFields.join(', ')}`);
      return;
    }

    if (formData.roomType.length === 0) {
      alert('Please select at least one room type');
      return;
    }

    if (formData.availableFor.length === 0) {
      alert('Please select who the room is available for');
      return;
    }

    try {
      setLoading(true);

      // Prepare form data for submission
      const submitData = {
        ...formData,
        // Convert string prices to numbers
        ownerPrice: parseFloat(formData.ownerPrice),
        quantity: parseInt(formData.quantity) || 1,
        // Filter out empty strings from arrays
        pricePlans: formData.pricePlans.filter(plan => plan.trim()),
        facilities: formData.facilities.filter(facility => facility.trim()),
      };

      console.log('Submitting to:', `${api}/room`);
      console.log('Submit data keys:', Object.keys(submitData));
      console.log('Main image size:', submitData.mainImage ? (submitData.mainImage.length / 1024).toFixed(2) + ' KB' : 'No main image');
      console.log('Other images count:', submitData.otherImages ? submitData.otherImages.length : 0);
      
      // Calculate total payload size
      const payloadSize = JSON.stringify(submitData).length;
      console.log('Total payload size:', (payloadSize / 1024 / 1024).toFixed(2) + ' MB');
      
      if (payloadSize > 50 * 1024 * 1024) { // 50MB limit
        alert('Data too large to send. Please use smaller images.');
        setLoading(false);
        return;
      }

      const response = await fetch(`${api}/room`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(submitData),
      });

      console.log('Response status:', response.status);
      console.log('Response headers:', response.headers);

      if (response.ok) {
        const result = await response.json();
        console.log('Room created successfully:', result);
        setShowThankYouPopup(true);
        
        // Reset form after successful submission
        setTimeout(() => {
          setShowThankYouPopup(false);
          router.push('/');
        }, 3000);
      } else {
        // Check if response is actually JSON
        const responseText = await response.text();
        console.log('Error response text:', responseText);
        
        try {
          const errorData = JSON.parse(responseText);
          alert(`Failed to create room: ${errorData.message || 'Unknown error'}`);
        } catch (e) {
          console.error('Response is not JSON:', responseText);
          alert(`Failed to create room. Status: ${response.status}. Response: ${responseText.substring(0, 200)}...`);
        }
      }
    } catch (error) {
      console.error('Error creating room:', error);
      alert('An error occurred while creating the room. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-4 sm:py-8">
      <div className="max-w-4xl mx-auto px-2 sm:px-4">
        
        {/* Welcome & Agreement Section */}
        <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6 mb-4 sm:mb-6">
          <div className="text-center mb-4 sm:mb-6">
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mb-4">
              <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-lg overflow-hidden border-2 border-orange-500 shadow-lg">
                <Image 
                  src="/logo/logo.jpg"
                  alt="Horoo Logo"
                  width={48}
                  height={48}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="text-center sm:text-left">
                <h2 className="text-xl sm:text-2xl font-bold text-orange-600">Welcome to Horoo.in</h2>
                <p className="text-sm sm:text-base text-gray-600">List Your Room Property</p>
              </div>
            </div>
          </div>

          {/* Contact Info */}
          <div className="bg-orange-50 rounded-lg p-3 sm:p-4 mb-4 sm:mb-6 text-center">
            <h3 className="text-sm sm:text-base font-semibold text-orange-800 mb-2">Need Help?</h3>
            <div className="flex items-center justify-center gap-2 text-orange-600">
              <FaPhone className="text-sm" />
              <a href="tel:+919166260477" className="font-medium text-sm sm:text-base hover:underline">+91 9166260477</a>
            </div>
          </div>

          {/* Service Charges */}
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 sm:p-4 mb-4 sm:mb-6">
            <h4 className="text-sm sm:text-base font-semibold text-yellow-800 mb-2">📋 Service Charges:</h4>
            <ul className="space-y-2 text-xs sm:text-sm text-yellow-700">
              <li className="break-words">• <strong>Monthly Rent ≤ ₹5,000:</strong>  5% service charge (one-time after booking confirmation)</li>
              <li className="break-words">• <strong>Monthly Rent {'>'}₹5,000:</strong> 4% service charge (one-time after booking confirmation)</li>
            </ul>
          </div>

          {/* Agreement Checkbox & Button */}
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <input
                type="checkbox"
                id="agreement"
                checked={agreementAccepted}
                onChange={(e) => setAgreementAccepted(e.target.checked)}
                className="mt-1 rounded border-gray-300 text-orange-600 focus:ring-orange-500 w-4 h-4 sm:w-5 sm:h-5"
              />
              <label htmlFor="agreement" className="text-xs sm:text-sm text-gray-700 leading-relaxed">
                I agree to the <strong>service charges</strong> mentioned above and confirm that all information I provide will be accurate and genuine.
              </label>
            </div>
            
            <div className="text-center">
              <button
                type="button"
                onClick={() => setAgreementAccepted(!agreementAccepted)}
                className={`w-full sm:w-auto px-6 sm:px-8 py-3 rounded-lg font-semibold transition-colors text-sm sm:text-base ${
                  agreementAccepted 
                    ? 'bg-green-500 text-white hover:bg-green-600' 
                    : 'bg-orange-500 text-white hover:bg-orange-600'
                }`}
              >
                {agreementAccepted ? '✓ Agreement Accepted' : 'I Agree'}
              </button>
            </div>
          </div>
        </div>

        {!agreementAccepted && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-3 sm:p-4 mb-4 sm:mb-6 text-center">
            <p className="text-red-700 font-medium text-xs sm:text-sm">Please accept the agreement above to proceed with listing your property.</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className={`space-y-4 sm:space-y-6 ${!agreementAccepted ? 'opacity-50 pointer-events-none' : ''}`}>
          {/* Basic Information */}
          <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6">
            <div className="flex items-center gap-2 mb-4 sm:mb-6">
              <FaUser className="text-orange-500 text-lg sm:text-xl" />
              <h2 className="text-lg sm:text-xl font-semibold text-gray-800">Basic Information</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Property Name (Optional)
                </label>
                <input
                  type="text"
                  name="propertyName"
                  value={formData.propertyName}
                  onChange={handleInputChange}
                  className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-sm sm:text-base"
                  placeholder="Enter property name"
                />
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
                  className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-sm sm:text-base"
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
                  className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-sm sm:text-base"
                  placeholder="Enter mobile number"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Another Mobile Number
                </label>
                <input
                  type="tel"
                  name="anotherNo"
                  value={formData.anotherNo}
                  onChange={handleInputChange}
                  className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-sm sm:text-base"
                  placeholder="Enter another number"
                />
              </div>
            </div>
          </div>

          {/* Location Details */}
          <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6">
            <div className="flex items-center gap-2 mb-4 sm:mb-6">
              <FaMapMarkerAlt className="text-orange-500 text-lg sm:text-xl" />
              <h2 className="text-lg sm:text-xl font-semibold text-gray-800">Location Details</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  State <span className="text-red-500">*</span>
                </label>
                <select
                  name="state"
                  value={formData.state}
                  onChange={handleInputChange}
                  className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-sm sm:text-base"
                  required
                  disabled={locationLoading}
                >
                  <option value="">Select State</option>
                  {states.map(state => (
                    <option key={state._id} value={state._id}>
                      {state.name}
                    </option>
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
                  className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-sm sm:text-base"
                  required
                  disabled={!formData.state || cities.length === 0}
                >
                  <option value="">Select City</option>
                  {cities.map(city => (
                    <option key={city._id} value={city._id}>
                      {city.name}
                    </option>
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
                  className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-sm sm:text-base"
                  required
                  disabled={!formData.city || areas.length === 0}
                >
                  <option value="">Select Area</option>
                  {areas.map(area => (
                    <option key={area._id} value={area._id}>
                      {area.name}
                    </option>
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
                  className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-sm sm:text-base"
                  placeholder="Enter pincode"
                  required
                />
              </div>
            </div>
          </div>

          {/* Room Details */}
          <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6">
            <div className="flex items-center gap-2 mb-4 sm:mb-6">
              <FaBed className="text-orange-500 text-lg sm:text-xl" />
              <h2 className="text-lg sm:text-xl font-semibold text-gray-800">Room Details</h2>
            </div>
            
            <div className="space-y-6">
              {/* Available For */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Available For <span className="text-red-500">*</span>
                </label>
                <div className="flex flex-wrap gap-3">
                  {availableForOptions.map(option => (
                    <label key={option} className="flex items-center">
                      <input
                        type="checkbox"
                        checked={formData.availableFor.includes(option)}
                        onChange={() => handleCheckboxChange('availableFor', option)}
                        className="rounded border-gray-300 text-orange-600 focus:ring-orange-500"
                      />
                      <span className="ml-2 text-sm font-medium text-gray-700">{option}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Room Type */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Room Type <span className="text-red-500">*</span>
                </label>
                <div className="flex flex-wrap gap-3">
                  {roomTypes.map(type => (
                    <label key={type} className="flex items-center">
                      <input
                        type="checkbox"
                        checked={formData.roomType.includes(type)}
                        onChange={() => handleCheckboxChange('roomType', type)}
                        className="rounded border-gray-300 text-orange-600 focus:ring-orange-500"
                      />
                      <span className="ml-2 text-sm font-medium text-gray-700">{type}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Room Size
                  </label>
                  <input
                    type="text"
                    name="roomSize"
                    value={formData.roomSize}
                    onChange={handleInputChange}
                    className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-sm sm:text-base"
                    placeholder="Enter room size"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Quantity
                  </label>
                  <input
                    type="number"
                    name="quantity"
                    value={formData.quantity}
                    onChange={handleInputChange}
                    min="1"
                    className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-sm sm:text-base"
                    placeholder="Enter quantity"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Facilities */}
          <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6">
            <div className="flex items-center gap-2 mb-4 sm:mb-6">
              <FaCog className="text-orange-500 text-lg sm:text-xl" />
              <h2 className="text-lg sm:text-xl font-semibold text-gray-800">Facilities</h2>
            </div>
            
            <div>
              {formData.facilities.map((facility, index) => (
                <div key={index} className="flex gap-2 mb-2">
                  <input
                    type="text"
                    value={facility}
                    onChange={(e) => updateArrayField('facilities', index, e.target.value)}
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    placeholder="Enter facility"
                  />
                  <button
                    type="button"
                    onClick={() => removeArrayField('facilities', index)}
                    className="px-3 py-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition-colors"
                  >
                    <FaTrash />
                  </button>
                </div>
              ))}
              <button
                type="button"
                onClick={() => addArrayField('facilities')}
                className="flex items-center gap-2 px-4 py-2 bg-orange-100 text-orange-600 rounded-lg hover:bg-orange-200 transition-colors"
              >
                <FaPlus /> Add Facility
              </button>
            </div>
          </div>

          {/* Pricing Section */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center gap-3 mb-6">
              <FaDollarSign className="text-orange-600 text-lg" />
              <h2 className="text-lg font-semibold text-gray-900">Pricing Details</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Price (₹/month) <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  name="ownerPrice"
                  value={formData.ownerPrice}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  placeholder="Enter monthly rent"
                  required
                />
              </div>
            </div>
          </div>

          {/* Price Plans Section */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center gap-3 mb-6">
              <FaDollarSign className="text-orange-600 text-lg" />
              <h2 className="text-lg font-semibold text-gray-900">Price Plans</h2>
            </div>
            
            <div>
              {formData.pricePlans.map((plan, index) => (
                <div key={index} className="flex gap-2 mb-2">
                  <input
                    type="text"
                    value={plan}
                    onChange={(e) => updateArrayField('pricePlans', index, e.target.value)}
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    placeholder="Enter price plan"
                  />
                  <button
                    type="button"
                    onClick={() => removeArrayField('pricePlans', index)}
                    className="px-3 py-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition-colors"
                  >
                    <FaTrash />
                  </button>
                </div>
              ))}
              <button
                type="button"
                onClick={() => addArrayField('pricePlans')}
                className="flex items-center gap-2 px-4 py-2 bg-orange-100 text-orange-600 rounded-lg hover:bg-orange-200 transition-colors"
              >
                <FaPlus /> Add Price Plan
              </button>
            </div>
          </div>

          {/* Description Section */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center gap-3 mb-6">
              <FaCog className="text-orange-600 text-lg" />
              <h2 className="text-lg font-semibold text-gray-900">Description</h2>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                rows="4"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                placeholder="Enter room description"
              />
            </div>
          </div>

          {/* Media Upload */}
          <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6">
            <div className="flex items-center gap-2 mb-4 sm:mb-6">
              <FaImage className="text-orange-500 text-lg sm:text-xl" />
              <h2 className="text-lg sm:text-xl font-semibold text-gray-800">Media Upload</h2>
            </div>
            
            <div className="space-y-4 sm:space-y-6">
              {/* Main Image */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Main Image
                </label>
                {formData.mainImage ? (
                  <div className="relative w-full h-48 bg-gray-100 rounded-lg overflow-hidden">
                    <Image
                      src={formData.mainImage}
                      alt="Main"
                      fill
                      className="object-cover"
                    />
                    <button
                      type="button"
                      onClick={() => setFormData(prev => ({ ...prev, mainImage: "" }))}
                      className="absolute top-2 right-2 bg-red-100 text-red-600 p-2 rounded-full hover:bg-red-200 transition-colors"
                    >
                      <FaTrash />
                    </button>
                  </div>
                ) : (
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 sm:p-8 text-center">
                    <FaUpload className="mx-auto text-gray-400 text-2xl sm:text-3xl mb-3 sm:mb-4" />
                    <div className="text-gray-600 mb-3 sm:mb-4">
                      <p className="text-sm sm:text-lg font-medium">Upload Main Image</p>
                      <p className="text-xs sm:text-sm">PNG, JPG up to 5MB</p>
                    </div>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleImageUpload(e, 'main')}
                      className="hidden"
                      id="main-image"
                    />
                    <label
                      htmlFor="main-image"
                      className="inline-flex items-center gap-2 px-3 sm:px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors cursor-pointer text-sm sm:text-base"
                    >
                      <FaUpload /> Choose Image
                    </label>
                  </div>
                )}
              </div>

              {/* Other Images */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Additional Images
                </label>
                {formData.otherImages.length > 0 && (
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 mb-3 sm:mb-4">
                    {formData.otherImages.map((image, index) => (
                      <div key={index} className="relative aspect-square bg-gray-100 rounded-lg overflow-hidden">
                        <Image
                          src={image}
                          alt={`Additional ${index + 1}`}
                          fill
                          className="object-cover"
                        />
                        <button
                          type="button"
                          onClick={() => removeOtherImage(index)}
                          className="absolute top-1 right-1 bg-red-100 text-red-600 p-1 rounded-full hover:bg-red-200 transition-colors"
                        >
                          <FaTrash className="text-xs" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 sm:p-6 text-center hover:border-orange-400 transition-colors">
                  <FaImage className="mx-auto text-gray-400 text-xl sm:text-2xl mb-2 sm:mb-3" />
                  <div className="text-gray-600 mb-2 sm:mb-3">
                    <p className="text-sm sm:text-base font-medium">Add More Images</p>
                    <p className="text-xs sm:text-sm">Upload multiple images (PNG, JPG up to 5MB each)</p>
                  </div>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleImageUpload(e, 'other')}
                    className="hidden"
                    id="other-images"
                  />
                  <label
                    htmlFor="other-images"
                    className="inline-flex items-center gap-2 px-3 sm:px-4 py-2 sm:py-3 bg-orange-100 text-orange-600 rounded-lg hover:bg-orange-200 transition-colors cursor-pointer text-sm sm:text-base font-medium"
                  >
                    <FaPlus /> Choose Images
                  </label>
                </div>
              </div>
            </div>
          </div>

          {/* Agreement and Submit */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="space-y-4">
              <label className="flex items-start gap-3">
                <input
                  type="checkbox"
                  checked={agreementAccepted}
                  onChange={(e) => setAgreementAccepted(e.target.checked)}
                  className="mt-1 rounded border-gray-300 text-orange-600 focus:ring-orange-500"
                />
                <span className="text-sm text-gray-700">
                  I agree to the terms and conditions and confirm that all information provided is accurate.
                </span>
              </label>

              <div className="flex gap-4">
                <button
                  type="button"
                  onClick={() => router.back()}
                  className="flex-1 px-6 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={!agreementAccepted || loading}
                  className={`flex-1 px-6 py-3 rounded-lg font-medium transition-colors flex items-center justify-center gap-2 ${
                    agreementAccepted && !loading
                      ? 'bg-orange-600 text-white hover:bg-orange-700'
                      : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  }`}
                >
                  {loading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      Creating Room...
                    </>
                  ) : (
                    <>
                      <FaSave /> Create Room
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </form>
      </div>

      {/* Thank You Popup */}
      {showThankYouPopup && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-8 max-w-md mx-4 text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Room Created Successfully!</h3>
            <p className="text-gray-600 mb-4">
              Your room has been submitted for review. We'll contact you shortly.
            </p>
            <div className="text-sm text-gray-500">
              Redirecting in 3 seconds...
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
