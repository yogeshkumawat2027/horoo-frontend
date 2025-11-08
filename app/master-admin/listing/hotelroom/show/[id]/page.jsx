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

export default function ShowHotelRoom() {
  const router = useRouter();
  const params = useParams();
  const api = "https://horoo-backend-latest.onrender.com/api";
  const hotelRoomId = params.id;

  const [hotelRoom, setHotelRoom] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (hotelRoomId) {
      fetchHotelRoomData();
    }
  }, [hotelRoomId]);

  const fetchHotelRoomData = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${api}/hotel-for-admin/${hotelRoomId}`);
      
      if (res.data.success) {
        setHotelRoom(res.data.hotelRoom);
      } else {
        toast.error("Failed to fetch hotel room data");
        router.push('/master-admin/listing/hotelroom');
      }
    } catch (error) {
      console.error("Error fetching hotel room data:", error);
      toast.error("Failed to load hotel room data");
      router.push('/master-admin/listing/hotelroom');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <FaSpinner className="animate-spin text-4xl text-orange-500 mx-auto mb-4" />
          <p className="text-gray-600">Loading hotel room details...</p>
        </div>
      </div>
    );
  }

  if (!hotelRoom) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <FaHome className="text-6xl text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600 text-lg">Hotel room not found</p>
          <button
            onClick={() => router.push('/master-admin/listing/hotelroom')}
            className="mt-4 bg-orange-500 hover:bg-orange-600 text-white px-6 py-2 rounded-lg"
          >
            Back to Hotel Rooms
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
              <h1 className="text-2xl font-bold text-gray-800">Hotel Room Details</h1>
              <p className="text-gray-600">View complete hotel room information</p>
            </div>
          </div>
          
          <div className="flex gap-3">
            <button
              onClick={() => router.push(`/master-admin/listing/hotelroom/edit/${hotelRoomId}`)}
              className="bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-lg flex items-center gap-2 font-medium transition-colors"
            >
              <FaEdit /> Edit Hotel Room
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
              <FaHome className="text-blue-500" />
              <h2 className="text-xl font-semibold text-gray-800">Basic Information</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-500 mb-1">Horoo ID</label>
                <p className="text-lg font-semibold text-orange-600">{hotelRoom.horooId}</p>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-500 mb-1">Property Name (Real)</label>
                <p className="text-gray-900">{hotelRoom.propertyName}</p>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-500 mb-1">Horoo Name (Display)</label>
                <p className="text-gray-900">{hotelRoom.horooName}</p>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-500 mb-1">Room Size</label>
                <p className="text-gray-900">{hotelRoom.roomSize || 'Not specified'}</p>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-500 mb-1">Quantity</label>
                <p className="text-gray-900">{hotelRoom.quantity}</p>
              </div>
            </div>
          </div>

          {/* Owner Details */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center gap-2 mb-6">
              <FaUser className="text-blue-500" />
              <h2 className="text-xl font-semibold text-gray-800">Owner Information</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-500 mb-1">Owner Name</label>
                <p className="text-gray-900 flex items-center gap-2">
                  <FaUser className="text-gray-400" />
                  {hotelRoom.ownerName}
                </p>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-500 mb-1">Mobile Number</label>
                <p className="text-gray-900 flex items-center gap-2">
                  <FaPhone className="text-gray-400" />
                  {hotelRoom.ownerMobile}
                </p>
              </div>
              
              {hotelRoom.anotherNo && (
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-500 mb-1">Alternative Number</label>
                  <p className="text-gray-900 flex items-center gap-2">
                    <FaPhone className="text-gray-400" />
                    {hotelRoom.anotherNo}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Location Details */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center gap-2 mb-6">
              <FaMapMarkerAlt className="text-blue-500" />
              <h2 className="text-xl font-semibold text-gray-800">Location Details</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-500 mb-1">State</label>
                <p className="text-gray-900">{hotelRoom.state?.name}</p>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-500 mb-1">City</label>
                <p className="text-gray-900">{hotelRoom.city?.name}</p>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-500 mb-1">Area</label>
                <p className="text-gray-900">{hotelRoom.area?.name}</p>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-500 mb-1">Pincode</label>
                <p className="text-gray-900">{hotelRoom.pincode}</p>
              </div>
              
              {hotelRoom.realAddress && (
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-500 mb-1">Real Address</label>
                  <p className="text-gray-900">{hotelRoom.realAddress}</p>
                </div>
              )}
              
              {hotelRoom.horooAddress && (
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-500 mb-1">Horoo Address (Display)</label>
                  <p className="text-gray-900">{hotelRoom.horooAddress}</p>
                </div>
              )}
              
              {hotelRoom.mapLink && (
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-500 mb-1">Map Link</label>
                  <a
                    href={hotelRoom.mapLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:text-blue-800 flex items-center gap-2"
                  >
                    <FaExternalLinkAlt />
                    View on Map
                  </a>
                </div>
              )}
            </div>

            {/* Nearby Areas */}
            {hotelRoom.nearbyAreas && hotelRoom.nearbyAreas.length > 0 && (
              <div className="mt-6">
                <label className="block text-sm font-medium text-gray-500 mb-2">Nearby Areas</label>
                <div className="flex flex-wrap gap-2">
                  {hotelRoom.nearbyAreas.map((area, index) => (
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

          {/* Hotel Room Details */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center gap-2 mb-6">
              <FaHome className="text-blue-500" />
              <h2 className="text-xl font-semibold text-gray-800">Hotel Room Specifications</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Room Type */}
              {hotelRoom.roomType && hotelRoom.roomType.length > 0 && (
                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-2">Room Type</label>
                  <div className="flex flex-wrap gap-2">
                    {hotelRoom.roomType.map((type, index) => (
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

              {/* Available For */}
              {hotelRoom.availableFor && hotelRoom.availableFor.length > 0 && (
                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-2">Available For</label>
                  <div className="flex flex-wrap gap-2">
                    {hotelRoom.availableFor.map((type, index) => (
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
              <FaDollarSign className="text-blue-500" />
              <h2 className="text-xl font-semibold text-gray-800">Pricing Information</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="bg-green-50 p-4 rounded-lg">
                <label className="block text-sm font-medium text-green-600 mb-1">Owner Price</label>
                <p className="text-2xl font-bold text-green-700">₹{hotelRoom.ownerPrice}</p>
              </div>
              
              <div className="bg-blue-50 p-4 rounded-lg">
                <label className="block text-sm font-medium text-blue-600 mb-1">Horoo Price</label>
                <p className="text-2xl font-bold text-blue-700">₹{hotelRoom.horooPrice}</p>
              </div>
              
              {hotelRoom.offerType && (
                <div className="bg-yellow-50 p-4 rounded-lg">
                  <label className="block text-sm font-medium text-yellow-600 mb-1">Offer Type</label>
                  <p className="text-lg font-semibold text-yellow-700">{hotelRoom.offerType}</p>
                </div>
              )}
            </div>

            {/* Price Plans */}
            {hotelRoom.pricePlans && hotelRoom.pricePlans.length > 0 && (
              <div className="mt-6">
                <label className="block text-sm font-medium text-gray-500 mb-2">Price Plans</label>
                <div className="flex flex-wrap gap-2">
                  {hotelRoom.pricePlans.map((plan, index) => (
                    <span
                      key={index}
                      className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm"
                    >
                      {plan}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Facilities */}
          {hotelRoom.facilities && hotelRoom.facilities.length > 0 && (
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-center gap-2 mb-6">
                <FaCog className="text-blue-500" />
                <h2 className="text-xl font-semibold text-gray-800">Facilities & Features</h2>
              </div>
              
              <div className="flex flex-wrap gap-3">
                {hotelRoom.facilities.map((facility, index) => (
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
          {(hotelRoom.description || hotelRoom.horooDescription) && (
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-6">Descriptions</h2>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {hotelRoom.description && (
                  <div>
                    <label className="block text-sm font-medium text-gray-500 mb-2">Public Description</label>
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <div 
                        className="text-gray-800 prose max-w-none" 
                        dangerouslySetInnerHTML={{ __html: hotelRoom.description }}
                      />
                    </div>
                  </div>
                )}
                
                {hotelRoom.horooDescription && (
                  <div>
                    <label className="block text-sm font-medium text-gray-500 mb-2">Internal Description</label>
                    <div className="bg-yellow-50 p-4 rounded-lg">
                      <div 
                        className="text-gray-800 prose max-w-none" 
                        dangerouslySetInnerHTML={{ __html: hotelRoom.horooDescription }}
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
                <span className={`flex items-center gap-2 ${hotelRoom.availability ? 'text-green-600' : 'text-red-600'}`}>
                  {hotelRoom.availability ? <FaCheck /> : <FaTimes />}
                  {hotelRoom.availability ? 'Yes' : 'No'}
                </span>
              </div>
              
              <div className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                <span className="text-sm font-medium text-gray-700">Verified</span>
                <span className={`flex items-center gap-2 ${hotelRoom.isVerified ? 'text-green-600' : 'text-yellow-600'}`}>
                  {hotelRoom.isVerified ? <FaCheck /> : <FaTimes />}
                  {hotelRoom.isVerified ? 'Yes' : 'No'}
                </span>
              </div>
              
              <div className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                <span className="text-sm font-medium text-gray-700">Show on Website</span>
                <span className={`flex items-center gap-2 ${hotelRoom.isShow ? 'text-green-600' : 'text-red-600'}`}>
                  {hotelRoom.isShow ? <FaEye /> : <FaTimes />}
                  {hotelRoom.isShow ? 'Yes' : 'No'}
                </span>
              </div>
            </div>
          </div>

          {/* Main Image */}
          {hotelRoom.mainImage && (
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-center gap-2 mb-4">
                <FaImage className="text-blue-500" />
                <h2 className="text-lg font-semibold text-gray-800">Main Image</h2>
              </div>
              
              <img
                src={hotelRoom.mainImage}
                alt={hotelRoom.horooName}
                className="w-full h-48 object-cover rounded-lg"
              />
            </div>
          )}

          {/* Other Images */}
          {hotelRoom.otherImages && hotelRoom.otherImages.length > 0 && (
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-center gap-2 mb-4">
                <FaImage className="text-blue-500" />
                <h2 className="text-lg font-semibold text-gray-800">Gallery ({hotelRoom.otherImages.length})</h2>
              </div>
              
              <div className="grid grid-cols-2 gap-3">
                {hotelRoom.otherImages.map((image, index) => (
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
          {hotelRoom.youtubeLink && (
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-center gap-2 mb-4">
                <FaYoutube className="text-red-500" />
                <h2 className="text-lg font-semibold text-gray-800">Video</h2>
              </div>
              
              <a
                href={hotelRoom.youtubeLink}
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
                  {hotelRoom.createdAt ? new Date(hotelRoom.createdAt).toLocaleString() : 'N/A'}
                </p>
              </div>
              
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">Last Updated</label>
                <p className="text-sm text-gray-700">
                  {hotelRoom.updatedAt ? new Date(hotelRoom.updatedAt).toLocaleString() : 'N/A'}
                </p>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
