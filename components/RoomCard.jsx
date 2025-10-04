
import { useState, useEffect } from "react";
import { FaEdit,FaRegEye, FaTrash, FaHome, FaUser, FaMapMarkerAlt, FaDollarSign, FaCog, FaBed } from 'react-icons/fa';
import { CiEdit } from "react-icons/ci";
import { MdDelete } from "react-icons/md";
import axios from "axios";

export default function RoomCard({ room, api, handleView, handleEdit, handleDelete }) {
	// Use populated location data if available, otherwise fallback to API call
	const [locationNames, setLocationNames] = useState({ 
		state: room.state?.name || '', 
		city: room.city?.name || '', 
		area: room.area?.name || '' 
	});

	useEffect(() => {
		// Only fetch if location data is not already populated
		if (!room.state?.name || !room.city?.name || !room.area?.name) {
			const fetchLocationNames = async () => {
				try {
					const res = await axios.get(`${api}/location-details?state=${room.state}&city=${room.city}&area=${room.area}`);
					setLocationNames(res.data);
				} catch (err) {
					setLocationNames({ state: 'N/A', city: 'N/A', area: 'N/A' });
				}
			};
			fetchLocationNames();
		}
	}, [room.state, room.city, room.area, api]);

	return (
		<div className="rounded-2xl border border-gray-200 shadow-lg bg-white flex flex-col overflow-hidden transition-transform hover:-translate-y-1 hover:shadow-xl font-sans">
			{/* Main Image */}
							{room.mainImage ? (
								<img src={room.mainImage} alt="Main" className="w-full h-44 object-cover bg-gray-100 rounded-t-2xl" />
							) : (
								<div className="w-full h-44 bg-gray-100 flex items-center justify-center text-gray-300 rounded-t-2xl">
									<FaBed className="text-4xl" />
								</div>
							)}
			<div className="p-4 flex flex-col flex-1 justify-between">
								<div>
									<div className="flex items-center justify-between mb-2">
										<span className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded font-semibold tracking-wide">{room.horooId}</span>
										<span className={`text-xs px-2 py-1 rounded font-semibold ${room.isVerified ? 'bg-green-50 text-green-700' : 'bg-yellow-50 text-yellow-700'}`}>{room.isVerified ? 'Verified' : 'Pending'}</span>
									</div>
									<h2 className="text-lg font-bold text-gray-900 mb-1 tracking-tight font-sans truncate">{room.horooName || room.propertyName}</h2>
									<div className="text-sm text-gray-600 mb-1">Owner: <span className="font-semibold text-gray-900">{room.ownerName}</span></div>
									<div className="text-sm text-gray-600 mb-1">Location: <span className="font-semibold text-gray-900">{locationNames.state}</span> / <span className="font-semibold text-gray-900">{locationNames.city}</span> / <span className="font-semibold text-gray-900">{locationNames.area}</span></div>
									{room.nearbyAreas && room.nearbyAreas.length > 0 && (
										<div className="text-sm text-gray-600 mb-1">Nearby: <span className="font-semibold text-gray-900">{room.nearbyAreas.join(', ')}</span></div>
									)}
									<div className="flex items-center gap-4 mb-2 mt-2">
										<div className="text-sm text-black font-bold bg-gray-50 px-2 py-1 rounded">Horoo Price: ₹{room.horooPrice}</div>
										<div className="text-sm text-gray-700 font-bold bg-gray-50 px-2 py-1 rounded">Owner Price: ₹{room.ownerPrice}</div>
									</div>
									{room.pricePlans && room.pricePlans.length > 0 && (
										<div className="text-sm text-gray-600 mb-1">Plans: <span className="font-semibold text-gray-900">{room.pricePlans.join(', ')}</span></div>
									)}
								</div>
								<div className="flex justify-between gap-2 mt-4">
									<button
										onClick={() => handleView(room._id)}
										className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2.5 rounded-lg font-semibold text-xs shadow-md hover:shadow-lg transform hover:scale-105 transition-all duration-200 border border-blue-700"
									>
										<FaRegEye className="text-sm" />
										<span>View</span>
									</button>
									<button
										onClick={() => handleEdit(room._id)}
										className="flex items-center justify-center gap-2 bg-orange-500 hover:bg-orange-600 text-white px-4 py-2.5 rounded-lg font-semibold text-xs shadow-md hover:shadow-lg transform hover:scale-105 transition-all duration-200 border border-orange-600"
									>
										<CiEdit className="text-sm" />	
										<span>Edit</span>
									</button>
									<button
										onClick={() => handleDelete(room._id)}
										className="flex items-center justify-center gap-2 bg-red-500 hover:bg-red-600 text-white px-4 py-2.5 rounded-lg font-semibold text-xs shadow-md hover:shadow-lg transform hover:scale-105 transition-all duration-200 border border-red-600"
									>
										<MdDelete className="text-sm" />
										<span>Delete</span>
									</button>
								</div>
			</div>
		</div>
	);
}
