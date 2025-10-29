/**
 * Global error handler for iOS webview compatibility
 * Handles unhandled promise rejections and runtime errors
 */

// Safe console wrapper for iOS webviews
export const safeConsole = {
    log: (...args) => {
        try {
            console.log(...args);
        } catch (e) {
            // Silently fail
        }
    },
    error: (...args) => {
        try {
            console.error(...args);
        } catch (e) {
            // Silently fail
        }
    },
    warn: (...args) => {
        try {
            console.warn(...args);
        } catch (e) {
            // Silently fail
        }
    },
};

// Safe localStorage wrapper for iOS webviews
export const safeStorage = {
    getItem: (key) => {
        try {
            return localStorage.getItem(key);
        } catch (e) {
            safeConsole.warn("localStorage.getItem failed:", e);
            return null;
        }
    },
    setItem: (key, value) => {
        try {
            localStorage.setItem(key, value);
            return true;
        } catch (e) {
            safeConsole.warn("localStorage.setItem failed:", e);
            return false;
        }
    },
    removeItem: (key) => {
        try {
            localStorage.removeItem(key);
            return true;
        } catch (e) {
            safeConsole.warn("localStorage.removeItem failed:", e);
            return false;
        }
    },
    clear: () => {
        try {
            localStorage.clear();
            return true;
        } catch (e) {
            safeConsole.warn("localStorage.clear failed:", e);
            return false;
        }
    },
};

// Initialize global error handlers
export const initGlobalErrorHandlers = () => {
    // Handle unhandled promise rejections
    window.addEventListener("unhandledrejection", (event) => {
        safeConsole.error("Unhandled promise rejection:", event.reason);
        event.preventDefault(); // Prevent default error handling that might crash webview
    });

    // Handle global errors
    window.addEventListener("error", (event) => {
        safeConsole.error("Global error:", event.error || event.message);
        event.preventDefault(); // Prevent default error handling
    });

    // Handle image loading errors globally
    window.addEventListener(
        "error",
        (event) => {
            if (event.target.tagName === "IMG") {
                safeConsole.warn("Image failed to load:", event.target.src);
                // Set a placeholder image or hide the broken image
                event.target.style.display = "none";
            }
        },
        true // Use capture phase to catch before other handlers
    );

    // iOS-specific: Prevent viewport scaling issues
    document.addEventListener("gesturestart", (e) => {
        e.preventDefault();
    });
};

// Query error handler for TanStack Query
export const queryErrorHandler = (error) => {
    safeConsole.error("Query error:", error);

    // Don't throw errors that would crash the app
    // Instead, return a safe state
    return null;
};

// Mutation error handler for TanStack Query
export const mutationErrorHandler = (error) => {
    safeConsole.error("Mutation error:", error);
    // You can add toast notifications here
};

// Check if running in webview
export const isInWebView = () => {
    const userAgent = navigator.userAgent || navigator.vendor || window.opera;

    // Check for common webview indicators
    const isWebView =
        /wv|WebView|(iPhone|iPod|iPad)(?!.*Safari\/)/i.test(userAgent) ||
        window.ReactNativeWebView !== undefined ||
        window.flutter_inappwebview !== undefined;

    return isWebView;
};

// Check iOS version
export const getIOSVersion = () => {
    const match = navigator.userAgent.match(/OS (\d+)_(\d+)_?(\d+)?/);
    if (match) {
        return parseInt(match[1], 10);
    }
    return null;
};

// Memory management helper
export const checkMemoryPressure = () => {
    if (performance.memory) {
        const { usedJSHeapSize, jsHeapSizeLimit } = performance.memory;
        const usagePercent = (usedJSHeapSize / jsHeapSizeLimit) * 100;

        if (usagePercent > 80) {
            safeConsole.warn(`High memory usage: ${usagePercent.toFixed(2)}%`);
            return true;
        }
    }
    return false;
};

// Safe image loader
export const createSafeImageLoader = (src, fallbackSrc = null) => {
    return new Promise((resolve) => {
        const img = new Image();

        img.onload = () => resolve(src);
        img.onerror = () => {
            safeConsole.warn("Image load failed:", src);
            resolve(fallbackSrc);
        };

        // Set timeout to prevent hanging
        setTimeout(() => {
            resolve(fallbackSrc);
        }, 10000);

        img.src = src;
    });
};

