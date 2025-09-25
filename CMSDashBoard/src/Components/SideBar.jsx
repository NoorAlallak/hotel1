// components/Sidebar.js
import React from "react";
import { useAuth } from "../Context/AuthContext";
import { useLanguage } from "../Context/LanguageContext";

const Sidebar = ({ activePage, setActivePage }) => {
  const { user, logout } = useAuth();
  const { t } = useLanguage();

  const menuItems = [
    { id: "dashboard", icon: "fas fa-tachometer-alt", label: t("dashboard") },
    { id: "hotels", icon: "fas fa-hotel", label: t("hotels") },
    { id: "rooms", icon: "fas fa-bed", label: t("rooms") },
    { id: "bookings", icon: "fas fa-calendar-check", label: t("bookings") },
    { id: "coupons", icon: "fas fa-tag", label: t("coupons") },
    { id: "media", icon: "fas fa-images", label: t("media") },
  ];

  if (user?.role === "admin") {
    menuItems.push({ id: "users", icon: "fas fa-users", label: t("users") });
  }

  return (
    <div className="bg-gray-800 text-white w-64 space-y-6 py-7 px-2 absolute inset-y-0 left-0 transform -translate-x-full md:relative md:translate-x-0 transition duration-200 ease-in-out">
      <div className="text-white flex items-center space-x-2 px-4">
        <i className="fas fa-hotel text-2xl"></i>
        <span className="text-2xl font-extrabold">HotelCMS</span>
      </div>

      <nav>
        {menuItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setActivePage(item.id)}
            className={`w-full flex items-center space-x-2 py-2.5 px-4 rounded transition duration-200 ${
              activePage === item.id
                ? "bg-blue-500 text-white"
                : "hover:bg-gray-700"
            }`}
          >
            <i className={item.icon}></i>
            <span>{item.label}</span>
          </button>
        ))}
      </nav>

      <div className="absolute bottom-0 w-full left-0 p-4 border-t border-gray-700">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center">
              <i className="fas fa-user text-white"></i>
            </div>
            <div>
              <p className="text-sm font-medium">{user?.name}</p>
              <p className="text-xs text-gray-400">{user?.role}</p>
            </div>
          </div>
          <button
            onClick={logout}
            className="p-2 rounded-full hover:bg-gray-700"
            title={t("logout")}
          >
            <i className="fas fa-sign-out-alt"></i>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
