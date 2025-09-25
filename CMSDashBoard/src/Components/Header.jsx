import React from "react";
import { useLanguage } from "../Context/LanguageContext";
import { useAuth } from "../Context/AuthContext";
const Header = () => {
  const { language, toggleLanguage, t } = useLanguage();
  const { logout } = useAuth();
  return (
    <header className="bg-white shadow-sm z-10">
      <div className="flex items-center justify-between h-16 px-6">
        <div className="flex items-center">
          <button className="md:hidden rounded-md p-2 text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none">
            <i className="fas fa-bars"></i>
          </button>
          <h1 className="ml-2 text-xl font-semibold text-gray-800">
            {t("dashboard")}
          </h1>
        </div>
        <div>
          <button
            onClick={logout}
            className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition"
          >
            {t("logout")}
          </button>
        </div>
        <div className="flex items-center space-x-4">
          <button
            onClick={toggleLanguage}
            className="p-2 rounded-full hover:bg-gray-100"
            title={
              language === "en" ? "Switch to Arabic" : "التغيير إلى الإنجليزية"
            }
          >
            {language === "en" ? "عربي" : "EN"}
          </button>

          <button className="p-2 rounded-full hover:bg-gray-100 relative">
            <i className="fas fa-bell text-gray-600"></i>
            <span className="absolute top-0 right-0 h-2 w-2 rounded-full bg-red-500"></span>
          </button>

          <div className="relative">
            <button className="flex items-center space-x-2 p-2 rounded-full hover:bg-gray-100">
              <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center">
                <i className="fas fa-user text-white"></i>
              </div>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
