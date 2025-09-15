import { useState, useEffect } from "react";
import { HomeIcon, ClockIcon, TagIcon } from "@heroicons/react/24/outline";
import {
  HomeIcon as HomeSolidIcon,
  ClockIcon as ClockSolidIcon,
  TagIcon as TagSolidIcon,
  Squares2X2Icon,
  Squares2X2Icon as Squares2X2SolidIcon,
} from "@heroicons/react/24/solid";
import { useNavigate, useLocation } from "react-router-dom";
import { useCustomerAuth } from "../../hooks/useCustomerAuth";
import PropTypes from "prop-types";

const ArabicLayout = ({ children, currentPage = "home" }) => {
  const [activePage, setActivePage] = useState(currentPage);
  const [tierColor, setTierColor] = useState("#DF9872"); // Bronze default
  const [loading, setLoading] = useState(true); // initial loading state

  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated, customerID, apiKey, customerData, name } =
    useCustomerAuth();

  // Simulate loading delay (2 sec)
  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1000);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (customerData) {
      const tier = customerData?.customer_tier?.en;
      switch (tier) {
        case "Bronze":
          setTierColor("#DF9872");
          break;
        case "Silver":
          setTierColor("#C0C0C0");
          break;
        case "Gold":
          setTierColor("#FFD700");
          break;
        default:
          setTierColor("#DF9872");
      }
    }
  }, [customerData]);

  // Detect current page
  useEffect(() => {
    const path = location.pathname;
    if (path.includes("dashboard")) setActivePage("home");
    else if (path.includes("history")) setActivePage("history");
    else if (path.includes("offers")) setActivePage("offers");
    else if (path.includes("support")) setActivePage("support");
  }, [location.pathname]);

  const navigationItems = [
    {
      id: "home",
      label: "الرئيسية",
      icon: HomeIcon,
      activeIcon: HomeSolidIcon,
      href: "/user/dashboard/ar",
    },
    {
      id: "history",
      label: "السجل",
      icon: ClockIcon,
      activeIcon: ClockSolidIcon,
      href: "/user/history/ar",
    },
    {
      id: "categories",
      label: "الفئات",
      icon: Squares2X2Icon,
      activeIcon: Squares2X2SolidIcon,
      href: "/user/categories/ar",
    },
    {
      id: "offers",
      label: "العروض",
      icon: TagIcon,
      activeIcon: TagSolidIcon,
      href: "/user/offers/ar",
    },
  ];

  const handleNavigation = (item) => {
    if (!isAuthenticated) {
      console.warn("محاولة التنقل بدون تسجيل الدخول");
      return;
    }

    setActivePage(item.id);

    const searchParams = new URLSearchParams();
    if (customerID && apiKey) {
      searchParams.set("customerID", customerID);
      searchParams.set("apiKey", apiKey);
    }
    if (name) {
      searchParams.set("name", name);
    }
    const url = searchParams.toString()
      ? `${item.href}?${searchParams.toString()}`
      : item.href;

    navigate(url);
  };

  // Show spinner while loading or if not authenticated
  if (loading || !isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-black-500"></div>
      </div>
    );
  }
  if (!customerData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <h1 className="text-2xl font-semibold text-gray-800">
          ٤٠٤ – لم يتم العثور على العميل
        </h1>
      </div>
    );
  }
  return (
    <div className="min-h-screen bg-gray-50 pb-20 alexandria-text">
      <main className="min-h-screen">{children}</main>
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-4 py-2 z-50">
        <div
          className="flex items-center justify-around max-w-md mx-auto"
          dir="rtl"
        >
          {navigationItems.map((item) => {
            const isActive = activePage === item.id;
            const IconComponent = isActive ? item.activeIcon : item.icon;

            return (
              <button
                key={item.id}
                onClick={() => handleNavigation(item)}
                className={`flex flex-col items-center space-y-1 py-2 px-3 rounded-lg transition-colors ${
                  isActive
                    ? "font-semibold"
                    : "text-gray-500 hover:text-gray-700"
                }`}
                style={isActive ? { color: tierColor } : {}}
              >
                <IconComponent className="w-6 h-6" />
                <span className="text-xs font-medium">{item.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

ArabicLayout.propTypes = {
  children: PropTypes.node.isRequired,
  currentPage: PropTypes.string,
};

export default ArabicLayout;
