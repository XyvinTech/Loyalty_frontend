# iOS 26 WebView White Screen Fix Guide

## Problem Summary

The app was experiencing white screen crashes specifically on iOS 26 when viewed through Flutter/React Native webviews, particularly on the brands page.

## Root Causes Identified

### 1. **Unhandled Errors**

- No React Error Boundary to catch rendering errors
- Unhandled promise rejections causing crashes
- API errors propagating to the UI layer

### 2. **localStorage Restrictions**

- iOS webviews have strict localStorage policies
- Can fail silently or throw exceptions
- Third-party cookies/storage can be blocked

### 3. **Memory Management**

- iOS has stricter memory limits for webviews
- No cleanup of event listeners or timers
- Large images without lazy loading

### 4. **TanStack Query Configuration**

- Default error handling throws to error boundaries
- Query errors not handled gracefully
- No proper retry logic

### 5. **Image Loading Failures**

- No fallback for failed image loads
- Can cause component crashes

## Solutions Implemented

### 1. Global Error Boundary

**File:** `src/components/ErrorBoundary.jsx`

Catches React rendering errors and displays user-friendly fallback UI instead of white screen.

```javascript
// Wraps entire app in main.jsx
<ErrorBoundary>
  <QueryClientProvider client={queryClient}>...</QueryClientProvider>
</ErrorBoundary>
```

### 2. Global Error Handlers

**File:** `src/utils/errorHandler.js`

Implements:

- Safe console wrapper (prevents console.error crashes)
- Safe localStorage wrapper (handles quota/permission errors)
- Global promise rejection handler
- iOS webview detection
- Memory pressure monitoring

```javascript
// Automatically initialized in main.jsx
initGlobalErrorHandlers();
```

### 3. Enhanced Query Configuration

**File:** `src/main.jsx`

```javascript
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      useErrorBoundary: false, // Prevent errors from crashing app
      onError: (error) => safeConsole.error("Query error:", error),
      retry: 1,
      staleTime: 30000,
    },
  },
});
```

### 4. Safe Image Component

**File:** `src/components/User-Facing/SafeImage.jsx`

Handles image loading failures gracefully without crashing.

```javascript
<SafeImage src={imageUrl} alt="Brand" fallbackSrc="/placeholder.png" />
```

### 5. Enhanced Data Fetching

**Files:**

- `src/app-store/brands.js`
- `src/hooks/useCustomerAuth.js`

All API calls wrapped in try-catch with safe error logging.

### 6. Component-Level Error Handling

**Files:**

- `src/pages/user-facing-pages/UserBrands.jsx`
- `src/pages/user-facing-pages/ArabicBrands.jsx`

Added error states with retry functionality:

```javascript
if (error && !isLoading && !brands.length) {
  return <ErrorStateWithRetry onRetry={refetch} />;
}
```

## Testing & Debugging

### 1. Enable Debug Mode

Add this to your URL parameters:

```
?customerID=xxx&apiKey=xxx&debug=true
```

### 2. Check Console Logs

All errors are now safely logged using `safeConsole`. Check browser console or React Native debugger:

```javascript
import { safeConsole } from "./utils/errorHandler";
safeConsole.error("Something went wrong:", error);
```

### 3. Test in iOS Simulator

```bash
# Run in iOS simulator
cd ios && pod install
npx react-native run-ios

# Or for Flutter
flutter run -d ios
```

### 4. Monitor Memory Usage

The app now logs memory pressure warnings:

```javascript
import { checkMemoryPressure } from "./utils/errorHandler";

if (checkMemoryPressure()) {
  // Clear caches or reduce memory usage
}
```

### 5. Test WebView Detection

```javascript
import { isInWebView, getIOSVersion } from "./utils/errorHandler";

console.log("In WebView:", isInWebView());
console.log("iOS Version:", getIOSVersion());
```

## Common Issues & Solutions

### Issue: localStorage not available

**Solution:** We now use `safeStorage` wrapper that handles all errors gracefully.

```javascript
import { safeStorage } from "./utils/errorHandler";
safeStorage.setItem("key", "value"); // Won't crash if fails
```

### Issue: API calls failing silently

**Solution:** All API calls return empty arrays/null on error instead of throwing.

### Issue: Images causing crashes

**Solution:** Use `SafeImage` component everywhere:

```bash
# Find all img tags
grep -r "<img" src/

# Replace with SafeImage
```

### Issue: Component re-renders causing crashes

**Solution:**

1. Use proper keys in lists (use `brand?._id` instead of `index`)
2. Add null checks: `brand?.title?.en`
3. Use React.memo for expensive components

## Best Practices Going Forward

### 1. Always Use Error Boundaries

Wrap new page routes in error boundaries:

```javascript
<ErrorBoundary>
  <YourNewPage />
</ErrorBoundary>
```

### 2. Use Safe Utilities

```javascript
import { safeConsole, safeStorage } from "./utils/errorHandler";

// Instead of:
console.error("Error");
localStorage.setItem("key", "value");

// Use:
safeConsole.error("Error");
safeStorage.setItem("key", "value");
```

### 3. Handle Query Errors

```javascript
const { data, error, refetch } = useQuery({
  // ... query config
  useErrorBoundary: false, // Don't crash on error
  onError: (error) => safeConsole.error("Query failed:", error),
});

// Show error UI
if (error) return <ErrorState onRetry={refetch} />;
```

### 4. Image Loading

Always use SafeImage component:

```javascript
import SafeImage from "./components/User-Facing/SafeImage";

<SafeImage src={imageUrl} alt="Description" fallbackSrc="/placeholder.png" />;
```

### 5. Null Safety

Always use optional chaining:

```javascript
// Bad
const title = product.title.en;

// Good
const title = product?.title?.en || "Default Title";
```

### 6. List Keys

Use unique IDs, not array indices:

```javascript
// Bad
{
  items.map((item, index) => <Item key={index} />);
}

// Good
{
  items.map((item) => <Item key={item._id || item.id} />);
}
```

## Mobile App Integration

### For Flutter Developers

```dart
WebView(
  initialUrl: 'https://your-domain.com/user/dashboard?customerID=xxx&apiKey=xxx',
  javascriptMode: JavascriptMode.unrestricted,
  onWebResourceError: (error) {
    print('WebView error: ${error.description}');
  },
  // Enable debugging
  debuggingEnabled: true,
)
```

### For React Native Developers

```javascript
<WebView
  source={{
    uri: "https://your-domain.com/user/dashboard?customerID=xxx&apiKey=xxx",
  }}
  onError={(syntheticEvent) => {
    const { nativeEvent } = syntheticEvent;
    console.warn("WebView error: ", nativeEvent);
  }}
  // Enable debugging
  onConsoleMessage={(message) => {
    console.log("WebView console:", message.message);
  }}
/>
```

## Monitoring in Production

### 1. Add Error Tracking

Consider adding Sentry or similar:

```bash
npm install @sentry/react
```

```javascript
// In main.jsx
import * as Sentry from "@sentry/react";

Sentry.init({
  dsn: "your-dsn",
  environment: import.meta.env.MODE,
  integrations: [new Sentry.BrowserTracing()],
});
```

### 2. Track WebView Usage

```javascript
// In useEffect
useEffect(() => {
  if (isInWebView()) {
    // Log analytics
    console.log("Running in WebView, iOS version:", getIOSVersion());
  }
}, []);
```

## Performance Optimizations

### 1. Lazy Load Images

Already implemented with `loading="lazy"` in SafeImage component.

### 2. Reduce Bundle Size

```bash
# Analyze bundle
npm run build
npx vite-bundle-visualizer
```

### 3. Memory Management

```javascript
// In components with subscriptions/timers
useEffect(() => {
  const timer = setInterval(() => {}, 1000);

  return () => {
    clearInterval(timer); // Always cleanup
  };
}, []);
```

## Need More Help?

### Debug Checklist

- [ ] Check browser/WebView console for errors
- [ ] Verify localStorage is accessible
- [ ] Check network requests in DevTools
- [ ] Test memory usage with Chrome DevTools
- [ ] Verify API responses are valid
- [ ] Check image URLs are accessible
- [ ] Test with different iOS versions
- [ ] Test in both portrait and landscape modes

### Contact Points

- Frontend issues: Check ErrorBoundary component
- API issues: Check Network tab and backend logs
- Storage issues: Use safeStorage wrapper
- Image issues: Use SafeImage component

## Summary

The white screen issue was caused by multiple factors:

1. ✅ **Fixed:** Added Error Boundaries
2. ✅ **Fixed:** Implemented safe localStorage wrapper
3. ✅ **Fixed:** Enhanced error handling in TanStack Query
4. ✅ **Fixed:** Added SafeImage component
5. ✅ **Fixed:** Improved error states with retry functionality
6. ✅ **Fixed:** Global error handlers for iOS compatibility

All user-facing pages now have robust error handling and will show friendly error messages instead of white screens.
