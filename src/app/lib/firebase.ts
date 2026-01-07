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

// Initialize Firebase App
const initializeFirebaseApp = (): FirebaseApp | null => {
  if (app) return app;

  try {
    if (isValidFirebaseConfig()) {
      app = initializeApp(firebaseConfig);
      return app;
    } else {
      return null;
    }
  } catch {
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
        return null;
      }

      // Check if analytics is supported
      const supported = await isSupported();
      if (!supported) {
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

      return analyticsInstance;
    } catch {
      return null;
    }
  })();

  return analyticsPromise;
};

export { initializeFirebaseApp };
export default initializeFirebaseApp;
