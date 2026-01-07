import { initializeApp, FirebaseApp } from 'firebase/app';
import { getAnalytics, isSupported, Analytics } from 'firebase/analytics';

// Your web app's Firebase configuration
// Replace these with your actual Firebase project configuration
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
};

// Initialize Firebase with error handling
let app: FirebaseApp | null = null;
let analytics: Analytics | null = null;
let analyticsPromise: Promise<Analytics | null> | null = null;

// Validate Firebase configuration
const isValidFirebaseConfig = () => {
  return (
    firebaseConfig.apiKey &&
    firebaseConfig.apiKey.length > 20 &&
    firebaseConfig.projectId &&
    firebaseConfig.appId
  );
};

// Debug logging for production
if (typeof window !== 'undefined') {
  console.log('🔧 Firebase config check:', {
    hasApiKey: !!firebaseConfig.apiKey,
    apiKeyLength: firebaseConfig.apiKey?.length || 0,
    hasProjectId: !!firebaseConfig.projectId,
    hasAppId: !!firebaseConfig.appId,
    hasMeasurementId: !!firebaseConfig.measurementId,
    environment: process.env.NODE_ENV,
    configValid: isValidFirebaseConfig(),
  });
}

// Initialize Firebase App
const initializeFirebaseApp = (): FirebaseApp | null => {
  if (app) return app;

  try {
    if (isValidFirebaseConfig()) {
      app = initializeApp(firebaseConfig);
      console.log('✅ Firebase App initialized successfully');
      return app;
    } else {
      console.error('❌ Invalid Firebase configuration');
      return null;
    }
  } catch (error) {
    console.error('❌ Firebase App initialization failed:', error);
    return null;
  }
};

export const getFirebaseAnalytics = async (): Promise<Analytics | null> => {
  // Return null for server-side rendering
  if (typeof window === 'undefined') return null;

  // Return cached analytics instance
  if (analytics) return analytics;

  // Return existing promise to avoid multiple initializations
  if (analyticsPromise) return analyticsPromise;

  analyticsPromise = (async () => {
    try {
      // Initialize Firebase app first
      const firebaseApp = initializeFirebaseApp();
      if (!firebaseApp) {
        console.error('❌ Firebase app not available for analytics');
        return null;
      }

      // Check if analytics is supported
      const supported = await isSupported();
      if (!supported) {
        console.log(
          '❌ Firebase Analytics not supported on this browser/environment'
        );
        return null;
      }

      // Set up gtag consent before initializing analytics
      if (typeof window.gtag === 'function') {
        window.gtag('consent', 'default', {
          analytics_storage: 'granted',
        });
      }

      // Initialize analytics
      const analyticsInstance = getAnalytics(firebaseApp);
      analytics = analyticsInstance;

      console.log('✅ Firebase Analytics initialized successfully');
      return analyticsInstance;
    } catch (error) {
      console.error('❌ Failed to initialize Firebase Analytics:', error);
      return null;
    }
  })();

  return analyticsPromise;
};

export { initializeFirebaseApp };
export default initializeFirebaseApp;
