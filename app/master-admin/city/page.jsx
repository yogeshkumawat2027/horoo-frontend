"use client";
import { useEffect, useState } from "react";
import axios from "axios";
import toast, { Toaster } from 'react-hot-toast';
import { 
  FaMapMarkerAlt, 
  FaCity, 
  FaBuilding, 
  FaPlus, 
  FaLocationArrow,
  FaGlobe
} from 'react-icons/fa';

export default function AddLocation() {
  const [stateName, setStateName] = useState("");
  const [states, setStates] = useState([]);

  const [cityName, setCityName] = useState("");
  const [selectedState, setSelectedState] = useState("");

  const [areaName, setAreaName] = useState("");
  const [cities, setCities] = useState([]);
  const [selectedCity, setSelectedCity] = useState("");
  const [areas, setAreas] = useState([]);
  const [allCities, setAllCities] = useState([]);

  // const api = "https://horoo-backend-latest.onrender.com/api";
  const api = process.env.NEXT_PUBLIC_API_URL;



  // Fetch all states
  const fetchStates = async () => {
    const res = await axios.get(`${api}/states`);
    if (res.data.success) setStates(res.data.states);
  };

  // Fetch cities for a state
  const fetchCities = async (stateId) => {
    const res = await axios.get(`${api}/cities/${stateId}`);
    if (res.data.success) setCities(res.data.cities);
  };

  // Fetch all cities
  const fetchAllCities = async () => {
    try {
      const res = await axios.get(`${api}/cities`);
      if (res.data.success) setAllCities(res.data.cities);
    } catch (error) {
      console.error("Error fetching cities:", error);
    }
  };

  // Fetch areas for a city
  const fetchAreas = async (cityId) => {
    try {
      const res = await axios.get(`${api}/areas/${cityId}`);
      if (res.data.success) setAreas(res.data.areas);
    } catch (error) {
      console.error("Error fetching areas:", error);
    }
  };

  // Fetch all areas
  const fetchAllAreas = async () => {
    try {
      const res = await axios.get(`${api}/areas`);
      if (res.data.success) setAreas(res.data.areas);
    } catch (error) {
      console.error("Error fetching areas:", error);
    }
  };

  useEffect(() => {
    fetchStates();
    fetchAllCities();
    fetchAllAreas();
  }, []);

  // Add State
  const handleAddState = async () => {
    if (!stateName) return toast.error("Please enter state name");
    
    try {
      const res = await axios.post(`${api}/state`, {
        name: stateName,
      });
      if (res.data.success) {
        toast.success("State added successfully!");
        setStateName("");
        fetchStates();
      }
    } catch (error) {
      toast.error("Failed to add state");
    }
  };

  // Add City
  const handleAddCity = async () => {
    if (!cityName || !selectedState) return toast.error("Please select state and enter city name");
    
    try {
      const res = await axios.post(`${api}/city`, {
        name: cityName,
        stateId: selectedState,
      });
      if (res.data.success) {
        toast.success("City added successfully!");
        setCityName("");
        fetchCities(selectedState);
        fetchAllCities(); // Refresh all cities
      }
    } catch (error) {
      toast.error("Failed to add city");
    }
  };

  // Add Area
  const handleAddArea = async () => {
    if (!areaName || !selectedCity) return toast.error("Please select city and enter area name");
    
    try {
      const res = await axios.post(`${api}/area`, {
        name: areaName,
        cityId: selectedCity,
      });
      if (res.data.success) {
        toast.success("Area added successfully!");
        setAreaName("");
        fetchAllAreas(); // Refresh all areas
      }
    } catch (error) {
      toast.error("Failed to add area");
    }
  };

  return (
    <div className="min-h-screen ml-72 bg-orange-50">
      <Toaster 
        position="top-right"
        toastOptions={{
          duration: 3000,
          style: {
            background: '#fb923c',
            color: 'white',
          },
          success: {
            style: {
              background: '#ea580c',
            },
          },
          error: {
            style: {
              background: '#dc2626',
            },
          },
        }}
      />
      <div className="max-w-5xl mx-auto p-6">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-orange-500 text-white rounded-full mb-4">
            <FaGlobe className="text-2xl" />
          </div>
          <h1 className="text-4xl font-bold text-gray-800 mb-2">Location Manager</h1>
          <p className="text-gray-600">Manage states, cities, and areas for Horoo platform</p>
        </div>

        <div className="grid gap-8 md:grid-cols-1 lg:grid-cols-3">
          {/* Add State */}
          <div className="bg-white rounded-2xl shadow-lg border border-orange-100 overflow-hidden transform transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
            <div className="bg-orange-500 text-white p-6">
              <div className="flex items-center">
                <FaMapMarkerAlt className="text-2xl mr-3" />
                <div>
                  <h2 className="text-xl font-semibold">Add State</h2>
                  <p className="text-orange-100 text-sm">Create new state</p>
                </div>
              </div>
            </div>
            <div className="p-6">
              <div className="relative mb-4">
                <input
                  className="w-full px-4 py-3 border-2 border-orange-200 rounded-lg focus:border-orange-500 focus:outline-none transition-colors duration-200"
                  placeholder="Enter state name"
                  value={stateName}
                  onChange={(e) => setStateName(e.target.value)}
                />
              </div>
              <button
                className="w-full bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 rounded-lg font-semibold transition-colors duration-200 flex items-center justify-center"
                onClick={handleAddState}
              >
                <FaPlus className="mr-2" />
                Add State
              </button>
            </div>
          </div>

          {/* Add City */}
          <div className="bg-white rounded-2xl shadow-lg border border-orange-100 overflow-hidden transform transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
            <div className="bg-orange-500 text-white p-6">
              <div className="flex items-center">
                <FaCity className="text-2xl mr-3" />
                <div>
                  <h2 className="text-xl font-semibold">Add City</h2>
                  <p className="text-orange-100 text-sm">Create new city</p>
                </div>
              </div>
            </div>
            <div className="p-6">
              <div className="relative mb-4">
                <select
                  className="w-full px-4 py-3 border-2 border-orange-200 rounded-lg focus:border-orange-500 focus:outline-none transition-colors duration-200 appearance-none bg-white"
                  value={selectedState}
                  onChange={(e) => {
                    setSelectedState(e.target.value);
                    fetchCities(e.target.value);
                  }}
                >
                  <option value="">Select State</option>
                  {states.map((s) => (
                    <option key={s._id} value={s._id}>
                      {s.name}
                    </option>
                  ))}
                </select>
                <FaLocationArrow className="absolute right-3 top-1/2 transform -translate-y-1/2 text-orange-400 pointer-events-none" />
              </div>
              <div className="relative mb-4">
                <input
                  className="w-full px-4 py-3 border-2 border-orange-200 rounded-lg focus:border-orange-500 focus:outline-none transition-colors duration-200"
                  placeholder="Enter city name"
                  value={cityName}
                  onChange={(e) => setCityName(e.target.value)}
                />
              </div>
              <button
                className="w-full bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 rounded-lg font-semibold transition-colors duration-200 flex items-center justify-center"
                onClick={handleAddCity}
              >
                <FaPlus className="mr-2" />
                Add City
              </button>
            </div>
          </div>

          {/* Add Area */}
          <div className="bg-white rounded-2xl shadow-lg border border-orange-100 overflow-hidden transform transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
            <div className="bg-orange-500 text-white p-6">
              <div className="flex items-center">
                <FaBuilding className="text-2xl mr-3" />
                <div>
                  <h2 className="text-xl font-semibold">Add Area</h2>
                  <p className="text-orange-100 text-sm">Create new area</p>
                </div>
              </div>
            </div>
            <div className="p-6">
              <div className="relative mb-4">
                <select
                  className="w-full px-4 py-3 border-2 border-orange-200 rounded-lg focus:border-orange-500 focus:outline-none transition-colors duration-200 appearance-none bg-white"
                  value={selectedCity}
                  onChange={(e) => setSelectedCity(e.target.value)}
                >
                  <option value="">Select City</option>
                  {cities.map((c) => (
                    <option key={c._id} value={c._id}>
                      {c.name}
                    </option>
                  ))}
                </select>
                <FaLocationArrow className="absolute right-3 top-1/2 transform -translate-y-1/2 text-orange-400 pointer-events-none" />
              </div>
              <div className="relative mb-4">
                <input
                  className="w-full px-4 py-3 border-2 border-orange-200 rounded-lg focus:border-orange-500 focus:outline-none transition-colors duration-200"
                  placeholder="Enter area name"
                  value={areaName}
                  onChange={(e) => setAreaName(e.target.value)}
                />
              </div>
              <button
                className="w-full bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 rounded-lg font-semibold transition-colors duration-200 flex items-center justify-center"
                onClick={handleAddArea}
              >
                <FaPlus className="mr-2" />
                Add Area
              </button>
            </div>
          </div>
        </div>

        {/* Stats Section */}
        <div className="mt-8 bg-white rounded-2xl shadow-lg border border-orange-100 p-6">
          <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
            <FaMapMarkerAlt className="text-orange-500 mr-3" />
            Quick Stats
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-4 bg-orange-50 rounded-lg">
              <div className="text-2xl font-bold text-orange-600">{states.length}</div>
              <div className="text-gray-600">States</div>
            </div>
            <div className="text-center p-4 bg-orange-50 rounded-lg">
              <div className="text-2xl font-bold text-orange-600">{allCities.length}</div>
              <div className="text-gray-600">Cities</div>
            </div>
            <div className="text-center p-4 bg-orange-50 rounded-lg">
              <div className="text-2xl font-bold text-orange-600">{areas.length}</div>
              <div className="text-gray-600">Areas</div>
            </div>
          </div>
        </div>

        {/* Cities and Areas Display Section */}
        <div className="mt-8 grid gap-8 md:grid-cols-1 lg:grid-cols-2">
          {/* All Cities */}
          <div className="bg-white rounded-2xl shadow-lg border border-orange-100 overflow-hidden">
            <div className="bg-orange-500 text-white p-6">
              <div className="flex items-center">
                <FaCity className="text-2xl mr-3" />
                <div>
                  <h3 className="text-xl font-semibold">All Cities</h3>
                  <p className="text-orange-100 text-sm">Total: {allCities.length} cities</p>
                </div>
              </div>
            </div>
            <div className="p-6 max-h-96 overflow-y-auto">
              {allCities.length > 0 ? (
                <div className="space-y-3">
                  {allCities.map((city) => (
                    <div key={city._id} className="flex items-center justify-between p-3 bg-orange-50 rounded-lg border border-orange-200">
                      <div className="flex items-center">
                        <FaMapMarkerAlt className="text-orange-500 mr-3" />
                        <div>
                          <div className="font-semibold text-gray-800">{city.name}</div>
                          <div className="text-sm text-gray-600">
                            {states.find(state => state._id === city.state)?.name || 'Unknown State'}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center text-gray-500 py-8">
                  <FaCity className="text-4xl mx-auto mb-4 text-gray-300" />
                  <p>No cities added yet</p>
                </div>
              )}
            </div>
          </div>

          {/* All Areas */}
          <div className="bg-white rounded-2xl shadow-lg border border-orange-100 overflow-hidden">
            <div className="bg-orange-500 text-white p-6">
              <div className="flex items-center">
                <FaBuilding className="text-2xl mr-3" />
                <div>
                  <h3 className="text-xl font-semibold">All Areas</h3>
                  <p className="text-orange-100 text-sm">Total: {areas.length} areas</p>
                </div>
              </div>
            </div>
            <div className="p-6 max-h-96 overflow-y-auto">
              {areas.length > 0 ? (
                <div className="space-y-3">
                  {areas.map((area) => (
                    <div key={area._id} className="flex items-center justify-between p-3 bg-orange-50 rounded-lg border border-orange-200">
                      <div className="flex items-center">
                        <FaBuilding className="text-orange-500 mr-3" />
                        <div>
                          <div className="font-semibold text-gray-800">{area.name}</div>
                          <div className="text-sm text-gray-600">
                            {allCities.find(city => city._id === area.city)?.name || 'Unknown City'}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center text-gray-500 py-8">
                  <FaBuilding className="text-4xl mx-auto mb-4 text-gray-300" />
                  <p>No areas added yet</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
