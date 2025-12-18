'use client'
import Image from 'next/image';
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { 
  MdDashboard, 
  MdLocationCity, 
  MdBusiness, 
  MdBookmark, 
  MdPeople,
  MdHome,
  MdSupportAgent, 
  MdPerson,
  MdLogout
} from "react-icons/md";
import { CiSquareQuestion } from "react-icons/ci";
import { FaClipboardList } from "react-icons/fa";

export default function Sidebar({ logout, adminData }) {
  const router = useRouter();
  const pathname = usePathname();

  const navItems = [
    { name: "Dashboard", path: "/master-admin", icon: MdDashboard },
    { name: "City", path: "/master-admin/city", icon: MdLocationCity },
    { name: "Listing", path: "/master-admin/listing", icon: MdBusiness },
    { name: "Booking", path: "/master-admin/booking", icon: MdBookmark },
    { name: "Requests", path: "/master-admin/requests", icon: CiSquareQuestion },
    { name: "Listing Requests", path: "/master-admin/listingrequest", icon: FaClipboardList },
    { name: "Users", path: "/master-admin/user", icon: MdPeople },
    { name: "Agent", path: "/master-admin/agent", icon: MdSupportAgent },
    { name: "Master Admin", path: "/master-admin/admin", icon: MdPerson }
  ];

  return (
    <div className="w-72 bg-white shadow-xl h-screen fixed border-r border-gray-200 flex flex-col" suppressHydrationWarning={true}>
      {/* Logo Section */}
      <div className="p-6 border-b border-gray-100 flex-shrink-0" suppressHydrationWarning={true}>
        <div className="flex items-center space-x-3" suppressHydrationWarning={true}>
          <div className="w-10 h-10 rounded-lg overflow-hidden border-2 border-red-500 shadow-lg" suppressHydrationWarning={true}>
            <Image 
              src="/logo/logo.jpg"
              alt="Horoo Logo"
              width={40}
              height={40}
              className="w-full h-full object-cover"
            />
          </div>
          <div suppressHydrationWarning={true}>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-red-500 to-orange-500 bg-clip-text text-transparent">
              Horoo
            </h1>
            <p className="text-sm text-gray-500">Admin Panel</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto mt-6 px-4 pb-4">
        <ul className="space-y-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.path;
            
            return (
              <li key={item.path}>
                <Link href={item.path}>
                  <div
                    className={`flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200 cursor-pointer group ${
                      isActive 
                        ? "bg-gradient-to-r from-red-50 to-orange-50 border-l-4 border-red-500 text-red-700 shadow-sm" 
                        : "hover:bg-gray-50 hover:translate-x-1 text-gray-600"
                    }`}
                    suppressHydrationWarning={true}
                  >
                    <Icon 
                      className={`text-xl ${
                        isActive ? "text-red-500" : "text-gray-400 group-hover:text-orange-500"
                      }`} 
                    />
                    <span className={`font-medium ${isActive ? "font-semibold" : ""}`}>
                      {item.name}
                    </span>
                  </div>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Bottom Section */}
      <div className="flex-shrink-0 p-4 border-t border-gray-100" suppressHydrationWarning={true}>
        {/* Admin Info */}
        {adminData && (
          <div className="bg-orange-50 rounded-xl p-3 border border-orange-200 mb-3" suppressHydrationWarning={true}>
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center">
                <MdPerson className="text-white text-sm" />
              </div>
              <div>
                <h3 className="font-semibold text-orange-800 text-sm">{adminData.name}</h3>
                <p className="text-orange-600 text-xs">@{adminData.username}</p>
              </div>
            </div>
          </div>
        )}
        
        {/* Logout Button */}
        <button
          onClick={logout}
          className="w-full flex items-center space-x-2 px-4 py-3 bg-red-500 text-white rounded-xl hover:bg-red-600 transition-colors mb-3"
        >
          <MdLogout className="text-lg" />
          <span className="font-medium">Logout</span>
        </button>

        <div className="bg-gradient-to-r from-red-50 to-orange-50 rounded-xl p-4 border border-red-100" suppressHydrationWarning={true}>
          <h3 className="font-semibold text-red-800 text-sm">Need Help?</h3>
          <p className="text-red-600 text-xs mt-1">Contact support team</p>
          <button className="mt-2 text-xs bg-red-500 text-white px-3 py-1 rounded-lg hover:bg-red-600 transition-colors">
            Contact Us
          </button>
        </div>
      </div>
    </div>
  );
}
