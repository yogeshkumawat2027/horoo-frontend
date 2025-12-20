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

export default function ShowRoom() {
  const router = useRouter();
  const params = useParams();
  const api = "https://horoo-backend-latest.onrender.com/api";
  const horooId = params.id; // This will now be horooId like HRM0001

  const [room, setRoom] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (horooId) {
      fetchRoomData();
    }
  }, [horooId]);

  const fetchRoomData = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${api}/room-for-admin/horoo/${horooId}`);
      
      if (res.data.success) {
        setRoom(res.data.room);
      } else {
        toast.error("Failed to fetch room data");
        router.push('/master-admin/listing/room');
      }
    } catch (error) {
      console.error("Error fetching room data:", error);
      toast.error("Failed to load room data");
      router.push('/master-admin/listing/room');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <FaSpinner className="animate-spin text-4xl text-orange-500 mx-auto mb-4" />
          <p className="text-gray-600">Loading room details...</p>
        </div>
      </div>
    );
  }

  if (!room) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <FaHome className="text-6xl text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600 text-lg">Room not found</p>
          <button
            onClick={() => router.push('/master-admin/listing/room')}
            className="mt-4 bg-orange-500 hover:bg-orange-600 text-white px-6 py-2 rounded-lg"
          >
            Back to Rooms
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
              <h1 className="text-2xl font-bold text-gray-800">Room Details</h1>
              <p className="text-gray-600">View complete room information</p>
            </div>
          </div>
          
          <div className="flex gap-3">
            <button
              onClick={() => router.push(`/master-admin/listing/room/edit/${roomId}`)}
              className="bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-lg flex items-center gap-2 font-medium transition-colors"
            >
              <FaEdit /> Edit Room
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
                <p className="text-lg font-semibold text-orange-600">{room.roomId}</p>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-500 mb-1">Property Name (Real)</label>
                <p className="text-gray-900">{room.propertyName}</p>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-500 mb-1">Horoo Name (Display)</label>
                <p className="text-gray-900">{room.horooName}</p>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-500 mb-1">Room Size</label>
                <p className="text-gray-900">{room.roomSize || 'Not specified'}</p>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-500 mb-1">Quantity</label>
                <p className="text-gray-900">{room.quantity}</p>
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
                  {room.ownerName}
                </p>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-500 mb-1">Mobile Number</label>
                <p className="text-gray-900 flex items-center gap-2">
                  <FaPhone className="text-gray-400" />
                  {room.ownerMobile}
                </p>
              </div>
              
              {room.ownerWhatsapp && (
                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-1">WhatsApp Number</label>
                  <p className="text-gray-900 flex items-center gap-2">
                    <FaPhone className="text-green-600" />
                    {room.ownerWhatsapp}
                  </p>
                </div>
              )}
              
              {room.anotherNo && (
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-500 mb-1">Alternative Number</label>
                  <p className="text-gray-900 flex items-center gap-2">
                    <FaPhone className="text-gray-400" />
                    {room.anotherNo}
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
                <p className="text-gray-900">{room.state?.name}</p>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-500 mb-1">City</label>
                <p className="text-gray-900">{room.city?.name}</p>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-500 mb-1">Area</label>
                <p className="text-gray-900">{room.area?.name}</p>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-500 mb-1">Pincode</label>
                <p className="text-gray-900">{room.pincode}</p>
              </div>
              
              {room.realAddress && (
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-500 mb-1">Real Address</label>
                  <p className="text-gray-900">{room.realAddress}</p>
                </div>
              )}
              
              {room.horooAddress && (
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-500 mb-1">Horoo Address (Display)</label>
                  <p className="text-gray-900">{room.horooAddress}</p>
                </div>
              )}
              
              {room.mapLink && (
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-500 mb-1">Map Link</label>
                  <a
                    href={room.mapLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-orange-600 hover:text-orange-800 flex items-center gap-2"
                  >
                    <FaExternalLinkAlt />
                    View on Map
                  </a>
                </div>
              )}
              
              {(room.latitude || room.longitude) && (
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-500 mb-1">Coordinates</label>
                  <p className="text-gray-900">
                    Latitude: {room.latitude || 'N/A'}, Longitude: {room.longitude || 'N/A'}
                  </p>
                </div>
              )}
            </div>

            {/* Nearby Areas */}
            {room.nearbyAreas && room.nearbyAreas.length > 0 && (
              <div className="mt-6">
                <label className="block text-sm font-medium text-gray-500 mb-2">Nearby Areas</label>
                <div className="flex flex-wrap gap-2">
                  {room.nearbyAreas.map((area, index) => (
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

          {/* Room Details */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center gap-2 mb-6">
              <FaHome className="text-orange-500" />
              <h2 className="text-xl font-semibold text-gray-800">Room Specifications</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Room Type */}
              {room.roomType && room.roomType.length > 0 && (
                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-2">Room Type</label>
                  <div className="flex flex-wrap gap-2">
                    {room.roomType.map((type, index) => (
                      <span
                        key={index}
                        className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm"
                      >
                        {type}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Available For */}
              {room.availableFor && room.availableFor.length > 0 && (
                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-2">Available For</label>
                  <div className="flex flex-wrap gap-2">
                    {room.availableFor.map((type, index) => (
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
                <p className="text-2xl font-bold text-green-700">₹{room.ownerPrice}</p>
              </div>
              
              <div className="bg-orange-50 p-4 rounded-lg">
                <label className="block text-sm font-medium text-orange-600 mb-1">Horoo Price</label>
                <p className="text-2xl font-bold text-orange-700">₹{room.horooPrice}</p>
                {room.priceSuffix && (
                  <p className="text-sm text-orange-600 mt-1 capitalize">{room.priceSuffix}</p>
                )}
              </div>
              
              {room.offerType && (
                <div className="bg-yellow-50 p-4 rounded-lg">
                  <label className="block text-sm font-medium text-yellow-600 mb-1">Offer Type</label>
                  <p className="text-lg font-semibold text-yellow-700">{room.offerType}</p>
                </div>
              )}
            </div>

            {/* Price Plans */}
            {room.pricePlans && room.pricePlans.length > 0 && (
              <div className="mt-6">
                <label className="block text-sm font-medium text-gray-500 mb-2">Price Plans</label>
                <div className="flex flex-wrap gap-2">
                  {room.pricePlans.map((plan, index) => (
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
          {room.facilities && room.facilities.length > 0 && (
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-center gap-2 mb-6">
                <FaCog className="text-orange-500" />
                <h2 className="text-xl font-semibold text-gray-800">Facilities & Features</h2>
              </div>
              
              <div className="flex flex-wrap gap-3">
                {room.facilities.map((facility, index) => (
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
          {(room.description || room.horooDescription) && (
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-6">Descriptions</h2>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {room.description && (
                  <div>
                    <label className="block text-sm font-medium text-gray-500 mb-2">Public Description</label>
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <div 
                        className="prose prose-sm max-w-none text-gray-800"
                        dangerouslySetInnerHTML={{ __html: room.description }}
                      />
                    </div>
                  </div>
                )}
                
                {room.horooDescription && (
                  <div>
                    <label className="block text-sm font-medium text-gray-500 mb-2">Internal Description</label>
                    <div className="bg-yellow-50 p-4 rounded-lg">
                      <div 
                        className="prose prose-sm max-w-none text-gray-800"
                        dangerouslySetInnerHTML={{ __html: room.horooDescription }}
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
                <span className={`flex items-center gap-2 ${room.availability ? 'text-green-600' : 'text-red-600'}`}>
                  {room.availability ? <FaCheck /> : <FaTimes />}
                  {room.availability ? 'Yes' : 'No'}
                </span>
              </div>
              
              <div className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                <span className="text-sm font-medium text-gray-700">Verified</span>
                <span className={`flex items-center gap-2 ${room.isVerified ? 'text-green-600' : 'text-yellow-600'}`}>
                  {room.isVerified ? <FaCheck /> : <FaTimes />}
                  {room.isVerified ? 'Yes' : 'No'}
                </span>
              </div>
              
              <div className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                <span className="text-sm font-medium text-gray-700">Show on Website</span>
                <span className={`flex items-center gap-2 ${room.isShow ? 'text-green-600' : 'text-red-600'}`}>
                  {room.isShow ? <FaEye /> : <FaTimes />}
                  {room.isShow ? 'Yes' : 'No'}
                </span>
              </div>
            </div>
          </div>

          {/* Main Image */}
          {room.mainImage && (
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-center gap-2 mb-4">
                <FaImage className="text-orange-500" />
                <h2 className="text-lg font-semibold text-gray-800">Main Image</h2>
              </div>
              
              <img
                src={room.mainImage}
                alt={room.horooName}
                className="w-full h-48 object-cover rounded-lg"
              />
            </div>
          )}

          {/* Other Images */}
          {room.otherImages && room.otherImages.length > 0 && (
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-center gap-2 mb-4">
                <FaImage className="text-orange-500" />
                <h2 className="text-lg font-semibold text-gray-800">Gallery ({room.otherImages.length})</h2>
              </div>
              
              <div className="grid grid-cols-2 gap-3">
                {room.otherImages.map((image, index) => (
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
          {room.youtubeLink && (
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-center gap-2 mb-4">
                <FaYoutube className="text-red-500" />
                <h2 className="text-lg font-semibold text-gray-800">Video</h2>
              </div>
              
              <a
                href={room.youtubeLink}
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
                  {room.createdAt ? new Date(room.createdAt).toLocaleString() : 'N/A'}
                </p>
              </div>
              
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">Last Updated</label>
                <p className="text-sm text-gray-700">
                  {room.updatedAt ? new Date(room.updatedAt).toLocaleString() : 'N/A'}
                </p>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
