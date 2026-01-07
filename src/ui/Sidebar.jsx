import {
  AdjustmentsHorizontalIcon,
  ArrowLeftCircleIcon,
  ArrowLeftEndOnRectangleIcon,
  ArrowPathIcon,
  BuildingStorefrontIcon,
  CalendarDateRangeIcon,
  ChartBarIcon,
  ChatBubbleLeftRightIcon,
  ChevronDownIcon,
  ChevronRightIcon,
  CodeBracketIcon,
  Cog6ToothIcon,
  CommandLineIcon,
  CurrencyDollarIcon,
  DevicePhoneMobileIcon,
  DocumentChartBarIcon,
  LockClosedIcon,
  MinusCircleIcon,
  ServerIcon,
  TagIcon,
  TicketIcon,
  TrophyIcon,
  UserGroupIcon,
  UsersIcon,
} from "@heroicons/react/24/outline";
import { useEffect, useRef, useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

const Sidebar = ({ sidebarOpen, setSidebarOpen }) => {
  const { useGetCurrentUser } = useAuth();
  const { data: user } = useGetCurrentUser();

  const location = useLocation();
  const { pathname } = location;
  const { useLogout } = useAuth();
  const logoutMutation = useLogout();

  const trigger = useRef(null);
  const sidebar = useRef(null);

  const storedSidebarExpanded = localStorage.getItem("sidebar-expanded");
  const [sidebarExpanded, setSidebarExpanded] = useState(
    storedSidebarExpanded === null ? false : storedSidebarExpanded === "true"
  );

  const [expandedNav, setExpandedNav] = useState(null);

  useEffect(() => {
    localStorage.setItem("sidebar-expanded", sidebarExpanded.toString());
  }, [sidebarExpanded]);

  const toggleNav = (label) => {
    setExpandedNav(expandedNav === label ? null : label);
  };
  const hasPermission = (permission) => {
    return user?.data?.role?.permissions?.includes(permission);
  };

  const hasAnyPermission = (permissions = []) => {
    if (!permissions.length) return true;
    return permissions.some((perm) => hasPermission(perm));
  };

  const navItems = [
    {
      label: "Dashboard",
      path: "/dashboard",
      icon: ChartBarIcon,
      permissions: [], // Accessible to all authenticated users
    },
    {
      label: "Transactions",
      path: "/transactions",
      icon: ArrowPathIcon,
      permissions: ["VIEW_POINTS_HISTORY"],
    },
    {
      label: "Points Configuration",
      type: "dropdown",
      icon: CurrencyDollarIcon,
      permissions: ["MANAGE_POINTS", "MANAGE_CRITERIA", "VIEW_POINTS_HISTORY"],
      subItems: [
        {
          label: "Points Criteria",
          path: "/points-criteria",
          icon: CurrencyDollarIcon,
          permissions: ["MANAGE_CRITERIA"],
        },
        {
          label: "Rules & Expiry",
          path: "/rules",
          icon: Cog6ToothIcon,
          permissions: ["MANAGE_POINTS"],
        },
        {
          label: "Tiers",
          path: "/tiers",
          icon: TrophyIcon,
          permissions: ["VIEW_TIERS", "MANAGE_TIERS"],
        },
        {
          label: "Tier Eligibility",
          path: "/tier-eligibility",
          icon: AdjustmentsHorizontalIcon,
          permissions: ["ASSIGN_TIERS"],
        },
      ],
    },
    {
      label: "Manual Point Adjustment",
      type: "dropdown",
      icon: AdjustmentsHorizontalIcon,
      permissions: ["ADJUST_POINTS"],
      subItems: [
        {
          label: "Add Points",
          path: "/add-points",
          icon: DocumentChartBarIcon,
          permissions: ["ADJUST_POINTS"],
        },
        {
          label: "Reduce Points",
          path: "/reduce-points",
          icon: MinusCircleIcon,
          permissions: ["ADJUST_POINTS"],
        },
      ],
    },
    {
      label: "Customer Management",
      type: "dropdown",
      icon: UserGroupIcon,
      permissions: ["VIEW_CUSTOMERS", "EDIT_CUSTOMERS"],
      subItems: [
        {
          label: "Customers",
          path: "/customers",
          icon: UsersIcon,
          permissions: ["VIEW_CUSTOMERS"],
        },
        {
          label: "Priority Customers",
          path: "/priority-customers",
          icon: TrophyIcon,
          permissions: ["MANAGE_PRIORITY_CUSTOMERS"],
        },
      ],
    },
    {
      label: "Reference Data",
      type: "dropdown",
      icon: Cog6ToothIcon,
      permissions: ["CREATE_OFFERS", "EDIT_OFFERS"],
      subItems: [
        {
          label: "Categories",
          path: "/categories",
          icon: TagIcon,
          permissions: ["CREATE_OFFERS"],
        },
        {
          label: "Brands",
          path: "/brands",
          icon: BuildingStorefrontIcon,
          permissions: ["CREATE_OFFERS"],
        },
        {
          label: "Apps",
          path: "/apps",
          icon: DevicePhoneMobileIcon,
          permissions: ["CREATE_OFFERS"],
        },
        {
          label: "Service Providers",
          path: "/trigger-services",
          icon: ServerIcon,
          permissions: ["CREATE_OFFERS"],
        },
        {
          label: "Trigger Events",
          path: "/trigger-events",
          icon: CalendarDateRangeIcon,
          permissions: ["CREATE_OFFERS"],
        },
        {
          label: "Payment Methods",
          path: "/payment-methods",
          icon: CalendarDateRangeIcon,
          permissions: ["CREATE_OFFERS"],
        },
      ],
    },
    {
      label: "Offers & Promotions",
      type: "dropdown",
      icon: TagIcon,
      permissions: ["CREATE_OFFERS", "EDIT_OFFERS"],
      subItems: [
        {
          label: "Khedmah Offers",
          path: "/khedma-offers",
          icon: TicketIcon,
          permissions: ["CREATE_OFFERS"],
        },
        {
          label: "Merchant Offers",
          path: "/merchant-offers",
          icon: TicketIcon,
          permissions: ["CREATE_OFFERS"],
        },
      ],
    },
    {
      label: "System & Settings",
      type: "dropdown",
      icon: Cog6ToothIcon,
      permissions: ["MANAGE_ADMINS", "MANAGE_ROLES"],
      subItems: [
        {
          label: "Users",
          path: "/users",
          icon: UsersIcon,
          permissions: ["MANAGE_ADMINS"],
        },
        {
          label: "Role & Accesses",
          path: "/role",
          icon: LockClosedIcon,
          permissions: ["MANAGE_ROLES"],
        },
      ],
    },
    {
      label: "Account Security",
      path: "/change-password",
      icon: LockClosedIcon,
      permissions: [],
    },
    {
      label: "Audit",
      type: "dropdown",
      icon: AdjustmentsHorizontalIcon,
      permissions: ["VIEW_AUDIT_LOGS"],
      subItems: [
        {
          label: "Admin-System Logs",
          path: "/system-logs",
          icon: CodeBracketIcon,
          permissions: ["VIEW_AUDIT_LOGS"],
        },
        {
          label: "User-API Logs",
          path: "/api-logs",
          icon: CommandLineIcon,
          permissions: ["VIEW_AUDIT_LOGS"],
        },
        {
          label: "Authentication-Logs",
          path: "/auth-logs",
          icon: CommandLineIcon,
          permissions: ["VIEW_AUDIT_LOGS"],
        },
      ],
    },
    {
      label: "Reports",
      type: "dropdown",
      icon: DocumentChartBarIcon,
      permissions: ["VIEW_REPORTS"],
      subItems: [
        {
          label: "Summary Report",
          path: "/summary-reports",
          icon: DocumentChartBarIcon,
          permissions: ["VIEW_REPORTS"],
        },
        {
          label: "Transaction Report",
          path: "/transaction-reports",
          icon: DocumentChartBarIcon,
          permissions: ["VIEW_REPORTS"],
        },
      ],
    },
  ];

  return (
    <aside
      ref={sidebar}
      className={`absolute left-0 top-0 z-9999 flex h-screen w-62.5 flex-col overflow-y-hidden bg-[#2B5C3F] duration-300 ease-linear lg:static lg:translate-x-0 ${
        sidebarOpen ? "translate-x-0" : "-translate-x-full"
      }`}
    >
      <div className="flex items-center justify-between px-6 py-5.5">
        <NavLink to="/dashboard" className="text-xl font-semibold text-white">
          Khedmah Loyalty
        </NavLink>
        <button
          ref={trigger}
          onClick={() => setSidebarOpen(!sidebarOpen)}
          aria-controls="sidebar"
          aria-expanded={sidebarOpen}
          className="block lg:hidden"
        >
          <ArrowLeftCircleIcon className="h-5 w-5 text-white" />
        </button>
      </div>
      <nav className="flex-1 overflow-y-auto py-4">
        {navItems
          .filter((item) => hasAnyPermission(item.permissions ?? []))
          .map((item) =>
            item.type === "dropdown" ? (
              <div key={item.label}>
                <button
                  onClick={() => toggleNav(item.label)}
                  className={`w-full flex items-center justify-between px-4 py-3 text-sm font-medium transition-all duration-200 ${
                    item.subItems.some(
                      (subItem) =>
                        (subItem.path && pathname === subItem.path) ||
                        (subItem.type === "nested" &&
                          subItem.subItems?.some(
                            (nestedItem) => pathname === nestedItem.path
                          ))
                    )
                      ? "text-white bg-green-700/90"
                      : "text-gray-300 hover:bg-green-700/50 hover:text-white"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <item.icon className="w-5 h-5" />
                    {item.label}
                  </div>
                  {expandedNav === item.label ? (
                    <ChevronDownIcon className="w-4 h-4" />
                  ) : (
                    <ChevronRightIcon className="w-4 h-4" />
                  )}
                </button>

                {expandedNav === item.label && (
                  <div className="ml-4 mt-2 space-y-1 mr-2">
                    {item.subItems
                      .filter((subItem) =>
                        hasAnyPermission(subItem.permissions ?? [])
                      )
                      .map((subItem) =>
                        subItem.type === "nested" ? (
                          <div key={subItem.label}>
                            <button
                              onClick={() => toggleNav(subItem.label)}
                              className={`w-full flex items-center justify-between px-4 py-2 text-sm font-medium rounded-lg ${
                                subItem.subItems?.some(
                                  (nestedItem) => pathname === nestedItem.path
                                )
                                  ? "text-white bg-green-800"
                                  : "text-gray-200 hover:bg-green-700/30 hover:text-white"
                              }`}
                            >
                              <div className="flex items-center gap-3">
                                {subItem.icon && (
                                  <subItem.icon className="w-4 h-4" />
                                )}
                                {subItem.label}
                              </div>
                              {expandedNav === subItem.label ? (
                                <ChevronDownIcon className="w-3 h-3" />
                              ) : (
                                <ChevronRightIcon className="w-3 h-3" />
                              )}
                            </button>
                            {expandedNav === subItem.label && (
                              <div className="ml-4 mt-1 space-y-1">
                                {subItem.subItems
                                  ?.filter((nestedItem) =>
                                    hasAnyPermission(
                                      nestedItem.permissions ?? []
                                    )
                                  )
                                  .map((nestedItem) => (
                                    <NavLink
                                      key={nestedItem.path}
                                      to={nestedItem.path}
                                      className={`flex items-center gap-3 px-4 py-2 text-xs font-medium rounded-lg ${
                                        pathname.startsWith(nestedItem.path)
                                          ? "text-white bg-green-900"
                                          : "text-gray-300 hover:bg-green-800/50 hover:text-white"
                                      }`}
                                    >
                                      {nestedItem.icon && (
                                        <nestedItem.icon className="w-3 h-3" />
                                      )}
                                      {nestedItem.label}
                                    </NavLink>
                                  ))}
                              </div>
                            )}
                          </div>
                        ) : (
                          <NavLink
                            key={subItem.path}
                            to={subItem.path}
                            className={`flex items-center gap-3 px-4 py-2 text-sm font-medium rounded-lg ${
                              pathname.startsWith(subItem.path)
                                ? "text-white bg-green-800"
                                : "text-gray-200 hover:bg-green-700/30 hover:text-white"
                            }`}
                          >
                            {subItem.icon && (
                              <subItem.icon className="w-4 h-4" />
                            )}
                            {subItem.label}
                          </NavLink>
                        )
                      )}
                  </div>
                )}
              </div>
            ) : (
              <NavLink
                key={item.path}
                to={item.path}
                className={`flex items-center px-4 py-3 text-sm font-medium transition-all duration-200 ${
                  pathname.startsWith(item.path)
                    ? "text-white bg-green-700/90 "
                    : "text-gray-300 hover:bg-green-700/50 hover:text-white"
                }`}
              >
                <item.icon className="w-5 h-5" />
                <span className="ml-3">{item.label}</span>
              </NavLink>
            )
          )}
      </nav>

      <div className="mt-auto flex justify-center py-4 w-full">
        <button
          className="text-sm font-medium hover:bg-green-700/50 hover:text-white text-white w-full px-4 py-2 flex items-center gap-2 justify-center"
          onClick={() => logoutMutation.mutate()}
        >
          <ArrowLeftEndOnRectangleIcon className="w-5 h-5" /> Logout
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
