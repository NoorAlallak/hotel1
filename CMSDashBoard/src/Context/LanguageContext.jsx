// context/LanguageContext.js
import React, { createContext, useContext, useState } from "react";
import SeasonalPrices from "../Pages/SeasonalPrices";

const LanguageContext = createContext();

// eslint-disable-next-line react-refresh/only-export-components
export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
};

export const LanguageProvider = ({ children }) => {
  const [language, setLanguage] = useState("en");

  const toggleLanguage = () => {
    setLanguage((prev) => (prev === "en" ? "ar" : "en"));
  };

  const direction = language === "ar" ? "rtl" : "ltr";

  const translations = {
    en: {
      dashboard: "Dashboard",
      hotels: "Hotels",
      rooms: "Rooms",
      bookings: "Bookings",
      coupons: "Coupons",
      media: "Media Library",
      users: "Users",
      login: "Login",
      logout: "Logout",
      todayBookings: "Today's Bookings",
      occupancyRate: "Occupancy Rate",
      revenue: "Revenue",
      recentActions: "Recent Actions",
      addNew: "Add New",
      edit: "Edit",
      delete: "Delete",
      save: "Save",
      cancel: "Cancel",
      search: "Search",
      filter: "Filter",
      export: "Export",
      seasonalPrices: "Seasonal Prices",
      // Add more translations as needed
    },
    ar: {
      dashboard: "لوحة التحكم",
      hotels: "الفنادق",
      rooms: "الغرف",
      bookings: "الحجوزات",
      coupons: "الكوبونات",
      media: "مكتبة الوسائط",
      users: "المستخدمين",
      login: "تسجيل الدخول",
      logout: "تسجيل الخروج",
      todayBookings: "حجوزات اليوم",
      occupancyRate: "معدل الإشغال",
      revenue: "الإيرادات",
      recentActions: "الإجراءات الأخيرة",
      addNew: "إضافة جديد",
      edit: "تعديل",
      delete: "حذف",
      save: "حفظ",
      cancel: "إلغاء",
      search: "بحث",
      filter: "تصفية",
      export: "تصدير",
      seasonalPrices: "أسعار موسمية",
    },
  };

  const t = (key) => translations[language][key] || key;

  const value = {
    language,
    toggleLanguage,
    direction,
    t,
  };

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
};
