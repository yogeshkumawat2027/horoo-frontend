"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { 
  FaBuilding, 
  FaPlus, 
  FaTrash, 
  FaSave,
  FaArrowLeft,
  FaMapMarkerAlt,
  FaDollarSign,
  FaImage,
  FaUpload,
  FaUser,
  FaPhone,
  FaCog
} from 'react-icons/fa';
import Image from 'next/image';

export default function AddCommercial() {
  const router = useRouter();
  // const api = "https://horoo-backend-latest.onrender.com/api";
  const api = process.env.NEXT_PUBLIC_API_URL;

  // UI state
  const [agreementAccepted, setAgreementAccepted] = useState(false);
  const [showThankYouPopup, setShowThankYouPopup] = useState(false);

  // Form state
  const [formData, setFormData] = useState({
    // Basic Details
    propertyName: "", // not required
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
    
    // Commercial Details
    commercialType: [],
    commercialSize: "",
    quantity: "",
    availableFor: [],
    
    // Pricing
    ownerPrice: "",
    
    // Arrays
    pricePlans: [""],
    facilities: [""],
    nearbyAreas: [""],
    
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

  // Commercial type options
  const commercialTypes = [
    "Shop",
    "Showroom", 
    "Office",
    "Grocery",
    "Salon",
    "Electronics",
    "Pharmacy",
    "Other"
  ];

  // Available for options
  const availableForOptions = ["Rent", "Sale", "Lease"];

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
        // API returns {success: true, states: [...]}
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
        // API returns {success: true, cities: [...]}
        setCities(data.success && Array.isArray(data.cities) ? data.cities : []);
        setAreas([]); // Reset areas
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
        // API returns {success: true, areas: [...]}
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

  // Handle image upload
  const handleImageUpload = (e, type) => {
    const file = e.target.files[0];
    if (file) {
      // Check file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert('Image size should be less than 5MB');
        return;
      }

      // Check file type
      if (!file.type.startsWith('image/')) {
        alert('Please select a valid image file');
        return;
      }

      const reader = new FileReader();
      reader.onload = (event) => {
        if (type === 'main') {
          setFormData(prev => ({ ...prev, mainImage: event.target.result }));
        } else {
          setFormData(prev => ({
            ...prev,
            otherImages: [...prev.otherImages, event.target.result]
          }));
        }
        // Clear the input so same file can be selected again
        e.target.value = '';
      };
      reader.onerror = () => {
        alert('Error reading file');
      };
      reader.readAsDataURL(file);
    }
  };

  // Remove other image
  const removeOtherImage = (index) => {
    setFormData(prev => ({
      ...prev,
      otherImages: prev.otherImages.filter((_, i) => i !== index)
    }));
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validation
    if (!agreementAccepted) {
      alert('Please accept the agreement first');
      return;
    }

    if (!formData.ownerName.trim()) {
      alert('Please enter owner name');
      return;
    }

    if (!formData.ownerMobile.trim()) {
      alert('Please enter owner mobile number');
      return;
    }

    if (!formData.state || !formData.city || !formData.area) {
      alert('Please select state, city and area');
      return;
    }

    if (!formData.pincode.trim()) {
      alert('Please enter pincode');
      return;
    }

    if (!formData.realAddress.trim()) {
      alert('Please enter complete address');
      return;
    }

    if (formData.commercialType.length === 0) {
      alert('Please select at least one commercial type');
      return;
    }

    if (formData.availableFor.length === 0) {
      alert('Please select availability (Rent, Sale, or Lease)');
      return;
    }

    if (!formData.ownerPrice || formData.ownerPrice <= 0) {
      alert('Please enter a valid price');
      return;
    }

    setLoading(true);

    try {
      // Generate Horoo ID
      const horooId = `HRC${Date.now()}`;
      
      const submitData = {
        ...formData,
        horooId,
        horooName: formData.propertyName || `Commercial ${horooId}`,
        horooAddress: formData.realAddress,
        horooPrice: parseInt(formData.ownerPrice),
        availability: true,
        isVerified: false,
        isShow: false,
        quantity: parseInt(formData.quantity) || 1,
        // Filter out empty values from arrays
        pricePlans: formData.pricePlans.filter(plan => plan && plan.trim()),
        facilities: formData.facilities.filter(facility => facility && facility.trim()),
        nearbyAreas: formData.nearbyAreas.filter(area => area && area.trim())
      };

      console.log('Submitting data:', submitData);

      const response = await fetch(`${api}/commercials/commercial`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(submitData)
      });

      console.log('Response status:', response.status);
      console.log('Response headers:', response.headers);
      
      const responseText = await response.text();
      console.log('Raw response:', responseText);
      
      let responseData;
      try {
        responseData = JSON.parse(responseText);
      } catch (parseError) {
        console.error('Failed to parse response as JSON:', parseError);
        alert('Server returned invalid response. Check console for details.');
        return;
      }
      
      console.log('Parsed response:', responseData);

      if (response.ok) {
        setShowThankYouPopup(true);
      } else {
        alert('Error: ' + (responseData.message || responseData.error || 'Failed to submit'));
      }
    } catch (error) {
      console.error('Error submitting commercial:', error);
      alert('Error submitting commercial property: ' + error.message);
    }

    setLoading(false);
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
                <p className="text-sm sm:text-base text-gray-600">List Your Commercial Property</p>
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

        {/* Thank You Popup */}
        {showThankYouPopup && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-2 sm:p-4">
            <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-4 sm:p-6 lg:p-8 mx-2">
              <div className="text-center mb-4 sm:mb-6">
                <div className="w-12 h-12 sm:w-16 sm:h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-6 h-6 sm:w-8 sm:h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                  </svg>
                </div>
                <h3 className="text-xl sm:text-2xl font-bold text-green-600 mb-2">Thank You!</h3>
                <p className="text-sm sm:text-base text-gray-700 mb-4 sm:mb-6 px-2">
                  Your property has been listed successfully! Our team will contact you soon to verify the details.
                </p>
              </div>

              {/* Terms & Conditions */}
              <div className="space-y-3 sm:space-y-4 mb-4 sm:mb-6">
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 sm:p-4">
                  <h4 className="text-sm sm:text-base font-semibold text-blue-800 mb-2 sm:mb-3">📝 Terms & Conditions:</h4>
                  <ul className="space-y-1 sm:space-y-2 text-xs sm:text-sm text-blue-700">
                    <li>• All property details will be verified by our team</li>
                    <li>• Property will go live only after verification</li>
                    <li>• Service charges apply only after successful booking</li>
                    <li>• You can modify/remove your listing anytime</li>
                    <li>• Genuine property details are mandatory</li>
                    <li>• False information may lead to account suspension</li>
                  </ul>
                </div>

                <div className="bg-green-50 border border-green-200 rounded-lg p-3 sm:p-4">
                  <h4 className="text-sm sm:text-base font-semibold text-green-800 mb-2 sm:mb-3">🛡️ What We Provide:</h4>
                  <ul className="space-y-1 sm:space-y-2 text-xs sm:text-sm text-green-700">
                    <li>• Free property listing</li>
                    <li>• Professional verification</li>
                    <li>• Customer support</li>
                    <li>• Marketing & promotion</li>
                    <li>• Booking management</li>
                  </ul>
                </div>

                <div className="bg-orange-50 border border-orange-200 rounded-lg p-3 sm:p-4">
                  <h4 className="text-sm sm:text-base font-semibold text-orange-800 mb-2">📞 Next Steps:</h4>
                  <ul className="space-y-1 text-xs sm:text-sm text-orange-700">
                    <li>• Verification call within 24 hours</li>
                    <li>• Property goes live after approval</li>
                    <li>• You'll receive confirmation via SMS</li>
                  </ul>
                </div>
              </div>

              <button
                onClick={() => {
                  setShowThankYouPopup(false);
                  router.push('/');
                }}
                className="w-full px-4 py-3 bg-orange-500 text-white rounded-lg hover:bg-orange-600 text-sm sm:text-base font-medium"
              >
                Back to Home
              </button>
            </div>
          </div>
        )}

        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6 mb-4 sm:mb-6">
          <div className="flex flex-col sm:flex-row items-center sm:justify-between gap-3">
            <div className="text-center sm:text-left">
              <h1 className="text-lg sm:text-2xl font-bold text-orange-600">List Your Commercial Property</h1>
              <p className="text-sm sm:text-base text-gray-600">Add your commercial space details</p>
            </div>
            <div className="flex items-center gap-2">
              <FaBuilding className="text-orange-500 text-2xl sm:text-3xl" />
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
              {/* Property Name (Optional) */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Property Name (Optional)
                </label>
                <input
                  type="text"
                  name="propertyName"
                  value={formData.propertyName}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  placeholder="Enter property name"
                />
              </div>

              {/* Owner Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Owner Name *
                </label>
                <input
                  type="text"
                  name="ownerName"
                  value={formData.ownerName}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  placeholder="Enter owner name"
                />
              </div>

              {/* Owner Mobile */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Owner Mobile Number *
                </label>
                <input
                  type="tel"
                  name="ownerMobile"
                  value={formData.ownerMobile}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  placeholder="Enter mobile number"
                />
              </div>

              {/* Another Number */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Another Number
                </label>
                <input
                  type="tel"
                  name="anotherNo"
                  value={formData.anotherNo}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
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
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {/* State */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">State *</label>
                <select
                  name="state"
                  value={formData.state}
                  onChange={handleInputChange}
                  required
                  disabled={locationLoading}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent disabled:bg-gray-100"
                >
                  <option value="">{locationLoading ? 'Loading...' : 'Select State'}</option>
                  {Array.isArray(states) && states.map(state => (
                    <option key={state._id} value={state._id}>{state.name}</option>
                  ))}
                </select>
              </div>

              {/* City */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">City *</label>
                <select
                  name="city"
                  value={formData.city}
                  onChange={handleInputChange}
                  required
                  disabled={!formData.state}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent disabled:bg-gray-100"
                >
                  <option value="">Select City</option>
                  {Array.isArray(cities) && cities.map(city => (
                    <option key={city._id} value={city._id}>{city.name}</option>
                  ))}
                </select>
              </div>

              {/* Area */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Area *</label>
                <select
                  name="area"
                  value={formData.area}
                  onChange={handleInputChange}
                  required
                  disabled={!formData.city}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent disabled:bg-gray-100"
                >
                  <option value="">Select Area</option>
                  {Array.isArray(areas) && areas.map(area => (
                    <option key={area._id} value={area._id}>{area.name}</option>
                  ))}
                </select>
              </div>

              {/* Pincode */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Pincode *</label>
                <input
                  type="text"
                  name="pincode"
                  value={formData.pincode}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  placeholder="Enter pincode"
                />
              </div>

              {/* Map Link */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Map Link (Optional)</label>
                <input
                  type="url"
                  name="mapLink"
                  value={formData.mapLink}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  placeholder="Enter Google Maps link"
                />
              </div>
            </div>

            {/* Address */}
            <div className="mt-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">Complete Address *</label>
              <textarea
                name="realAddress"
                value={formData.realAddress}
                onChange={handleInputChange}
                required
                rows="3"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                placeholder="Enter complete address"
              />
            </div>

            {/* Nearby Areas */}
            <div className="mt-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">Nearby Areas</label>
              {formData.nearbyAreas.map((area, index) => (
                <div key={index} className="flex gap-2 mb-2">
                  <input
                    type="text"
                    value={area}
                    onChange={(e) => updateArrayField('nearbyAreas', index, e.target.value)}
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    placeholder="Enter nearby area"
                  />
                  <button
                    type="button"
                    onClick={() => removeArrayField('nearbyAreas', index)}
                    className="px-3 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
                    disabled={formData.nearbyAreas.length === 1}
                  >
                    <FaTrash />
                  </button>
                </div>
              ))}
              <button
                type="button"
                onClick={() => addArrayField('nearbyAreas')}
                className="text-orange-600 hover:text-orange-700 flex items-center gap-1"
              >
                <FaPlus /> Add Nearby Area
              </button>
            </div>
          </div>

          {/* Commercial Details */}
          <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6">
            <div className="flex items-center gap-2 mb-4 sm:mb-6">
              <FaBuilding className="text-orange-500 text-lg sm:text-xl" />
              <h2 className="text-lg sm:text-xl font-semibold text-gray-800">Commercial Details</h2>
            </div>
            
            {/* Commercial Type */}
            <div className="mb-4 sm:mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-3">Commercial Type *</label>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2 sm:gap-3">
                {commercialTypes.map(type => (
                  <label key={type} className="flex items-center space-x-2 cursor-pointer p-2 hover:bg-gray-50 rounded">
                    <input
                      type="checkbox"
                      checked={formData.commercialType.includes(type)}
                      onChange={() => handleCheckboxChange('commercialType', type)}
                      className="rounded border-gray-300 text-orange-600 focus:ring-orange-500 w-4 h-4"
                    />
                    <span className="text-xs sm:text-sm text-gray-700">{type}</span>
                  </label>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
              {/* Commercial Size */}
              <div>
                <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-2">Commercial Size</label>
                <input
                  type="text"
                  name="commercialSize"
                  value={formData.commercialSize}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  placeholder="e.g., 10x12 ft"
                />
              </div>

              {/* Quantity */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Quantity</label>
                <input
                  type="text"
                  name="quantity"
                  value={formData.quantity}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  placeholder="Enter quantity"
                />
              </div>
            </div>

            {/* Available For */}
            <div className="mt-6">
              <label className="block text-sm font-medium text-gray-700 mb-3">Available For *</label>
              <div className="flex gap-6">
                {availableForOptions.map(option => (
                  <label key={option} className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.availableFor.includes(option)}
                      onChange={() => handleCheckboxChange('availableFor', option)}
                      className="rounded border-gray-300 text-orange-600 focus:ring-orange-500"
                    />
                    <span className="text-sm text-gray-700">{option}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>

          {/* Pricing */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center gap-2 mb-6">
              <FaDollarSign className="text-orange-500" />
              <h2 className="text-xl font-semibold text-gray-800">Pricing</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Owner Price */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Your Price *</label>
                <input
                  type="number"
                  name="ownerPrice"
                  value={formData.ownerPrice}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  placeholder="Enter your price"
                />
              </div>
            </div>

            {/* Price Plans */}
            <div className="mt-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">Price Plans</label>
              {formData.pricePlans.map((plan, index) => (
                <div key={index} className="flex gap-2 mb-2">
                  <input
                    type="text"
                    value={plan}
                    onChange={(e) => updateArrayField('pricePlans', index, e.target.value)}
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    placeholder="e.g., Monthly ₹10,000"
                  />
                  <button
                    type="button"
                    onClick={() => removeArrayField('pricePlans', index)}
                    className="px-3 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
                    disabled={formData.pricePlans.length === 1}
                  >
                    <FaTrash />
                  </button>
                </div>
              ))}
              <button
                type="button"
                onClick={() => addArrayField('pricePlans')}
                className="text-orange-600 hover:text-orange-700 flex items-center gap-1"
              >
                <FaPlus /> Add Price Plan
              </button>
            </div>
          </div>

          {/* Facilities */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center gap-2 mb-6">
              <FaCog className="text-orange-500" />
              <h2 className="text-xl font-semibold text-gray-800">Facilities</h2>
            </div>
            
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
                  className="px-3 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
                  disabled={formData.facilities.length === 1}
                >
                  <FaTrash />
                </button>
              </div>
            ))}
            <button
              type="button"
              onClick={() => addArrayField('facilities')}
              className="text-orange-600 hover:text-orange-700 flex items-center gap-1"
            >
              <FaPlus /> Add Facility
            </button>
          </div>

          {/* Images */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center gap-2 mb-6">
              <FaImage className="text-orange-500" />
              <h2 className="text-xl font-semibold text-gray-800">Images</h2>
            </div>
            
            {/* Main Image */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">Main Image</label>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                {formData.mainImage ? (
                  <div className="relative">
                    <Image
                      src={formData.mainImage}
                      alt="Main"
                      width={200}
                      height={150}
                      className="mx-auto rounded-lg"
                    />
                    <button
                      type="button"
                      onClick={() => setFormData(prev => ({ ...prev, mainImage: "" }))}
                      className="absolute top-2 right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center"
                    >
                      ×
                    </button>
                  </div>
                ) : (
                  <div>
                    <FaUpload className="mx-auto text-4xl text-gray-400 mb-2" />
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleImageUpload(e, 'main')}
                      className="hidden"
                      id="main-image"
                    />
                    <label
                      htmlFor="main-image"
                      className="cursor-pointer bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600"
                    >
                      Upload Main Image
                    </label>
                  </div>
                )}
              </div>
            </div>

            {/* Other Images */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Other Images</label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {formData.otherImages.map((image, index) => (
                  <div key={index} className="relative">
                    <Image
                      src={image}
                      alt={`Other ${index + 1}`}
                      width={150}
                      height={100}
                      className="w-full h-24 object-cover rounded-lg"
                    />
                    <button
                      type="button"
                      onClick={() => removeOtherImage(index)}
                      className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs"
                    >
                      ×
                    </button>
                  </div>
                ))}
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 flex flex-col items-center justify-center h-24">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleImageUpload(e, 'other')}
                    className="hidden"
                    id="other-images"
                    key={formData.otherImages.length}
                  />
                  <label
                    htmlFor="other-images"
                    className="cursor-pointer text-gray-500 text-center"
                  >
                    <FaPlus className="mx-auto mb-1" />
                    <span className="text-xs">Add Image</span>
                  </label>
                </div>
              </div>
            </div>
          </div>

          {/* Description */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center gap-2 mb-6">
              <FaBuilding className="text-orange-500" />
              <h2 className="text-xl font-semibold text-gray-800">Description</h2>
            </div>
            
            <textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              rows="5"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              placeholder="Describe your commercial property..."
            />
          </div>

          {/* Submit Button */}
          <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6">
            <div className="flex flex-col sm:flex-row justify-end gap-3 sm:gap-4">
              <button
                type="button"
                onClick={() => router.back()}
                className="w-full sm:w-auto px-6 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 text-sm sm:text-base"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading || !agreementAccepted}
                className="w-full sm:w-auto px-6 py-3 bg-orange-500 text-white rounded-lg hover:bg-orange-600 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 text-sm sm:text-base font-medium"
              >
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    Submitting...
                  </>
                ) : (
                  <>
                    <FaSave className="text-sm" />
                    List Property
                  </>
                )}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
