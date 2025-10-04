"use client";
import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import axios from "axios";
import toast, { Toaster } from 'react-hot-toast';
import { 
  FaUtensils,
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

export default function ShowMess() {
  const router = useRouter();
  const params = useParams();
  const api = "https://horoo-backend.onrender.com/api";
  const messId = params.id;

  const [mess, setMess] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (messId) {
      fetchMessData();
    }
  }, [messId]);

  const fetchMessData = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${api}/mess/mess-for-admin/${messId}`);
      
      if (res.data.success) {
        setMess(res.data.mess);
      } else {
        toast.error("Failed to fetch mess data");
        router.push('/master-admin/listing/mess');
      }
    } catch (error) {
      console.error('Error fetching mess data:', error);
      toast.error("Failed to fetch mess data");
      router.push('/master-admin/listing/mess');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-center">
          <FaSpinner className="animate-spin text-4xl text-orange-500 mx-auto mb-4" />
          <p className="text-gray-600">Loading mess details...</p>
        </div>
      </div>
    );
  }

  if (!mess) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-center">
          <p className="text-gray-600">Mess not found</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 bg-gray-50 ml-72 min-h-screen">
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
            <div>
              <h1 className="text-3xl font-bold text-gray-800">{mess.horooName}</h1>
              <p className="text-gray-600">Mess ID: {mess.horooId}</p>
            </div>
          </div>
        </div>
        
        <div className="flex gap-3">
          <button
            onClick={() => router.push(`/master-admin/listing/mess/edit/${mess._id}`)}
            className="flex items-center gap-2 px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
          >
            <FaEdit />
            Edit Mess
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column - Main Details */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Basic Information */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center gap-2 mb-6">
              <FaUtensils className="text-orange-500" />
              <h2 className="text-xl font-semibold text-gray-800">Basic Information</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-500 mb-1">Property Name (Real)</label>
                <p className="text-gray-900">{mess.propertyName}</p>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-500 mb-1">Horoo Name (Display)</label>
                <p className="text-gray-900 font-medium">{mess.horooName}</p>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-500 mb-1">Horoo ID</label>
                <p className="text-orange-600 font-medium">{mess.horooId}</p>
              </div>
            </div>
          </div>

          {/* Owner Information */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center gap-2 mb-6">
              <FaUser className="text-orange-500" />
              <h2 className="text-xl font-semibold text-gray-800">Owner Information</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-500 mb-1">Owner Name</label>
                <p className="text-gray-900">{mess.ownerName}</p>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-500 mb-1">Primary Mobile</label>
                <div className="flex items-center gap-2">
                  <FaPhone className="text-green-500" />
                  <p className="text-gray-900">{mess.ownerMobile}</p>
                </div>
              </div>
              
              {mess.anotherNo && (
                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-1">Alternative Number</label>
                  <div className="flex items-center gap-2">
                    <FaPhone className="text-blue-500" />
                    <p className="text-gray-900">{mess.anotherNo}</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Pricing Information */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center gap-2 mb-6">
              <FaDollarSign className="text-orange-500" />
              <h2 className="text-xl font-semibold text-gray-800">Pricing Information</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-500 mb-1">Owner Price</label>
                <p className="text-2xl font-bold text-gray-900">₹{mess.ownerPrice?.toLocaleString()}</p>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-500 mb-1">Horoo Price (Display)</label>
                <p className="text-2xl font-bold text-green-600">₹{mess.horooPrice?.toLocaleString()}</p>
              </div>
              
              {mess.offerType && (
                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-1">Offer Type</label>
                  <span className="bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-sm font-medium">
                    {mess.offerType}
                  </span>
                </div>
              )}
            </div>

            {/* Price Plans */}
            {mess.pricePlans && mess.pricePlans.length > 0 && (
              <div className="mt-6">
                <label className="block text-sm font-medium text-gray-500 mb-2">Price Plans</label>
                <div className="flex flex-wrap gap-2">
                  {mess.pricePlans.map((plan, index) => (
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

          {/* Location Details */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center gap-2 mb-6">
              <FaMapMarkerAlt className="text-orange-500" />
              <h2 className="text-xl font-semibold text-gray-800">Location Details</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-500 mb-1">State</label>
                <p className="text-gray-900">{mess.state?.name}</p>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-500 mb-1">City</label>
                <p className="text-gray-900">{mess.city?.name}</p>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-500 mb-1">Area</label>
                <p className="text-gray-900">{mess.area?.name}</p>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-500 mb-1">Pincode</label>
                <p className="text-gray-900">{mess.pincode}</p>
              </div>
              
              {mess.realAddress && (
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-500 mb-1">Real Address</label>
                  <p className="text-gray-900">{mess.realAddress}</p>
                </div>
              )}
              
              {mess.horooAddress && (
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-500 mb-1">Horoo Address (Display)</label>
                  <p className="text-gray-900">{mess.horooAddress}</p>
                </div>
              )}
              
              {mess.mapLink && (
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-500 mb-1">Map Link</label>
                  <a
                    href={mess.mapLink}
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
            {mess.nearbyAreas && mess.nearbyAreas.length > 0 && (
              <div className="mt-6">
                <label className="block text-sm font-medium text-gray-500 mb-2">Nearby Areas</label>
                <div className="flex flex-wrap gap-2">
                  {mess.nearbyAreas.map((area, index) => (
                    <span
                      key={index}
                      className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm"
                    >
                      {area}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Available For */}
          {mess.availableFor && mess.availableFor.length > 0 && (
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-center gap-2 mb-6">
                <FaUtensils className="text-orange-500" />
                <h2 className="text-xl font-semibold text-gray-800">Available For</h2>
              </div>
              
              <div className="flex flex-wrap gap-3">
                {mess.availableFor.map((type, index) => (
                  <span
                    key={index}
                    className="bg-orange-100 text-orange-800 px-4 py-2 rounded-lg text-sm font-medium"
                  >
                    {type}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Facilities */}
          {mess.facilities && mess.facilities.length > 0 && (
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-center gap-2 mb-6">
                <FaCog className="text-orange-500" />
                <h2 className="text-xl font-semibold text-gray-800">Facilities & Features</h2>
              </div>
              
              <div className="flex flex-wrap gap-3">
                {mess.facilities.map((facility, index) => (
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
          {(mess.description || mess.horooDescription) && (
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-6">Descriptions</h2>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {mess.description && (
                  <div>
                    <label className="block text-sm font-medium text-gray-500 mb-2">Public Description</label>
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <div 
                        className="text-gray-800 prose max-w-none" 
                        dangerouslySetInnerHTML={{ __html: mess.description }}
                      />
                    </div>
                  </div>
                )}
                
                {mess.horooDescription && (
                  <div>
                    <label className="block text-sm font-medium text-gray-500 mb-2">Internal Description</label>
                    <div className="bg-yellow-50 p-4 rounded-lg">
                      <div 
                        className="text-gray-800 prose max-w-none" 
                        dangerouslySetInnerHTML={{ __html: mess.horooDescription }}
                      />
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
                <span className={`flex items-center gap-2 ${mess.availability ? 'text-green-600' : 'text-red-600'}`}>
                  {mess.availability ? <FaCheck /> : <FaTimes />}
                  {mess.availability ? 'Yes' : 'No'}
                </span>
              </div>
              
              <div className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                <span className="text-sm font-medium text-gray-700">Verified</span>
                <span className={`flex items-center gap-2 ${mess.isVerified ? 'text-green-600' : 'text-yellow-600'}`}>
                  {mess.isVerified ? <FaCheck /> : <FaTimes />}
                  {mess.isVerified ? 'Yes' : 'No'}
                </span>
              </div>
              
              <div className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                <span className="text-sm font-medium text-gray-700">Show on Website</span>
                <span className={`flex items-center gap-2 ${mess.isShow ? 'text-green-600' : 'text-red-600'}`}>
                  {mess.isShow ? <FaEye /> : <FaTimes />}
                  {mess.isShow ? 'Yes' : 'No'}
                </span>
              </div>
            </div>
          </div>

          {/* Main Image */}
          {mess.mainImage && (
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-center gap-2 mb-4">
                <FaImage className="text-orange-500" />
                <h3 className="text-lg font-semibold text-gray-800">Main Image</h3>
              </div>
              <img
                src={mess.mainImage}
                alt="Main mess image"
                className="w-full h-64 object-cover rounded-lg"
              />
            </div>
          )}

          {/* Other Images */}
          {mess.otherImages && mess.otherImages.length > 0 && (
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-center gap-2 mb-4">
                <FaImage className="text-orange-500" />
                <h3 className="text-lg font-semibold text-gray-800">Gallery ({mess.otherImages.length})</h3>
              </div>
              <div className="grid grid-cols-2 gap-3">
                {mess.otherImages.map((image, index) => (
                  <img
                    key={index}
                    src={image}
                    alt={`Gallery image ${index + 1}`}
                    className="w-full h-24 object-cover rounded-lg cursor-pointer hover:opacity-80 transition-opacity"
                    onClick={() => window.open(image, '_blank')}
                  />
                ))}
              </div>
            </div>
          )}

          {/* YouTube Video */}
          {mess.youtubeLink && (
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-center gap-2 mb-4">
                <FaYoutube className="text-red-500" />
                <h3 className="text-lg font-semibold text-gray-800">Video</h3>
              </div>
              <a
                href={mess.youtubeLink}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <FaYoutube className="text-red-500" />
                <span className="text-gray-700">Watch Video</span>
                <FaExternalLinkAlt className="text-gray-400" />
              </a>
            </div>
          )}

          {/* Timestamps */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Record Information</h3>
            
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Created:</span>
                <span className="text-gray-900">
                  {new Date(mess.createdAt).toLocaleDateString('en-IN', {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </span>
              </div>
              
              <div className="flex justify-between">
                <span className="text-gray-600">Updated:</span>
                <span className="text-gray-900">
                  {new Date(mess.updatedAt).toLocaleDateString('en-IN', {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </span>
              </div>
              
              <div className="flex justify-between">
                <span className="text-gray-600">ID:</span>
                <span className="text-gray-900 font-mono text-xs">{mess._id}</span>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
