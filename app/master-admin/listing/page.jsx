"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import toast, { Toaster } from 'react-hot-toast';
import { 
  FaHome, 
  FaBuilding, 
  FaBed, 
  FaHotel,
  FaUtensils,
  FaWarehouse,
  FaCog
} from 'react-icons/fa';

export default function ListingPage() {
  const router = useRouter();
  const api = "https://horoo-backend-latest.onrender.com/api";
  
  // State for all property counts
  const [propertyCounts, setPropertyCounts] = useState({
    rooms: 0,
    flats: 0,
    hostels: 0,
    houses: 0,
    hotelrooms: 0,
    mess: 0,
    commercials: 0
  });
  
  const [loading, setLoading] = useState(true);
  const [totalProperties, setTotalProperties] = useState(0);

  // Property types configuration
  const propertyTypes = [
    {
      id: 'rooms',
      name: 'Rooms',
      icon: FaBed,
      route: '/master-admin/listing/room'
    },
    {
      id: 'flats',
      name: 'Flats',
      icon: FaHome,
      route: '/master-admin/listing/flat'
    },
    {
      id: 'hostels',
      name: 'Hostels',
      icon: FaBuilding,
      route: '/master-admin/listing/hostel'
    },
    {
      id: 'houses',
      name: 'Houses',
      icon: FaHome,
      route: '/master-admin/listing/house'
    },
    {
      id: 'hotelrooms',
      name: 'Hotel Rooms',
      icon: FaHotel,
      route: '/master-admin/listing/hotelroom'
    },
    {
      id: 'mess',
      name: 'Mess',
      icon: FaUtensils,
      route: '/master-admin/listing/mess'
    },
    {
      id: 'commercials',
      name: 'Commercial',
      icon: FaWarehouse,
      route: '/master-admin/listing/commercial'
    }
  ];

  useEffect(() => {
    fetchAllPropertyCounts();
  }, []);

  // Fetch total counts for all property types
  const fetchAllPropertyCounts = async () => {
    setLoading(true);
    try {
      // Manual API calls for each property type
      const counts = {
        rooms: 0,
        flats: 0,
        hostels: 0,
        houses: 0,
        hotelrooms: 0,
        mess: 0,
        commercials: 0
      };

      // Fetch rooms
      try {
        const roomsResponse = await axios.get(`${api}/rooms`);
        if (roomsResponse.data.success) {
          counts.rooms = roomsResponse.data.rooms?.length || 0;
        }
      } catch (error) {
        console.error('Error fetching rooms:', error);
      }

      // Fetch flats
      try {
        const flatsResponse = await axios.get(`${api}/flats`);
        if (flatsResponse.data.success) {
          counts.flats = flatsResponse.data.Flats?.length || 0;
        }
      } catch (error) {
        console.error('Error fetching flats:', error);
      }

      // Fetch hostels
      try {
        const hostelsResponse = await axios.get(`${api}/hostels`);
        if (hostelsResponse.data.success) {
          counts.hostels = hostelsResponse.data.Hostels?.length || 0;
        }
      } catch (error) {
        console.error('Error fetching hostels:', error);
      }

      // Fetch houses
      try {
        const housesResponse = await axios.get(`${api}/houses/house`);
        if (housesResponse.data.success) {
          counts.houses = housesResponse.data.houses?.length || 0;
        }
      } catch (error) {
        console.error('Error fetching houses:', error);
      }

      // Fetch hotel rooms
      try {
        const hotelResponse = await axios.get(`${api}/hotelroom/hotel`);
        if (hotelResponse.data.success) {
          counts.hotelrooms = hotelResponse.data.HotelRooms?.length || 0;
        }
      } catch (error) {
        console.error('Error fetching hotel rooms:', error);
      }

      // Fetch mess
      try {
        const messResponse = await axios.get(`${api}/mess/mess`);
        if (messResponse.data.success) {
          counts.mess = messResponse.data.mess?.length || 0;
        }
      } catch (error) {
        console.error('Error fetching mess:', error);
      }

      // Fetch commercials
      try {
        const commercialResponse = await axios.get(`${api}/commercials/commercial`);
        if (commercialResponse.data.success) {
          counts.commercials = commercialResponse.data.commercials?.length || 0;
        }
      } catch (error) {
        console.error('Error fetching commercials:', error);
      }

      // Calculate total
      const total = Object.values(counts).reduce((sum, count) => sum + count, 0);
      
      setPropertyCounts(counts);
      setTotalProperties(total);

    } catch (error) {
      console.error('Error fetching property counts:', error);
      toast.error('Failed to fetch property counts');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-50" suppressHydrationWarning={true}>
        <div className="text-center" suppressHydrationWarning={true}>
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-orange-500 mx-auto mb-4" suppressHydrationWarning={true}></div>
          <p className="text-gray-600">Loading properties...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen ml-72 bg-gray-50 p-6" suppressHydrationWarning={true}>
      <Toaster position="top-right" />
      
      {/* Header */}
      <div className="mb-8" suppressHydrationWarning={true}>
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Property Management</h1>
        <p className="text-gray-600">Manage all your property listings</p>
      </div>

      {/* Total Properties Overview */}
      <div className="bg-white rounded-lg shadow-sm p-6 mb-8 border border-gray-200" suppressHydrationWarning={true}>
        <div className="text-center">
          <h2 className="text-4xl font-bold text-orange-600 mb-2">{totalProperties.toLocaleString()}</h2>
          <p className="text-xl text-gray-700 font-medium">Total Properties</p>
        </div>
      </div>

      {/* Property Type Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6" suppressHydrationWarning={true}>
        {propertyTypes.map((property) => {
          const count = propertyCounts[property.id] || 0;
          const IconComponent = property.icon;
          
          return (
            <div 
              key={property.id}
              className="bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-all duration-300 overflow-hidden"
              suppressHydrationWarning={true}
            >
              {/* Header */}
              <div className="bg-orange-50 p-6 border-b border-orange-100" suppressHydrationWarning={true}>
                <div className="flex items-center justify-between mb-4" suppressHydrationWarning={true}>
                  <div className="p-3 bg-orange-500 rounded-lg shadow-sm" suppressHydrationWarning={true}>
                    <IconComponent className="text-2xl text-white" />
                  </div>
                  <div className="text-right">
                    <h3 className="text-2xl font-bold text-gray-800">{count}</h3>
                    <p className="text-sm text-gray-600 font-medium">Total</p>
                  </div>
                </div>
                <h4 className="text-xl font-semibold text-orange-600">
                  {property.name}
                </h4>
              </div>

              {/* Manage Button */}
              <div className="p-6" suppressHydrationWarning={true}>
                <button
                  onClick={() => router.push(property.route)}
                  className="w-full bg-orange-500 hover:bg-orange-600 text-white py-3 px-4 rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
                >
                  <FaCog className="text-sm" />
                  Manage {property.name}
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Refresh Button */}
      <div className="mt-8 text-center">
        <button
          onClick={fetchAllPropertyCounts}
          disabled={loading}
          className="bg-orange-500 hover:bg-orange-600 text-white py-3 px-6 rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 mx-auto"
        >
          {loading ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
              Refreshing...
            </>
          ) : (
            <>
              <FaCog className="text-sm" />
              Refresh Data
            </>
          )}
        </button>
      </div>
    </div>
  );
}
