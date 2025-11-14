"use client";
import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import axios from "axios";
import toast, { Toaster } from 'react-hot-toast';
import { 
  FaBuilding, 
  FaArrowLeft, 
  FaEdit, 
  FaTrash, 
  FaMapMarkerAlt,
  FaDollarSign,
  FaPhone,
  FaUser,
  FaCheckCircle,
  FaTimesCircle,
  FaEye,
  FaEyeSlash,
  FaYoutube,
  FaExternalLinkAlt
} from 'react-icons/fa';

export default function ShowCommercial() {
  const router = useRouter();
  const params = useParams();
  const api = "https://horoo-backend-latest.onrender.com/api";
  const [commercial, setCommercial] = useState(null);
  const [loading, setLoading] = useState(true);
  const horooId = params.id; // This will now be horooId like HCL0001

  useEffect(() => {
    if (horooId) {
      fetchCommercial();
    }
  }, [horooId]);

  const fetchCommercial = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${api}/commercial-for-admin/horoo/${horooId}`);
      if (res.data.success) {
        setCommercial(res.data.commercial);
      } else {
        toast.error("Commercial property not found");
        router.push('/master-admin/listing/commercial');
      }
    } catch (error) {
      toast.error("Failed to fetch commercial property details");
      console.error(error);
      router.push('/master-admin/listing/commercial');
    } finally {
      setLoading(false);
    }
  };

  const deleteCommercial = async () => {
    if (window.confirm('Are you sure you want to delete this commercial property? This action cannot be undone.')) {
      try {
        const res = await axios.delete(`${api}/commercial-for-admin/${horooId}`);
        if (res.data.success) {
          toast.success("Commercial property deleted successfully");
          router.push('/master-admin/listing/commercial');
        }
      } catch (error) {
        toast.error("Failed to delete commercial property");
        console.error(error);
      }
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-orange-500"></div>
      </div>
    );
  }

  if (!commercial) {
    return (
      <div className="flex flex-col justify-center items-center min-h-screen">
        <FaBuilding className="text-6xl text-gray-400 mb-4" />
        <h2 className="text-2xl font-semibold text-gray-600 mb-2">Commercial Property Not Found</h2>
        <p className="text-gray-500 mb-6">The commercial property you're looking for doesn't exist.</p>
        <button
          onClick={() => router.push('/master-admin/listing/commercial')}
          className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 rounded-lg transition-colors"
        >
          Back to Commercial Listing
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen ml-72 bg-gray-50 p-6">
      <Toaster position="top-right" />
      
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <button
            onClick={() => router.back()}
            className="p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <FaArrowLeft className="text-xl" />
          </button>
          <FaBuilding className="text-3xl text-orange-500" />
          <div>
            <h1 className="text-3xl font-bold text-gray-800">{commercial.horooName}</h1>
            <p className="text-lg text-gray-600">{commercial.horooId}</p>
          </div>
        </div>
        
        <div className="flex gap-3">
          <button
            onClick={() => router.push(`/master-admin/listing/commercial/edit/${commercial._id}`)}
            className="bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-lg flex items-center gap-2 font-medium transition-colors"
          >
            <FaEdit /> Edit
          </button>
          <button
            onClick={deleteCommercial}
            className="bg-red-500 hover:bg-red-600 text-white px-6 py-3 rounded-lg flex items-center gap-2 font-medium transition-colors"
          >
            <FaTrash /> Delete
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* Status Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className={`p-4 rounded-lg ${commercial.availability ? 'bg-green-100 border-green-200' : 'bg-red-100 border-red-200'} border`}>
            <div className="flex items-center gap-2">
              {commercial.availability ? <FaCheckCircle className="text-green-600" /> : <FaTimesCircle className="text-red-600" />}
              <span className={`font-medium ${commercial.availability ? 'text-green-800' : 'text-red-800'}`}>
                {commercial.availability ? 'Available' : 'Not Available'}
              </span>
            </div>
          </div>
          
          <div className={`p-4 rounded-lg ${commercial.isVerified ? 'bg-orange-100 border-orange-200' : 'bg-yellow-100 border-yellow-200'} border`}>
            <div className="flex items-center gap-2">
              {commercial.isVerified ? <FaCheckCircle className="text-orange-600" /> : <FaTimesCircle className="text-yellow-600" />}
              <span className={`font-medium ${commercial.isVerified ? 'text-orange-800' : 'text-yellow-800'}`}>
                {commercial.isVerified ? 'Verified' : 'Pending Verification'}
              </span>
            </div>
          </div>
          
          <div className={`p-4 rounded-lg ${commercial.isShow ? 'bg-green-100 border-green-200' : 'bg-gray-100 border-gray-200'} border`}>
            <div className="flex items-center gap-2">
              {commercial.isShow ? <FaEye className="text-green-600" /> : <FaEyeSlash className="text-gray-600" />}
              <span className={`font-medium ${commercial.isShow ? 'text-green-800' : 'text-gray-800'}`}>
                {commercial.isShow ? 'Visible on Website' : 'Hidden from Website'}
              </span>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Left Column - Details */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Basic Information */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
                <FaBuilding className="text-orange-500" />
                Basic Information
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-600">Property Name</label>
                  <p className="text-lg font-medium text-gray-900">{commercial.propertyName}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Horoo Name</label>
                  <p className="text-lg font-medium text-gray-900">{commercial.horooName}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Horoo ID</label>
                  <p className="text-lg font-medium text-orange-600">{commercial.horooId}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Quantity</label>
                  <p className="text-lg font-medium text-gray-900">{commercial.quantity}</p>
                </div>
              </div>
            </div>

            {/* Owner Information */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
                <FaUser className="text-orange-500" />
                Owner Information
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-600">Owner Name</label>
                  <p className="text-lg font-medium text-gray-900">{commercial.ownerName}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Mobile Number</label>
                  <div className="flex items-center gap-2">
                    <FaPhone className="text-green-500" />
                    <p className="text-lg font-medium text-gray-900">{commercial.ownerMobile}</p>
                  </div>
                </div>
                {commercial.anotherNo && (
                  <div className="md:col-span-2">
                    <label className="text-sm font-medium text-gray-600">Another Mobile</label>
                    <div className="flex items-center gap-2">
                      <FaPhone className="text-green-500" />
                      <p className="text-lg font-medium text-gray-900">{commercial.anotherNo}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Commercial Details */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Commercial Details</h2>
              
              {commercial.commercialType && commercial.commercialType.length > 0 && (
                <div className="mb-4">
                  <label className="text-sm font-medium text-gray-600">Commercial Types</label>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {commercial.commercialType.map((type, index) => (
                      <span key={index} className="px-3 py-1 bg-orange-100 text-orange-800 rounded-full text-sm">
                        {type}
                      </span>
                    ))}
                  </div>
                </div>
              )}
              
              {commercial.commercialSize && (
                <div className="mb-4">
                  <label className="text-sm font-medium text-gray-600">Size</label>
                  <p className="text-lg font-medium text-gray-900">{commercial.commercialSize}</p>
                </div>
              )}

              {commercial.availableFor && commercial.availableFor.length > 0 && (
                <div className="mb-4">
                  <label className="text-sm font-medium text-gray-600">Available For</label>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {commercial.availableFor.map((option, index) => (
                      <span key={index} className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm">
                        {option}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Location Information */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
                <FaMapMarkerAlt className="text-orange-500" />
                Location Information
              </h2>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-600">State</label>
                    <p className="text-lg font-medium text-gray-900">{commercial.state?.name}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">City</label>
                    <p className="text-lg font-medium text-gray-900">{commercial.city?.name}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">Area</label>
                    <p className="text-lg font-medium text-gray-900">{commercial.area?.name}</p>
                  </div>
                </div>
                
                {commercial.pincode && (
                  <div>
                    <label className="text-sm font-medium text-gray-600">Pin Code</label>
                    <p className="text-lg font-medium text-gray-900">{commercial.pincode}</p>
                  </div>
                )}

                {commercial.realAddress && (
                  <div>
                    <label className="text-sm font-medium text-gray-600">Real Address</label>
                    <p className="text-gray-900">{commercial.realAddress}</p>
                  </div>
                )}

                {commercial.horooAddress && (
                  <div>
                    <label className="text-sm font-medium text-gray-600">Horoo Address</label>
                    <p className="text-gray-900">{commercial.horooAddress}</p>
                  </div>
                )}

                {commercial.nearbyAreas && commercial.nearbyAreas.length > 0 && (
                  <div>
                    <label className="text-sm font-medium text-gray-600">Nearby Areas</label>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {commercial.nearbyAreas.map((area, index) => (
                        <span key={index} className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-sm">
                          {area}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {commercial.mapLink && (
                  <div>
                    <label className="text-sm font-medium text-gray-600">Map Link</label>
                    <a 
                      href={commercial.mapLink} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 text-orange-600 hover:text-orange-800 mt-1"
                    >
                      <FaExternalLinkAlt />
                      View on Map
                    </a>
                  </div>
                )}
              </div>
            </div>

            {/* Facilities */}
            {commercial.facilities && commercial.facilities.length > 0 && (
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h2 className="text-xl font-semibold text-gray-800 mb-4">Facilities & Amenities</h2>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {commercial.facilities.map((facility, index) => (
                    <div key={index} className="flex items-center gap-2 p-2 bg-green-50 rounded-lg">
                      <FaCheckCircle className="text-green-500 text-sm" />
                      <span className="text-gray-800">{facility}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Descriptions */}
            {(commercial.description || commercial.horooDescription) && (
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h2 className="text-xl font-semibold text-gray-800 mb-4">Descriptions</h2>
                
                {commercial.description && (
                  <div className="mb-6">
                    <h3 className="text-lg font-medium text-gray-700 mb-2">Description</h3>
                    <div 
                      className="prose max-w-none text-gray-700"
                      dangerouslySetInnerHTML={{ __html: commercial.description }}
                    />
                  </div>
                )}

                {commercial.horooDescription && (
                  <div>
                    <h3 className="text-lg font-medium text-gray-700 mb-2">Horoo Description</h3>
                    <div 
                      className="prose max-w-none text-gray-700"
                      dangerouslySetInnerHTML={{ __html: commercial.horooDescription }}
                    />
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Right Column - Pricing & Media */}
          <div className="space-y-6">
            
            {/* Pricing */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
                <FaDollarSign className="text-orange-500" />
                Pricing
              </h2>
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-gray-600">Owner Price</label>
                  <p className="text-2xl font-bold text-green-600">₹{commercial.ownerPrice?.toLocaleString()}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Horoo Price</label>
                  <p className="text-2xl font-bold text-orange-600">₹{commercial.horooPrice?.toLocaleString()}</p>
                </div>
                {commercial.offerType && (
                  <div>
                    <span className="inline-block px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-sm font-medium">
                      {commercial.offerType}
                    </span>
                  </div>
                )}
              </div>

              {commercial.pricePlans && commercial.pricePlans.length > 0 && (
                <div className="mt-4">
                  <label className="text-sm font-medium text-gray-600">Price Plans</label>
                  <div className="space-y-2 mt-2">
                    {commercial.pricePlans.map((plan, index) => (
                      <div key={index} className="p-2 bg-orange-50 rounded text-sm">
                        {plan}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Main Image */}
            {commercial.mainImage && (
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h2 className="text-xl font-semibold text-gray-800 mb-4">Main Image</h2>
                <img 
                  src={commercial.mainImage} 
                  alt={commercial.horooName}
                  className="w-full h-64 object-cover rounded-lg"
                />
              </div>
            )}

            {/* Other Images */}
            {commercial.otherImages && commercial.otherImages.length > 0 && (
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h2 className="text-xl font-semibold text-gray-800 mb-4">Other Images</h2>
                <div className="grid grid-cols-2 gap-3">
                  {commercial.otherImages.map((image, index) => (
                    <img 
                      key={index}
                      src={image} 
                      alt={`${commercial.horooName} ${index + 1}`}
                      className="w-full h-32 object-cover rounded-lg"
                    />
                  ))}
                </div>
              </div>
            )}

            {/* YouTube Video */}
            {commercial.youtubeLink && (
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
                  <FaYoutube className="text-red-500" />
                  Video
                </h2>
                <a 
                  href={commercial.youtubeLink} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                >
                  <FaYoutube />
                  Watch Video
                </a>
              </div>
            )}

            {/* System Info */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">System Information</h2>
              <div className="space-y-2 text-sm text-gray-600">
                <div>
                  <span className="font-medium">Created:</span> {new Date(commercial.createdAt).toLocaleDateString()}
                </div>
                <div>
                  <span className="font-medium">Updated:</span> {new Date(commercial.updatedAt).toLocaleDateString()}
                </div>
                <div>
                  <span className="font-medium">ID:</span> {commercial._id}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
