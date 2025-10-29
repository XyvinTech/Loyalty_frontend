import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { RouterProvider } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import router from "./routes/Router.jsx";
import { UIProvider } from "./ui/UIProvider";
import ErrorBoundary from "./components/ErrorBoundary";
import {
  initGlobalErrorHandlers,
  queryErrorHandler,
  safeConsole,
} from "./utils/errorHandler";
import { initWebViewDebug, monitorPerformance } from "./utils/webviewDebug";

// Initialize global error handlers for iOS webview compatibility
initGlobalErrorHandlers();

// Initialize webview debugging (development mode only)
if (import.meta.env.DEV) {
  initWebViewDebug();
  // Monitor performance after page load
  window.addEventListener("load", () => {
    setTimeout(monitorPerformance, 1000);
  });
}

// Create a client with enhanced error handling
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
      staleTime: 30000, // 30 seconds
      cacheTime: 300000, // 5 minutes
      // Prevent queries from throwing errors to the error boundary
      useErrorBoundary: false,
      // Handle errors gracefully
      onError: (error) => {
        safeConsole.error("Query error:", error);
      },
      // Suspense can cause issues in webviews
      suspense: false,
    },
    mutations: {
      // Prevent mutations from throwing errors to the error boundary
      useErrorBoundary: false,
      onError: (error) => {
        safeConsole.error("Mutation error:", error);
      },
    },
  },
  // Prevent query client from logging errors to console in production
  logger: {
    log: safeConsole.log,
    warn: safeConsole.warn,
    error: safeConsole.error,
  },
});

createRoot(document.getElementById("root")).render(
  // Temporarily disabled StrictMode to prevent DOM reconciliation errors in development
  // <StrictMode>
  <ErrorBoundary>
    <QueryClientProvider client={queryClient}>
      <UIProvider>
        <RouterProvider router={router} />
      </UIProvider>
    </QueryClientProvider>
  </ErrorBoundary>
  // </StrictMode>
);
