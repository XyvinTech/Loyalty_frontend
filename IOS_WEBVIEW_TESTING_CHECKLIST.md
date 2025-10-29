# iOS WebView Testing Checklist

## Before Deploying to Production

### ✅ 1. Test on Actual iOS Devices

- [ ] Test on iPhone with iOS 26
- [ ] Test on iPhone with iOS 25 (previous version)
- [ ] Test on iPad with latest iOS
- [ ] Test in both portrait and landscape modes

### ✅ 2. Test All Critical Pages

- [ ] Dashboard (English & Arabic)
- [ ] Brands page (English & Arabic)
- [ ] Categories page (English & Arabic)
- [ ] Offers page (English & Arabic)
- [ ] Points History
- [ ] Profile page
- [ ] Terms & Conditions

### ✅ 3. Test Network Conditions

- [ ] Test with slow 3G connection
- [ ] Test with network disconnected (offline)
- [ ] Test with intermittent connection
- [ ] Test API timeout scenarios

### ✅ 4. Test Error Scenarios

- [ ] Invalid customerID or apiKey
- [ ] Expired authentication
- [ ] 404 errors (customer not found)
- [ ] 500 server errors
- [ ] Image loading failures
- [ ] localStorage quota exceeded

### ✅ 5. Test Memory Management

- [ ] Navigate between pages 20+ times
- [ ] Check for memory leaks in Safari DevTools
- [ ] Monitor memory usage on device
- [ ] Test with 10+ images loading

### ✅ 6. Test WebView Integration

#### For Flutter

```dart
// Test code
WebView(
  initialUrl: 'your-url?customerID=test&apiKey=test',
  javascriptMode: JavascriptMode.unrestricted,
  debuggingEnabled: true,
  onConsoleMessage: (message) {
    print('WebView: ${message.message}');
  },
  onWebResourceError: (error) {
    print('Error: ${error.description}');
  },
)
```

- [ ] Test URL parameter passing
- [ ] Test postMessage communication
- [ ] Test back button navigation
- [ ] Test deep linking

#### For React Native

```javascript
// Test code
<WebView
  source={{ uri: "your-url?customerID=test&apiKey=test" }}
  onMessage={(event) => console.log("Message:", event.nativeEvent.data)}
  onError={(error) => console.log("Error:", error)}
  onConsoleMessage={(message) => console.log("Console:", message.message)}
/>
```

- [ ] Test postMessage communication
- [ ] Test JavaScript injection
- [ ] Test back button handling
- [ ] Test reload functionality

### ✅ 7. Test localStorage

- [ ] Clear all storage and reload
- [ ] Test with localStorage disabled in Settings
- [ ] Test with third-party cookies blocked
- [ ] Test storage quota limits

### ✅ 8. Performance Testing

- [ ] Measure page load time (should be < 3s)
- [ ] Check Time to Interactive (TTI)
- [ ] Monitor JavaScript heap size
- [ ] Check for console warnings/errors

### ✅ 9. Visual Testing

- [ ] No white screens on any page
- [ ] All images load correctly
- [ ] Layouts work on all screen sizes
- [ ] RTL layout works for Arabic
- [ ] Loading states display correctly
- [ ] Error states display correctly

### ✅ 10. Functional Testing

- [ ] Search functionality works
- [ ] Navigation between pages works
- [ ] Back button works correctly
- [ ] Pull to refresh works (if implemented)
- [ ] Forms submit correctly
- [ ] All CTAs (Call to Action) work

## Testing Tools

### 1. Safari Web Inspector (iOS Device)

```bash
# On Mac
1. Connect iPhone via USB
2. Open Safari > Develop > [Your iPhone] > [Your WebView]
3. Check Console for errors
4. Check Network tab for failed requests
5. Check Memory timeline
```

### 2. React Native Debugger

```bash
# For React Native apps
npx react-native log-ios
# or
npx react-native log-android
```

### 3. Flutter DevTools

```bash
# For Flutter apps
flutter run
# Then press 'h' for help
# Press 'o' to open DevTools
```

### 4. Manual Console Checks

Add to URL: `?debug=true` to enable verbose logging

Check browser console for:

- ❌ Red errors (critical)
- ⚠️ Yellow warnings (review)
- 🔍 Debug info (helpful)

## Debug Commands

### Check WebView Info

```javascript
// Paste in browser console
console.log(window.__WEBVIEW_DEBUG__);
```

### Check Memory Usage

```javascript
// Paste in browser console
if (performance.memory) {
  const used = performance.memory.usedJSHeapSize;
  const limit = performance.memory.jsHeapSizeLimit;
  console.log(
    `Memory: ${(used / 1024 / 1024).toFixed(2)}MB / ${(
      limit /
      1024 /
      1024
    ).toFixed(2)}MB`
  );
}
```

### Check localStorage

```javascript
// Paste in browser console
try {
  localStorage.setItem("test", "test");
  localStorage.removeItem("test");
  console.log("✅ localStorage available");
} catch (e) {
  console.error("❌ localStorage not available:", e);
}
```

### Check API Connectivity

```javascript
// Paste in browser console
fetch(window.location.origin + "/api/v1/health")
  .then((r) => console.log("✅ API reachable:", r.status))
  .catch((e) => console.error("❌ API unreachable:", e));
```

## Common Issues & Quick Fixes

### Issue: White Screen

**Quick Fix:**

1. Check browser console for errors
2. Clear localStorage: `localStorage.clear()`
3. Hard refresh: Cmd+Shift+R (Mac) or Ctrl+Shift+R (Win)
4. Check network connectivity

### Issue: Images Not Loading

**Quick Fix:**

1. Check image URLs in Network tab
2. Verify CORS headers
3. Check image file size (should be < 500KB)
4. Test image URL directly in browser

### Issue: localStorage Errors

**Quick Fix:**

1. Check Safari Settings > Privacy > Block All Cookies (should be OFF)
2. Use Incognito/Private mode for testing
3. Clear website data in Settings

### Issue: Slow Performance

**Quick Fix:**

1. Check Network tab for slow requests
2. Monitor Memory in DevTools
3. Reduce image sizes
4. Check for memory leaks

## Automated Testing Script

### Test All Pages

```bash
# Create test script
cat > test_webview.sh << 'EOF'
#!/bin/bash

BASE_URL="your-url"
CUSTOMER_ID="test_customer"
API_KEY="test_key"

pages=(
  "/user/dashboard"
  "/user/brands"
  "/user/categories"
  "/user/offers"
  "/user/history"
)

for page in "${pages[@]}"; do
  echo "Testing: $page"
  curl -I "$BASE_URL$page?customerID=$CUSTOMER_ID&apiKey=$API_KEY"
done
EOF

chmod +x test_webview.sh
./test_webview.sh
```

## Reporting Issues

### Information to Collect

When reporting an issue, include:

1. **Device Info:**

   - Device model (e.g., iPhone 15 Pro)
   - iOS version (e.g., 26.0.1)
   - Screen size

2. **Environment:**

   - WebView type (Flutter/React Native/Native)
   - App version
   - Network type (WiFi/4G/5G)

3. **Error Details:**

   - Page URL
   - Error message from console
   - Screenshot of issue
   - Steps to reproduce

4. **Logs:**
   - Browser console logs
   - Network requests (from DevTools)
   - Mobile app logs

## Sign-Off Checklist

Before marking testing as complete:

- [ ] All critical pages tested on iOS 26
- [ ] No white screen issues
- [ ] All images load correctly
- [ ] No console errors
- [ ] Network errors handled gracefully
- [ ] localStorage works correctly
- [ ] Memory usage is acceptable
- [ ] Performance is good (< 3s load time)
- [ ] All error states show friendly messages
- [ ] Retry functionality works
- [ ] Documentation is up to date

## Next Steps After Testing

1. Document any issues found
2. Prioritize critical bugs
3. Create tickets for non-critical issues
4. Update this checklist based on findings
5. Schedule regression testing

---

**Last Updated:** [Current Date]  
**Tested By:** [Your Name]  
**iOS Version Tested:** [Version Number]
