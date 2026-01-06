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
let app: FirebaseApp | undefined = undefined;
let analytics: Analytics | null = null;

// Debug logging for production
if (typeof window !== 'undefined') {
  console.log('Firebase config check:', {
    firebaseConfig,
    hasApiKey: !!firebaseConfig.apiKey,
    apiKeyLength: firebaseConfig.apiKey?.length || 0,
    hasProjectId: !!firebaseConfig.projectId,
    environment: process.env.NODE_ENV,
  });
}

try {
  // Only initialize if we have a valid API key
  if (firebaseConfig.apiKey && firebaseConfig.apiKey.length > 20) {
    app = initializeApp(firebaseConfig);

    // Initialize Analytics on client side
    if (typeof window !== 'undefined') {
      isSupported()
        .then((supported) => {
          if (supported) {
            analytics = getAnalytics(app);
            console.log('✅ Firebase Analytics initialized successfully');
          } else {
            console.log('❌ Firebase Analytics not supported');
          }
        })
        .catch((error) => {
          console.log(
            '❌ Analytics not supported or failed to initialize:',
            error
          );
        });
    }
  } else {
    console.log('Firebase not initialized: Invalid or missing API key');
  }
} catch (error) {
  console.error('Firebase initialization failed:', error);
}

export const getFirebaseAnalytics = async (): Promise<Analytics | null> => {
  if (typeof window === 'undefined') return null;
  if (analytics) return analytics;

  const supported = await isSupported();
  if (!supported) return null;

  const analyticsInstance = getAnalytics(app);
  console.log('✅ Firebase Analytics initialized');
  analytics = analyticsInstance;
  return analyticsInstance;
};

export default app;
