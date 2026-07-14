import { createBrowserRouter, Outlet } from "react-router-dom";
import Layout from "../ui/Layout";
import PointsCriteria from "../pages/points-management/PointsCriteria";
import Tiers from "../pages/points-management/Tiers";
import AddPoints from "../pages/points-management/AddPoints";
import ReducePoints from "../pages/points-management/ReducePoints";
import LoginPage from "../pages/LoginPage";
import Customer from "../pages/customer-management/Customer";
import CustomerDetails from "../pages/customer-management/CustomerDetails";
import Dashboard from "../pages/Dashboard";
import Transactions from "../pages/points-management/Transactions";
import Users from "../pages/system-and-settings/Users";
import Privacy from "../pages/system-and-settings/Privacy";
import Role from "../pages/system-and-settings/Role";
import MerchantOfters from "../pages/ofters-and-promotions/MerchantOfters";
import ApiLogs from "../pages/audit/ApiLogs";
import Apps from "../pages/reference-data/Apps";
import Brands from "../pages/reference-data/Brands";
import Categories from "../pages/reference-data/Categories";
import Rules from "../pages/points-management/Rules";
import TierEligibility from "../pages/points-management/TierEligibility";
import SummaryReport from "../pages/reports/SummaryReport";
import TransactionReport from "../pages/reports/TransactionReport";
import OfferSummaryReport from "../pages/reports/OfferSummaryReport";
import Theme from "../pages/system-and-settings/Theme";
import { AuthProvider } from "../ui/AuthProvider";
import TriggerEvents from "../pages/reference-data/TriggerEvents";
import TriggerServices from "../pages/reference-data/TriggerServices";
import AuthLogs from "../pages/audit/AuthLogs";
import Support from "../pages/customer-management/Support";
import PriorityCustomers from "../pages/customer-management/PriorityCustomers";
import KhedmahOffer from "../pages/ofters-and-promotions/KhedmahOffer";
import SdkAccess from "../pages/system-and-settings/SdkAccess";
import Focus9Integration from "../pages/system-and-settings/Focus9Integration";
import PaymentMethods from "../pages/reference-data/PaymentMethods";
import ChangePassword from "../pages/system-and-settings/ChangePassword";
import {
  UserDashboard,
  PointsHistory,
  CouponDetails,
  UserProfile,
  UserLayout,
} from "../pages/user-facing-pages";
import DemoPage from "../pages/user-facing-pages/DemoPage";
import DashboardUser from "../pages/user-facing-pages/DashboardUser";
import UserOffers from "../pages/user-facing-pages/UserOffers";
import UserSupport from "../pages/user-facing-pages/UserSupport";
import AuthDemo from "../pages/user-facing-pages/AuthDemo";
import ScrollToTop from "../ui/ScrollToTop";
import UserBrands from "../pages/user-facing-pages/UserBrands";
import UserCategories from "../pages/user-facing-pages/UserCategories";
import Terms from "../pages/user-facing-pages/Terms";
import ArabicDashboard from "../pages/user-facing-pages/ArabicDashboard";
import ArabicLayout from "../pages/user-facing-pages/ArabicLayout";
import ArabicPointsHistory from "../pages/user-facing-pages/ArabicPointHistory";
import ArabicBrands from "../pages/user-facing-pages/ArabicBrands";
import ArabicCategories from "../pages/user-facing-pages/ArabicCategories";
import ArabicOffers from "../pages/user-facing-pages/ArabicOffers";
import ArabicCouponDetail from "../pages/user-facing-pages/ArabicCouponDetail";
import HowtoGet from "../pages/user-facing-pages/HowtoGet";
import HowtoGetArabic from "../pages/user-facing-pages/HowToGetArabic";
import TermsArabic from "../pages/user-facing-pages/TermsArabic";
const RootLayout = () => (
  <AuthProvider>
    <Outlet />
  </AuthProvider>
);

const ProtectedLayout = () => (
  <Layout>
    <Outlet />
  </Layout>
);

const UserFacingLayout = () => (
  <UserLayout>
    <ScrollToTop />
    <Outlet />
  </UserLayout>
);
const ArabicFacingLayout = () => (
  <ArabicLayout>
    <ScrollToTop />
    <Outlet />
  </ArabicLayout>
);

const router = createBrowserRouter([
  {
    element: <RootLayout />,
    children: [
      { path: "/", element: <LoginPage /> },
      { path: "/demo", element: <DemoPage /> },
      { path: "/auth-demo", element: <AuthDemo /> },
      {
        element: <ProtectedLayout />,
        children: [
          { path: "/dashboard", element: <Dashboard /> },
          { path: "/points-criteria", element: <PointsCriteria /> },
          { path: "/add-points", element: <AddPoints /> },
          { path: "/reduce-points", element: <ReducePoints /> },
          { path: "/tiers", element: <Tiers /> },
          { path: "/tier-eligibility", element: <TierEligibility /> },
          { path: "/transactions", element: <Transactions /> },
          { path: "/customers", element: <Customer /> },
          { path: "/customers/:id", element: <CustomerDetails /> },
          { path: "/priority-customers", element: <PriorityCustomers /> },
          { path: "/users", element: <Users /> },
          { path: "/role", element: <Role /> },
          { path: "/khedma-offers", element: <KhedmahOffer /> },
          { path: "/merchant-offers", element: <MerchantOfters /> },
          { path: "/system-logs", element: <Privacy /> },
          { path: "/api-logs", element: <ApiLogs /> },
          { path: "/apps", element: <Apps /> },
          { path: "/brands", element: <Brands /> },
          { path: "/payment-methods", element: <PaymentMethods /> },
          { path: "/categories", element: <Categories /> },
          { path: "/rules", element: <Rules /> },
          { path: "/summary-reports", element: <SummaryReport /> },
          { path: "/transaction-reports", element: <TransactionReport /> },
          { path: "/offer-summary-reports", element: <OfferSummaryReport /> },
          { path: "/theme", element: <Theme /> },
          { path: "/trigger-events", element: <TriggerEvents /> },
          { path: "/trigger-services", element: <TriggerServices /> },
          { path: "/auth-logs", element: <AuthLogs /> },
          { path: "/sdk-access", element: <SdkAccess /> },
          { path: "/focus9-integration", element: <Focus9Integration /> },
          { path: "/support", element: <Support /> },
          { path: "/change-password", element: <ChangePassword /> },
        ],
      },
      {
        path: "/how-to-earn-points",
        element: <HowtoGet link />,
      },
      {
        path: "/terms-and-conditions",
        element: <Terms />,
      },
      {
        path: "/ar/how-to-earn-points",
        element: <HowtoGetArabic link />,
      },
      {
        path: "/ar/terms-and-conditions",
        element: <TermsArabic />,
      },

      {
        path: "/user",
        element: <UserFacingLayout />,
        children: [
          { path: "/user/dashboard", element: <DashboardUser /> },
          { path: "/user/offers", element: <UserOffers /> },
          { path: "/user/history", element: <PointsHistory /> },
          { path: "/user/coupon", element: <CouponDetails /> },
          { path: "/user/brands", element: <UserBrands /> },
          { path: "/user/categories", element: <UserCategories /> },
          { path: "/user/support", element: <UserSupport /> },
          { path: "/user/terms-and-conditions", element: <Terms /> },
          { path: "/user/how-to", element: <HowtoGet /> },
        ],
      },
      {
        path: "/user",
        element: <ArabicFacingLayout />,
        children: [
          { path: "/user/dashboard/ar", element: <ArabicDashboard /> },
          { path: "/user/offers/ar", element: <ArabicOffers /> },
          { path: "/user/history/ar", element: <ArabicPointsHistory /> },
          { path: "/user/coupon/ar", element: <ArabicCouponDetail /> },
          { path: "/user/brands/ar", element: <ArabicBrands /> },
          { path: "/user/categories/ar", element: <ArabicCategories /> },
          { path: "/user/support", element: <UserSupport /> },
          { path: "/user/terms-and-conditions/ar", element: <TermsArabic /> },
          { path: "/user/how-to/ar", element: <HowtoGetArabic /> },
        ],
      },
    ],
  },
]);

export default router;
