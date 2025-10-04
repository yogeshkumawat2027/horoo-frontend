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

export default function ShowHostel() {
  const router = useRouter();
  const params = useParams();
  const api = "http://localhost:5000/api";
  const hostelId = params.id;

  const [hostel, setHostel] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (hostelId) {
      fetchHostelData();
    }
  }, [hostelId]);

  const fetchHostelData = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${api}/hostel-for-admin/${hostelId}`);
      
      if (res.data.success) {
        setHostel(res.data.hostel);
      } else {
        toast.error("Failed to fetch hostel data");
        router.push('/master-admin/listing/hostel');
      }
    } catch (error) {
      console.error("Error fetching hostel data:", error);
      toast.error("Failed to load hostel data");
      router.push('/master-admin/listing/hostel');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <FaSpinner className="animate-spin text-4xl text-orange-500 mx-auto mb-4" />
          <p className="text-gray-600">Loading hostel details...</p>
        </div>
      </div>
    );
  }

  if (!hostel) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <FaHome className="text-6xl text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600 text-lg">Hostel not found</p>
          <button
            onClick={() => router.push('/master-admin/listing/hostel')}
            className="mt-4 bg-orange-500 hover:bg-orange-600 text-white px-6 py-2 rounded-lg"
          >
            Back to Hostels
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
              <h1 className="text-2xl font-bold text-gray-800">Hostel Details</h1>
              <p className="text-gray-600">View complete hostel information</p>
            </div>
          </div>
          
          <div className="flex gap-3">
            <button
              onClick={() => router.push(`/master-admin/listing/hostel/edit/${hostelId}`)}
              className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 rounded-lg flex items-center gap-2 font-medium transition-colors"
            >
              <FaEdit /> Edit Hostel
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
                <p className="text-lg font-semibold text-orange-600">{hostel.horooId}</p>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-500 mb-1">Property Name (Real)</label>
                <p className="text-gray-900">{hostel.propertyName}</p>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-500 mb-1">Horoo Name (Display)</label>
                <p className="text-gray-900">{hostel.horooName}</p>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-500 mb-1">Room Size</label>
                <p className="text-gray-900">{hostel.roomSize || 'Not specified'}</p>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-500 mb-1">Quantity</label>
                <p className="text-gray-900">{hostel.quantity}</p>
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
                  {hostel.ownerName}
                </p>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-500 mb-1">Mobile Number</label>
                <p className="text-gray-900 flex items-center gap-2">
                  <FaPhone className="text-gray-400" />
                  {hostel.ownerMobile}
                </p>
              </div>
              
              {hostel.anotherNo && (
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-500 mb-1">Alternative Number</label>
                  <p className="text-gray-900 flex items-center gap-2">
                    <FaPhone className="text-gray-400" />
                    {hostel.anotherNo}
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
                <p className="text-gray-900">{hostel.state?.name}</p>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-500 mb-1">City</label>
                <p className="text-gray-900">{hostel.city?.name}</p>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-500 mb-1">Area</label>
                <p className="text-gray-900">{hostel.area?.name}</p>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-500 mb-1">Pincode</label>
                <p className="text-gray-900">{hostel.pincode}</p>
              </div>
              
              {hostel.realAddress && (
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-500 mb-1">Real Address</label>
                  <p className="text-gray-900">{hostel.realAddress}</p>
                </div>
              )}
              
              {hostel.horooAddress && (
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-500 mb-1">Horoo Address (Display)</label>
                  <p className="text-gray-900">{hostel.horooAddress}</p>
                </div>
              )}
              
              {hostel.mapLink && (
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-500 mb-1">Map Link</label>
                  <a
                    href={hostel.mapLink}
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
            {hostel.nearbyAreas && hostel.nearbyAreas.length > 0 && (
              <div className="mt-6">
                <label className="block text-sm font-medium text-gray-500 mb-2">Nearby Areas</label>
                <div className="flex flex-wrap gap-2">
                  {hostel.nearbyAreas.map((area, index) => (
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

          {/* Hostel Details */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center gap-2 mb-6">
              <FaHome className="text-orange-500" />
              <h2 className="text-xl font-semibold text-gray-800">Hostel Specifications</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Room Type */}
              {hostel.roomType && hostel.roomType.length > 0 && (
                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-2">Room Type</label>
                  <div className="flex flex-wrap gap-2">
                    {hostel.roomType.map((type, index) => (
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
              {hostel.availableFor && hostel.availableFor.length > 0 && (
                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-2">Available For</label>
                  <div className="flex flex-wrap gap-2">
                    {hostel.availableFor.map((type, index) => (
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
                <p className="text-2xl font-bold text-green-700">₹{hostel.ownerPrice}</p>
              </div>
              
              <div className="bg-orange-50 p-4 rounded-lg">
                <label className="block text-sm font-medium text-orange-600 mb-1">Horoo Price</label>
                <p className="text-2xl font-bold text-orange-700">₹{hostel.horooPrice}</p>
              </div>
              
              {hostel.offerType && (
                <div className="bg-yellow-50 p-4 rounded-lg">
                  <label className="block text-sm font-medium text-yellow-600 mb-1">Offer Type</label>
                  <p className="text-lg font-semibold text-yellow-700">{hostel.offerType}</p>
                </div>
              )}
            </div>

            {/* Price Plans */}
            {hostel.pricePlans && hostel.pricePlans.length > 0 && (
              <div className="mt-6">
                <label className="block text-sm font-medium text-gray-500 mb-2">Price Plans</label>
                <div className="flex flex-wrap gap-2">
                  {hostel.pricePlans.map((plan, index) => (
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
          {hostel.facilities && hostel.facilities.length > 0 && (
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-center gap-2 mb-6">
                <FaCog className="text-orange-500" />
                <h2 className="text-xl font-semibold text-gray-800">Facilities & Features</h2>
              </div>
              
              <div className="flex flex-wrap gap-3">
                {hostel.facilities.map((facility, index) => (
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
          {(hostel.description || hostel.messDescription || hostel.horooDescription) && (
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-6">Descriptions</h2>
              
              <div className="grid grid-cols-1 gap-6">
                {hostel.description && (
                  <div>
                    <label className="block text-sm font-medium text-gray-500 mb-2">Public Description</label>
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <div 
                        className="text-gray-800 prose prose-sm max-w-none"
                        dangerouslySetInnerHTML={{ __html: hostel.description }}
                      />
                    </div>
                  </div>
                )}

                {hostel.messDescription && (
                  <div>
                    <label className="block text-sm font-medium text-gray-500 mb-2">Mess Description</label>
                    <div className="bg-orange-50 p-4 rounded-lg">
                      <div 
                        className="text-gray-800 prose prose-sm max-w-none"
                        dangerouslySetInnerHTML={{ __html: hostel.messDescription }}
                      />
                    </div>
                  </div>
                )}
                
                {hostel.horooDescription && (
                  <div>
                    <label className="block text-sm font-medium text-gray-500 mb-2">Internal Description</label>
                    <div className="bg-yellow-50 p-4 rounded-lg">
                      <div 
                        className="text-gray-800 prose prose-sm max-w-none"
                        dangerouslySetInnerHTML={{ __html: hostel.horooDescription }}
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
                <span className={`flex items-center gap-2 ${hostel.availability ? 'text-green-600' : 'text-red-600'}`}>
                  {hostel.availability ? <FaCheck /> : <FaTimes />}
                  {hostel.availability ? 'Yes' : 'No'}
                </span>
              </div>
              
              <div className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                <span className="text-sm font-medium text-gray-700">Verified</span>
                <span className={`flex items-center gap-2 ${hostel.isVerified ? 'text-green-600' : 'text-yellow-600'}`}>
                  {hostel.isVerified ? <FaCheck /> : <FaTimes />}
                  {hostel.isVerified ? 'Yes' : 'No'}
                </span>
              </div>
              
              <div className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                <span className="text-sm font-medium text-gray-700">Show on Website</span>
                <span className={`flex items-center gap-2 ${hostel.isShow ? 'text-green-600' : 'text-red-600'}`}>
                  {hostel.isShow ? <FaEye /> : <FaTimes />}
                  {hostel.isShow ? 'Yes' : 'No'}
                </span>
              </div>
            </div>
          </div>

          {/* Main Image */}
          {hostel.mainImage && (
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-center gap-2 mb-4">
                <FaImage className="text-orange-500" />
                <h2 className="text-lg font-semibold text-gray-800">Main Image</h2>
              </div>
              
              <img
                src={hostel.mainImage}
                alt={hostel.horooName}
                className="w-full h-48 object-cover rounded-lg"
              />
            </div>
          )}

          {/* Other Images */}
          {hostel.otherImages && hostel.otherImages.length > 0 && (
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-center gap-2 mb-4">
                <FaImage className="text-orange-500" />
                <h2 className="text-lg font-semibold text-gray-800">Gallery ({hostel.otherImages.length})</h2>
              </div>
              
              <div className="grid grid-cols-2 gap-3">
                {hostel.otherImages.map((image, index) => (
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
          {hostel.youtubeLink && (
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-center gap-2 mb-4">
                <FaYoutube className="text-red-500" />
                <h2 className="text-lg font-semibold text-gray-800">Video</h2>
              </div>
              
              <a
                href={hostel.youtubeLink}
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
                  {hostel.createdAt ? new Date(hostel.createdAt).toLocaleString() : 'N/A'}
                </p>
              </div>
              
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">Last Updated</label>
                <p className="text-sm text-gray-700">
                  {hostel.updatedAt ? new Date(hostel.updatedAt).toLocaleString() : 'N/A'}
                </p>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
