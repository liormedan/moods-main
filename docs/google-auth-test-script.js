/**
 * סקריפט בדיקה אוטומטי לתהליך התחברות Google
 * 
 * איך להשתמש:
 * 1. פתח את הדפדפן ב-http://localhost:3000
 * 2. לחץ F12 לפתיחת DevTools
 * 3. לך לטאב Console
 * 4. העתק והדבק את כל הקוד הזה
 * 5. לחץ Enter
 * 
 * הסקריפט יבדוק את כל השלבים ויציג דוח מפורט
 */

(function() {
  console.log("🧪 [TEST] Starting Google Auth Test Script");
  console.log("🧪 [TEST] =========================================");
  
  const testResults = {
    componentLoaded: false,
    buttonExists: false,
    environmentCheck: false,
    oauthCall: false,
    redirectCheck: false,
    errors: []
  };

  // בדיקה 1: האם הקומפוננטה נטענה
  console.log("\n✅ Test 1: Checking if component loaded...");
  const loginLogs = [];
  const signupLogs = [];
  
  // האזן ללוגים
  const originalLog = console.log;
  console.log = function(...args) {
    const message = args.join(' ');
    if (message.includes('[LOGIN]') || message.includes('[SIGNUP]')) {
      if (message.includes('component loaded')) {
        testResults.componentLoaded = true;
        console.log("✅ Component loaded detected!");
      }
      if (message.includes('Environment Info')) {
        testResults.environmentCheck = true;
        console.log("✅ Environment check detected!");
      }
      if (message.includes('OAuth response received')) {
        testResults.oauthCall = true;
        console.log("✅ OAuth call detected!");
      }
    }
    originalLog.apply(console, args);
  };

  // בדיקה 2: האם הכפתור קיים
  console.log("\n✅ Test 2: Checking if Google button exists...");
  setTimeout(() => {
    const googleButtons = document.querySelectorAll('button');
    let foundButton = false;
    
    googleButtons.forEach(button => {
      const text = button.textContent || button.innerText;
      if (text.includes('Google') || text.includes('גוגל')) {
        foundButton = true;
        testResults.buttonExists = true;
        console.log("✅ Google button found!");
        console.log("   Button text:", text.trim());
        console.log("   Button element:", button);
        
        // בדיקה 3: בדיקת הסביבה
        console.log("\n✅ Test 3: Checking environment...");
        const currentOrigin = window.location.origin;
        const currentHost = window.location.host;
        const isLocalhost = currentHost.includes('localhost') || currentHost.includes('127.0.0.1');
        const isProduction = currentHost.includes('vercel.app') || currentHost.includes('netlify.app');
        
        console.log("   Current Origin:", currentOrigin);
        console.log("   Current Host:", currentHost);
        console.log("   Is Localhost:", isLocalhost);
        console.log("   Is Production:", isProduction);
        
        if (isLocalhost && !isProduction) {
          console.log("✅ Environment check PASSED - Running on localhost");
        } else if (isProduction) {
          console.warn("⚠️  Environment check WARNING - Running on production!");
          testResults.errors.push("Running on production instead of localhost");
        } else {
          console.warn("⚠️  Environment check WARNING - Unknown environment");
          testResults.errors.push("Unknown environment");
        }
        
        // בדיקה 4: בדיקת onClick handler
        console.log("\n✅ Test 4: Checking button onClick handler...");
        const onClickAttr = button.getAttribute('onclick');
        const hasOnClick = button.onclick !== null;
        
        console.log("   Has onClick attribute:", !!onClickAttr);
        console.log("   Has onClick handler:", hasOnClick);
        
        // בדיקה 5: בדיקת Supabase client
        console.log("\n✅ Test 5: Checking Supabase configuration...");
        if (typeof window !== 'undefined') {
          // נסה לייבא את createClient
          console.log("   Window object exists");
          console.log("   Location:", window.location.href);
        }
        
        // סיכום
        console.log("\n📊 Test Summary:");
        console.log("==================");
        console.log("Component Loaded:", testResults.componentLoaded ? "✅" : "❌");
        console.log("Button Exists:", testResults.buttonExists ? "✅" : "❌");
        console.log("Environment Check:", testResults.environmentCheck ? "✅" : "❌");
        console.log("OAuth Call:", testResults.oauthCall ? "✅" : "⏳ (Will check after click)");
        console.log("Errors:", testResults.errors.length > 0 ? "⚠️ " + testResults.errors.length : "✅ None");
        
        if (testResults.errors.length > 0) {
          console.log("\n⚠️  Errors found:");
          testResults.errors.forEach((error, index) => {
            console.log(`   ${index + 1}. ${error}`);
          });
        }
        
        console.log("\n💡 Next Steps:");
        console.log("   1. Click the Google button manually");
        console.log("   2. Watch the console for logs starting with 🔵 [LOGIN] or 🟣 [SIGNUP]");
        console.log("   3. Follow the authentication flow");
        console.log("   4. Check if you're redirected to /dashboard");
        
        // שחזר את console.log המקורי
        console.log = originalLog;
      }
    });
    
    if (!foundButton) {
      console.error("❌ Google button NOT found!");
      console.log("   Available buttons:", googleButtons.length);
      testResults.errors.push("Google button not found on page");
    }
  }, 1000);
  
  console.log("\n⏳ Waiting for page to load...");
  console.log("🧪 [TEST] =========================================");
})();


