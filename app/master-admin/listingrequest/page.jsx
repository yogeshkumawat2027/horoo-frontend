"use client";
import { useState, useEffect, useRef } from "react";
import { Toaster, toast } from "react-hot-toast";
import { FaFilter, FaSearch, FaSync, FaPhone, FaUser, FaClock, FaMapMarkerAlt, FaBuilding, FaBed, FaHome, FaWarehouse, FaHotel, FaStore, FaCheckCircle, FaExclamationCircle, FaPauseCircle, FaTimesCircle, FaBan, FaLock } from "react-icons/fa";

export default function ListingRequestsPage() {
  // const api = "https://horoo-backend-latest.onrender.com/api";
  const api = process.env.NEXT_PUBLIC_API_URL;
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const hasFetched = useRef(false);

  // Filters
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const [propertyType, setPropertyType] = useState("");

  // Fetch All Listing Requests
  const fetchRequests = async () => {
    try {
      setLoading(true);

      const res = await fetch(`${api}/listing-requests`);
      const data = await res.json();

      console.log("API RESPONSE:", data);

      if (data.success && Array.isArray(data.data)) {
        const uniqueRequests = Array.from(
          new Map(data.data.map(item => [item._id, item])).values()
        );
        setRequests(uniqueRequests);
      } else {
        setRequests([]);
        toast.error("Failed to load listing requests");
      }
    } catch (err) {
      console.log("Fetch error:", err);
      toast.error("Backend error while fetching listing requests");
      setRequests([]);
    } finally {
      setLoading(false);
    }
  };

  // Update Status
  const updateStatus = async (id, newStatus) => {
    try {
      const res = await fetch(`${api}/listing-requests/update/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: newStatus }),
      });

      const data = await res.json();

      if (data.success) {
        toast.success("Status updated successfully!");

        setRequests((prev) =>
          prev.map((req) =>
            req._id === id ? { ...req, status: newStatus } : req
          )
        );
      } else {
        toast.error("Failed to update");
      }
    } catch (err) {
      toast.error("Backend error while updating");
    }
  };

  useEffect(() => {
    if (!hasFetched.current) {
      hasFetched.current = true;
      fetchRequests();
    }
  }, []);

  // Filter + Search logic
  const filteredRequests = requests.filter((req) => {
    const matchesSearch =
      req.name?.toLowerCase().includes(search.toLowerCase()) ||
      req.mobile?.includes(search) ||
      req.address?.toLowerCase().includes(search.toLowerCase());

    const matchesStatus = status ? req.status === status : true;
    const matchesPropertyType = propertyType ? req.propertyType === propertyType : true;

    return matchesSearch && matchesStatus && matchesPropertyType;
  });

  // Status color mapping
  const getStatusColor = (status) => {
    const colors = {
      new: "bg-blue-100 text-blue-700 border-blue-200",
      pending: "bg-yellow-100 text-yellow-700 border-yellow-200",
      "on-hold": "bg-purple-100 text-purple-700 border-purple-200",
      listed: "bg-green-100 text-green-700 border-green-200",
      rejected: "bg-red-100 text-red-700 border-red-200",
      fraud: "bg-red-200 text-red-800 border-red-300",
      closed: "bg-gray-100 text-gray-700 border-gray-200",
    };
    return colors[status] || "bg-gray-100 text-gray-700 border-gray-200";
  };

  // Property type icons
  const getPropertyTypeIcon = (type) => {
    const icons = {
      room: <FaBed className="text-blue-600" />,
      flat: <FaHome className="text-blue-600" />,
      house: <FaBuilding className="text-blue-600" />,
      hostel: <FaWarehouse className="text-blue-600" />,
      hotel: <FaHotel className="text-blue-600" />,
      commercial: <FaStore className="text-blue-600" />
    };
    return icons[type] || <FaBuilding className="text-blue-600" />;
  };

  return (
    <div className="ml-72 p-8 bg-gray-50 min-h-screen">
      <Toaster position="top-right" toastOptions={{
        duration: 3000,
        style: {
          background: '#363636',
          color: '#fff',
        },
      }} />

      {/* Header */}
      <div className="bg-white border-l-4 border-orange-600 p-6 rounded-lg shadow-sm mb-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-1">Listing Requests</h1>
        <p className="text-gray-600 text-sm flex items-center gap-2">
          <FaFilter className="text-xs" />
          Manage property owner listing requests
        </p>
        <div className="mt-4 flex gap-4 text-sm">
          <div className="bg-orange-50 border border-orange-200 px-4 py-2 rounded-lg">
            <span className="font-semibold text-orange-600">{requests.length}</span>
            <span className="text-gray-600 ml-1">Total</span>
          </div>
          <div className="bg-gray-50 border border-gray-200 px-4 py-2 rounded-lg">
            <span className="font-semibold text-gray-800">{filteredRequests.length}</span>
            <span className="text-gray-600 ml-1">Filtered</span>
          </div>
        </div>
      </div>

      {/* Filters Section */}
      <div className="bg-white p-5 rounded-lg shadow-sm mb-6 border border-gray-200">
        <div className="flex flex-col lg:flex-row gap-4 items-center">
          {/* Search */}
          <div className="flex-1 relative">
            <input
              type="text"
              placeholder="Search by name, phone, or address..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all"
            />
            <FaSearch className="absolute left-3 top-3.5 text-gray-400" />
          </div>

          {/* Property Type Filter */}
          <div className="relative">
            <select
              value={propertyType}
              onChange={(e) => setPropertyType(e.target.value)}
              className="pl-10 pr-8 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 appearance-none cursor-pointer transition-all min-w-[180px]"
            >
              <option value="">All Properties</option>
              <option value="room">Room</option>
              <option value="flat">Flat</option>
              <option value="house">House</option>
              <option value="hostel">Hostel</option>
              <option value="hotel">Hotel</option>
              <option value="commercial">Commercial</option>
            </select>
            <FaBuilding className="absolute left-3 top-3.5 text-gray-400 pointer-events-none" />
          </div>

          {/* Status Filter */}
          <div className="relative">
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="pl-10 pr-8 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 appearance-none cursor-pointer transition-all min-w-[180px]"
            >
              <option value="">All Status</option>
              <option value="new">New</option>
              <option value="pending">Pending</option>
              <option value="on-hold">On Hold</option>
              <option value="listed">Listed</option>
              <option value="rejected">Rejected</option>
              <option value="fraud">Fraud</option>
              <option value="closed">Closed</option>
            </select>
            <FaFilter className="absolute left-3 top-3.5 text-gray-400 pointer-events-none" />
          </div>

          {/* Refresh Button */}
          <button
            onClick={() => {
              hasFetched.current = false;
              fetchRequests();
            }}
            className="bg-orange-600 hover:bg-orange-700 text-white px-6 py-2.5 rounded-lg flex items-center gap-2 font-medium shadow-sm hover:shadow transition-all"
          >
            <FaSync /> Refresh
          </button>
        </div>
      </div>

      {/* Requests List */}
      {loading ? (
        <div className="p-16 text-center">
          <div className="animate-spin h-12 w-12 border-4 border-orange-600 border-t-transparent mx-auto rounded-full"></div>
          <p className="mt-4 text-gray-600 font-medium">Loading listing requests...</p>
        </div>
      ) : filteredRequests.length === 0 ? (
        <div className="bg-white p-12 text-center rounded-lg shadow-sm border border-gray-200">
          <div className="text-5xl mb-3">📋</div>
          <p className="text-gray-700 text-lg font-medium">No listing requests found</p>
          <p className="text-gray-500 mt-1 text-sm">Try adjusting your filters</p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredRequests.map((req) => (
            <div
              key={req._id}
              className="bg-white p-5 rounded-lg shadow-sm border border-gray-200 hover:shadow-md hover:border-orange-300 transition-all"
            >
              <div className="flex flex-col md:flex-row md:items-center gap-4">

                {/* Owner Info */}
                <div className="flex items-center gap-3 md:w-64">
                  <div className="bg-orange-100 p-3 rounded-lg flex-shrink-0">
                    <FaUser className="text-orange-600 text-lg" />
                  </div>
                  <div className="min-w-0">
                    <h2 className="text-base font-bold text-gray-800 truncate">
                      {req.name}
                    </h2>
                    <p className="text-xs text-gray-500">#{req._id.slice(-8)}</p>
                  </div>
                </div>

                {/* Contact Info */}
                <div className="flex flex-col gap-3 md:flex-1">
                  <div className="flex items-center gap-2 text-gray-700">
                    <FaPhone className="text-orange-600 flex-shrink-0" />
                    <span className="text-sm font-medium">{req.mobile}</span>
                  </div>
                  <div className="flex items-start gap-2 text-gray-700">
                    <FaMapMarkerAlt className="text-orange-600 flex-shrink-0 mt-0.5" />
                    <span className="text-sm font-medium">
                      {req.address}
                    </span>
                  </div>
                </div>

                {/* Property Type Badge */}
                <div className="md:w-32">
                  <div className="bg-blue-50 border border-blue-200 px-3 py-2 rounded-lg flex items-center justify-center gap-2">
                    {getPropertyTypeIcon(req.propertyType)}
                    <span className="text-xs font-semibold text-blue-700 capitalize">
                      {req.propertyType}
                    </span>
                  </div>
                </div>

                {/* Status */}
                <div className="md:w-48">
                  <select
                    value={req.status}
                    onChange={(e) => updateStatus(req._id, e.target.value)}
                    className={`w-full px-3 py-2 rounded-lg text-sm font-semibold border-2 cursor-pointer transition-all capitalize ${getStatusColor(req.status)}`}
                  >
                    <option value="new">🆕 New</option>
                    <option value="pending">⏳ Pending</option>
                    <option value="on-hold">⏸️ On Hold</option>
                    <option value="listed">✅ Listed</option>
                    <option value="rejected">❌ Rejected</option>
                    <option value="fraud">⚠️ Fraud</option>
                    <option value="closed">🔒 Closed</option>
                  </select>
                </div>

                {/* Timestamp */}
                <div className="flex items-center gap-2 text-xs text-gray-500 md:w-40">
                  <FaClock className="flex-shrink-0" />
                  <span className="whitespace-nowrap">
                    {new Date(req.createdAt).toLocaleString("en-IN", {
                      day: "2-digit",
                      month: "short",
                      year: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </span>
                </div>

              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
