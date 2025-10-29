import { lazy } from "react";

/**
 * Lazy-loaded routes for code splitting
 * Reduces initial bundle size and improves performance on iOS webviews
 */

// Admin Pages (lazy load these as they're not used in webview)
export const Dashboard = lazy(() => import("../pages/Dashboard"));
export const PointsManagement = lazy(() => import("../pages/PointsManagement"));
export const TierManagement = lazy(() => import("../pages/TierManagement"));
export const CustomerManagement = lazy(() =>
    import("../pages/CustomerManagement")
);
export const TransactionHistory = lazy(() =>
    import("../pages/TransactionHistory")
);

// User-Facing Pages (can be lazy loaded if not initial route)
export const UserDashboard = lazy(() =>
    import("../pages/user-facing-pages/UserDashboard")
);
export const UserBrands = lazy(() =>
    import("../pages/user-facing-pages/UserBrands")
);
export const UserCategories = lazy(() =>
    import("../pages/user-facing-pages/UserCategories")
);
export const UserOffers = lazy(() =>
    import("../pages/user-facing-pages/UserOffers")
);
export const PointsHistory = lazy(() =>
    import("../pages/user-facing-pages/PointsHistory")
);

// Arabic Pages
export const ArabicDashboard = lazy(() =>
    import("../pages/user-facing-pages/ArabicDashboard")
);
export const ArabicBrands = lazy(() =>
    import("../pages/user-facing-pages/ArabicBrands")
);
export const ArabicCategories = lazy(() =>
    import("../pages/user-facing-pages/ArabicCategories")
);
export const ArabicOffers = lazy(() =>
    import("../pages/user-facing-pages/ArabicOffers")
);
export const ArabicPointHistory = lazy(() =>
    import("../pages/user-facing-pages/ArabicPointHistory")
);

// Terms and How To Get pages (large content, should be lazy loaded)
export const Terms = lazy(() => import("../pages/user-facing-pages/Terms"));
export const TermsArabic = lazy(() =>
    import("../pages/user-facing-pages/TermsArabic")
);
export const HowtoGet = lazy(() =>
    import("../pages/user-facing-pages/HowtoGet")
);
export const HowToGetArabic = lazy(() =>
    import("../pages/user-facing-pages/HowToGetArabic")
);


