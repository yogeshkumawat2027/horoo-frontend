"use client";
import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import axios from "axios";
import toast, { Toaster } from 'react-hot-toast';
import { 
  FaHome, 
  FaArrowLeft,
  FaMapMarkerAlt,
  FaDollarSign,
  FaImage,
  FaCog,
  FaSpinner,
  FaEdit,
  FaEye,
  FaCheck,
  FaTimes,
  FaUser,
  FaPhone,
  FaExternalLinkAlt,
  FaYoutube
} from 'react-icons/fa';

export default function ShowHouse() {
  const router = useRouter();
  const params = useParams();
  // const api = "https://horoo-backend-latest.onrender.com/api";
  const api = process.env.NEXT_PUBLIC_API_URL;
  const horooId = params.id; // This will now be horooId like HHE0001

  const [house, setHouse] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (horooId) {
      fetchHouseData();
    }
  }, [horooId]);

  const fetchHouseData = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${api}/house-for-admin/horoo/${horooId}`);
      
      if (res.data.success) {
        setHouse(res.data.house);
      } else {
        toast.error("Failed to fetch house data");
        router.push('/master-admin/listing/house');
      }
    } catch (error) {
      console.error("Error fetching house data:", error);
      toast.error("Failed to load house data");
      router.push('/master-admin/listing/house');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <FaSpinner className="animate-spin text-4xl text-orange-500 mx-auto mb-4" />
          <p className="text-gray-600">Loading house details...</p>
        </div>
      </div>
    );
  }

  if (!house) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <FaHome className="text-6xl text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600 text-lg">House not found</p>
          <button
            onClick={() => router.push('/master-admin/listing/house')}
            className="mt-4 bg-orange-500 hover:bg-orange-600 text-white px-6 py-2 rounded-lg"
          >
            Back to Houses
          </button>
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
              <h1 className="text-2xl font-bold text-gray-800">House Details</h1>
              <p className="text-gray-600">View complete house information</p>
            </div>
          </div>
          
          <div className="flex gap-3">
            <button
              onClick={() => router.push(`/master-admin/listing/house/edit/${houseId}`)}
              className="bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-lg flex items-center gap-2 font-medium transition-colors"
            >
              <FaEdit /> Edit House
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column - Main Info */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Basic Details */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center gap-2 mb-6">
              <FaHome className="text-orange-500" />
              <h2 className="text-xl font-semibold text-gray-800">Basic Information</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-500 mb-1">Horoo ID</label>
                <p className="text-lg font-semibold text-orange-600">{house.horooId}</p>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-500 mb-1">Property Name (Real)</label>
                <p className="text-gray-900">{house.propertyName}</p>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-500 mb-1">Horoo Name (Display)</label>
                <p className="text-gray-900">{house.horooName}</p>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-500 mb-1">House Size</label>
                <p className="text-gray-900">{house.houseSize || 'Not specified'}</p>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-500 mb-1">Quantity</label>
                <p className="text-gray-900">{house.quantity}</p>
              </div>
            </div>
          </div>

          {/* Owner Details */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center gap-2 mb-6">
              <FaUser className="text-orange-500" />
              <h2 className="text-xl font-semibold text-gray-800">Owner Information</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-500 mb-1">Owner Name</label>
                <p className="text-gray-900 flex items-center gap-2">
                  <FaUser className="text-gray-400" />
                  {house.ownerName}
                </p>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-500 mb-1">Mobile Number</label>
                <p className="text-gray-900 flex items-center gap-2">
                  <FaPhone className="text-gray-400" />
                  {house.ownerMobile}
                </p>
              </div>
              
              {house.anotherNo && (
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-500 mb-1">Alternative Number</label>
                  <p className="text-gray-900 flex items-center gap-2">
                    <FaPhone className="text-gray-400" />
                    {house.anotherNo}
                  </p>
                </div>
              )}
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
                <label className="block text-sm font-medium text-gray-500 mb-1">State</label>
                <p className="text-gray-900">{house.state?.name}</p>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-500 mb-1">City</label>
                <p className="text-gray-900">{house.city?.name}</p>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-500 mb-1">Area</label>
                <p className="text-gray-900">{house.area?.name}</p>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-500 mb-1">Pincode</label>
                <p className="text-gray-900">{house.pincode}</p>
              </div>
              
              {house.realAddress && (
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-500 mb-1">Real Address</label>
                  <p className="text-gray-900">{house.realAddress}</p>
                </div>
              )}
              
              {house.horooAddress && (
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-500 mb-1">Horoo Address (Display)</label>
                  <p className="text-gray-900">{house.horooAddress}</p>
                </div>
              )}
              
              {house.mapLink && (
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-500 mb-1">Map Link</label>
                  <a
                    href={house.mapLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-orange-600 hover:text-orange-800 flex items-center gap-2"
                  >
                    <FaExternalLinkAlt />
                    View on Map
                  </a>
                </div>
              )}
            </div>

            {/* Nearby Areas */}
            {house.nearbyAreas && house.nearbyAreas.length > 0 && (
              <div className="mt-6">
                <label className="block text-sm font-medium text-gray-500 mb-2">Nearby Areas</label>
                <div className="flex flex-wrap gap-2">
                  {house.nearbyAreas.map((area, index) => (
                    <span
                      key={index}
                      className="bg-orange-100 text-orange-800 px-3 py-1 rounded-full text-sm"
                    >
                      {area}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* House Details */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center gap-2 mb-6">
              <FaHome className="text-orange-500" />
              <h2 className="text-xl font-semibold text-gray-800">House Specifications</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* House Type */}
              {house.houseType && house.houseType.length > 0 && (
                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-2">House Type</label>
                  <div className="flex flex-wrap gap-2">
                    {house.houseType.map((type, index) => (
                      <span
                        key={index}
                        className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-sm"
                      >
                        {type}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Available For */}
              {house.availableFor && house.availableFor.length > 0 && (
                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-2">Available For</label>
                  <div className="flex flex-wrap gap-2">
                    {house.availableFor.map((type, index) => (
                      <span
                        key={index}
                        className="bg-orange-100 text-orange-800 px-3 py-1 rounded-full text-sm"
                      >
                        {type}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Pricing */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center gap-2 mb-6">
              <FaDollarSign className="text-orange-500" />
              <h2 className="text-xl font-semibold text-gray-800">Pricing Information</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="bg-green-50 p-4 rounded-lg">
                <label className="block text-sm font-medium text-green-600 mb-1">Owner Price</label>
                <p className="text-2xl font-bold text-green-700">₹{house.ownerPrice}</p>
              </div>
              
              <div className="bg-orange-50 p-4 rounded-lg">
                <label className="block text-sm font-medium text-orange-600 mb-1">Horoo Price</label>
                <p className="text-2xl font-bold text-orange-700">₹{house.horooPrice}</p>
              </div>
              
              {house.offerType && (
                <div className="bg-yellow-50 p-4 rounded-lg">
                  <label className="block text-sm font-medium text-yellow-600 mb-1">Offer Type</label>
                  <p className="text-lg font-semibold text-yellow-700">{house.offerType}</p>
                </div>
              )}
            </div>

            {/* Price Plans */}
            {house.pricePlans && house.pricePlans.length > 0 && (
              <div className="mt-6">
                <label className="block text-sm font-medium text-gray-500 mb-2">Price Plans</label>
                <div className="flex flex-wrap gap-2">
                  {house.pricePlans.map((plan, index) => (
                    <span
                      key={index}
                      className="bg-orange-100 text-orange-800 px-3 py-1 rounded-full text-sm"
                    >
                      {plan}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Facilities */}
          {house.facilities && house.facilities.length > 0 && (
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-center gap-2 mb-6">
                <FaCog className="text-orange-500" />
                <h2 className="text-xl font-semibold text-gray-800">Facilities & Features</h2>
              </div>
              
              <div className="flex flex-wrap gap-3">
                {house.facilities.map((facility, index) => (
                  <span
                    key={index}
                    className="bg-green-100 text-green-800 px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2"
                  >
                    <FaCheck className="text-green-600" />
                    {facility}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Descriptions */}
          {(house.description || house.horooDescription) && (
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-6">Descriptions</h2>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {house.description && (
                  <div>
                    <label className="block text-sm font-medium text-gray-500 mb-2">Public Description</label>
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <div className="text-gray-800" dangerouslySetInnerHTML={{ __html: house.description }} />
                    </div>
                  </div>
                )}
                
                {house.horooDescription && (
                  <div>
                    <label className="block text-sm font-medium text-gray-500 mb-2">Internal Description</label>
                    <div className="bg-yellow-50 p-4 rounded-lg">
                      <div className="text-gray-800" dangerouslySetInnerHTML={{ __html: house.horooDescription }} />
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

        </div>

        {/* Right Column - Media & Status */}
        <div className="space-y-6">
          
          {/* Status Cards */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-6">Status</h2>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                <span className="text-sm font-medium text-gray-700">Available</span>
                <span className={`flex items-center gap-2 ${house.availability ? 'text-green-600' : 'text-red-600'}`}>
                  {house.availability ? <FaCheck /> : <FaTimes />}
                  {house.availability ? 'Yes' : 'No'}
                </span>
              </div>
              
              <div className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                <span className="text-sm font-medium text-gray-700">Verified</span>
                <span className={`flex items-center gap-2 ${house.isVerified ? 'text-green-600' : 'text-yellow-600'}`}>
                  {house.isVerified ? <FaCheck /> : <FaTimes />}
                  {house.isVerified ? 'Yes' : 'No'}
                </span>
              </div>
              
              <div className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                <span className="text-sm font-medium text-gray-700">Show on Website</span>
                <span className={`flex items-center gap-2 ${house.isShow ? 'text-green-600' : 'text-red-600'}`}>
                  {house.isShow ? <FaEye /> : <FaTimes />}
                  {house.isShow ? 'Yes' : 'No'}
                </span>
              </div>
            </div>
          </div>

          {/* Main Image */}
          {house.mainImage && (
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-center gap-2 mb-4">
                <FaImage className="text-orange-500" />
                <h2 className="text-lg font-semibold text-gray-800">Main Image</h2>
              </div>
              
              <img
                src={house.mainImage}
                alt={house.horooName}
                className="w-full h-48 object-cover rounded-lg"
              />
            </div>
          )}

          {/* Other Images */}
          {house.otherImages && house.otherImages.length > 0 && (
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-center gap-2 mb-4">
                <FaImage className="text-orange-500" />
                <h2 className="text-lg font-semibold text-gray-800">Gallery ({house.otherImages.length})</h2>
              </div>
              
              <div className="grid grid-cols-2 gap-3">
                {house.otherImages.map((image, index) => (
                  <img
                    key={index}
                    src={image}
                    alt={`Gallery ${index + 1}`}
                    className="w-full h-24 object-cover rounded-lg cursor-pointer hover:opacity-80 transition-opacity"
                    onClick={() => window.open(image, '_blank')}
                  />
                ))}
              </div>
            </div>
          )}

          {/* YouTube Video */}
          {house.youtubeLink && (
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-center gap-2 mb-4">
                <FaYoutube className="text-red-500" />
                <h2 className="text-lg font-semibold text-gray-800">Video</h2>
              </div>
              
              <a
                href={house.youtubeLink}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-red-600 hover:text-red-800 font-medium"
              >
                <FaYoutube />
                Watch on YouTube
                <FaExternalLinkAlt className="text-sm" />
              </a>
            </div>
          )}

          {/* Timestamps */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">Timestamps</h2>
            
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">Created</label>
                <p className="text-sm text-gray-700">
                  {house.createdAt ? new Date(house.createdAt).toLocaleString() : 'N/A'}
                </p>
              </div>
              
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">Last Updated</label>
                <p className="text-sm text-gray-700">
                  {house.updatedAt ? new Date(house.updatedAt).toLocaleString() : 'N/A'}
                </p>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
