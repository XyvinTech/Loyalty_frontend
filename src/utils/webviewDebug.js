/**
 * WebView Debug Utilities
 * Tools to help diagnose issues in iOS/Android webviews
 */

import { safeConsole, isInWebView, getIOSVersion } from './errorHandler';

/**
 * Initialize webview debugging tools
 */
export const initWebViewDebug = () => {
    if (!isInWebView()) {
        return; // Only run in webview
    }

    const debugInfo = {
        isWebView: isInWebView(),
        iosVersion: getIOSVersion(),
        userAgent: navigator.userAgent,
        viewport: {
            width: window.innerWidth,
            height: window.innerHeight,
            devicePixelRatio: window.devicePixelRatio,
        },
        storage: {
            localStorage: checkStorageAvailability('localStorage'),
            sessionStorage: checkStorageAvailability('sessionStorage'),
        },
        memory: performance.memory ? {
            usedJSHeapSize: performance.memory.usedJSHeapSize,
            totalJSHeapSize: performance.memory.totalJSHeapSize,
            jsHeapSizeLimit: performance.memory.jsHeapSizeLimit,
        } : null,
    };

    safeConsole.log('🔍 WebView Debug Info:', debugInfo);

    // Log to window for mobile app to access
    window.__WEBVIEW_DEBUG__ = debugInfo;

    // Send to React Native if available
    if (window.ReactNativeWebView) {
        window.ReactNativeWebView.postMessage(JSON.stringify({
            type: 'debug_info',
            data: debugInfo,
        }));
    }

    // Send to Flutter if available
    if (window.flutter_inappwebview) {
        window.flutter_inappwebview.callHandler('debugInfo', debugInfo);
    }

    return debugInfo;
};

/**
 * Check if storage is available and working
 */
function checkStorageAvailability(type) {
    try {
        const storage = window[type];
        const testKey = '__storage_test__';
        storage.setItem(testKey, 'test');
        storage.removeItem(testKey);
        return { available: true, error: null };
    } catch (e) {
        return {
            available: false,
            error: e.message,
            name: e.name
        };
    }
}

/**
 * Log page view for tracking
 */
export const logPageView = (pageName) => {
    const event = {
        type: 'page_view',
        page: pageName,
        timestamp: new Date().toISOString(),
        url: window.location.href,
    };

    safeConsole.log('📄 Page View:', event);

    // Send to mobile app
    if (window.ReactNativeWebView) {
        window.ReactNativeWebView.postMessage(JSON.stringify(event));
    }

    if (window.flutter_inappwebview) {
        window.flutter_inappwebview.callHandler('pageView', event);
    }
};

/**
 * Log errors to mobile app
 */
export const logErrorToMobileApp = (error, context = {}) => {
    const errorEvent = {
        type: 'error',
        message: error.message || String(error),
        stack: error.stack,
        context,
        timestamp: new Date().toISOString(),
        url: window.location.href,
    };

    safeConsole.error('❌ Error logged:', errorEvent);

    // Send to mobile app
    if (window.ReactNativeWebView) {
        window.ReactNativeWebView.postMessage(JSON.stringify(errorEvent));
    }

    if (window.flutter_inappwebview) {
        window.flutter_inappwebview.callHandler('errorLog', errorEvent);
    }
};

/**
 * Monitor performance
 */
export const monitorPerformance = () => {
    if (!performance.getEntriesByType) return;

    const navigation = performance.getEntriesByType('navigation')[0];
    const paint = performance.getEntriesByType('paint');

    const metrics = {
        type: 'performance',
        navigation: navigation ? {
            domContentLoaded: navigation.domContentLoadedEventEnd - navigation.domContentLoadedEventStart,
            loadComplete: navigation.loadEventEnd - navigation.loadEventStart,
            domInteractive: navigation.domInteractive,
        } : null,
        paint: paint.reduce((acc, entry) => {
            acc[entry.name] = entry.startTime;
            return acc;
        }, {}),
        timestamp: new Date().toISOString(),
    };

    safeConsole.log('⚡ Performance Metrics:', metrics);

    // Send to mobile app
    if (window.ReactNativeWebView) {
        window.ReactNativeWebView.postMessage(JSON.stringify(metrics));
    }

    if (window.flutter_inappwebview) {
        window.flutter_inappwebview.callHandler('performanceMetrics', metrics);
    }
};

/**
 * Test API connectivity
 */
export const testAPIConnectivity = async (apiUrl) => {
    const startTime = Date.now();

    try {
        const response = await fetch(apiUrl + '/health', {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' },
        });

        const endTime = Date.now();
        const duration = endTime - startTime;

        const result = {
            type: 'api_test',
            success: response.ok,
            status: response.status,
            duration,
            timestamp: new Date().toISOString(),
        };

        safeConsole.log('🌐 API Test:', result);

        // Send to mobile app
        if (window.ReactNativeWebView) {
            window.ReactNativeWebView.postMessage(JSON.stringify(result));
        }

        return result;
    } catch (error) {
        const endTime = Date.now();
        const duration = endTime - startTime;

        const result = {
            type: 'api_test',
            success: false,
            error: error.message,
            duration,
            timestamp: new Date().toISOString(),
        };

        safeConsole.error('🌐 API Test Failed:', result);
        return result;
    }
};

/**
 * Create debug overlay for development
 */
export const createDebugOverlay = () => {
    if (process.env.NODE_ENV !== 'development') return;

    const overlay = document.createElement('div');
    overlay.id = 'webview-debug-overlay';
    overlay.style.cssText = `
    position: fixed;
    bottom: 10px;
    right: 10px;
    background: rgba(0, 0, 0, 0.8);
    color: white;
    padding: 10px;
    border-radius: 5px;
    font-size: 10px;
    z-index: 9999;
    max-width: 200px;
    font-family: monospace;
  `;

    const debugInfo = initWebViewDebug();
    overlay.innerHTML = `
    <div><strong>WebView Debug</strong></div>
    <div>iOS: ${debugInfo.iosVersion || 'N/A'}</div>
    <div>Storage: ${debugInfo.storage.localStorage.available ? '✓' : '✗'}</div>
    <div>Memory: ${debugInfo.memory ? '✓' : '✗'}</div>
  `;

    document.body.appendChild(overlay);

    // Update memory info every 5 seconds
    setInterval(() => {
        if (performance.memory) {
            const usagePercent = (performance.memory.usedJSHeapSize / performance.memory.jsHeapSizeLimit * 100).toFixed(1);
            overlay.innerHTML += `<div>Mem: ${usagePercent}%</div>`;
        }
    }, 5000);
};

// Export all utilities
export default {
    initWebViewDebug,
    logPageView,
    logErrorToMobileApp,
    monitorPerformance,
    testAPIConnectivity,
    createDebugOverlay,
};

