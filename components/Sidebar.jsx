'use client'

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
  MdPerson
} from "react-icons/md";

export default function Sidebar() {
  const router = useRouter();
  const pathname = usePathname();

  const navItems = [
    { name: "Dashboard", path: "/master-admin", icon: MdDashboard },
    { name: "City", path: "/master-admin/city", icon: MdLocationCity },
    { name: "Listing", path: "/master-admin/listing", icon: MdBusiness },
    { name: "Booking", path: "/master-admin/booking", icon: MdBookmark },
    { name: "Users", path: "/master-admin/user", icon: MdPeople },
    { name: "Agent", path: "/master-admin/agent", icon: MdSupportAgent },
    { name: "Master Admin", path: "/master-admin/admin", icon: MdPerson }
  ];

  return (
    <div className="w-72 bg-white shadow-xl h-full fixed border-r border-gray-200" suppressHydrationWarning={true}>
      {/* Logo Section */}
      <div className="p-6 border-b border-gray-100" suppressHydrationWarning={true}>
        <div className="flex items-center space-x-3" suppressHydrationWarning={true}>
          <div className="w-10 h-10 bg-gradient-to-br from-red-500 to-orange-500 rounded-lg flex items-center justify-center shadow-lg" suppressHydrationWarning={true}>
            <MdHome className="text-white text-xl" />
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
      <nav className="mt-6 px-4">
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
      <div className="absolute bottom-4 left-4 right-4" suppressHydrationWarning={true}>
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
