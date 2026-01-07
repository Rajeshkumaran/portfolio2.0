'use client';
import { useEffect, useState } from 'react';
import { getFirebaseAnalytics } from '../lib/firebase';
import { testAnalytics } from '../lib/analytics';

interface DebugInfo {
  firebaseConfigLoaded: boolean;
  analyticsSupported?: boolean;
  analyticsInitialized: boolean;
  testEventSent?: boolean;
  errors: string[];
  environment: {
    isClient: boolean;
    userAgent: string;
    domain: string;
  };
}

export default function AnalyticsDebug() {
  const [debugInfo, setDebugInfo] = useState<DebugInfo>({
    firebaseConfigLoaded: false,
    analyticsInitialized: false,
    errors: [],
    environment: {
      isClient: false,
      userAgent: '',
      domain: '',
    },
  });

  const [showDebug, setShowDebug] = useState(false);

  useEffect(() => {
    const runDebug = async () => {
      const errors: string[] = [];

      try {
        // Check environment
        const environment = {
          isClient: typeof window !== 'undefined',
          userAgent:
            typeof window !== 'undefined' ? window.navigator.userAgent : 'SSR',
          domain:
            typeof window !== 'undefined' ? window.location.hostname : 'SSR',
        };

        // Check Firebase config
        const firebaseConfigLoaded = !!(
          process.env.NEXT_PUBLIC_FIREBASE_API_KEY &&
          process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID &&
          process.env.NEXT_PUBLIC_FIREBASE_APP_ID
        );

        if (!firebaseConfigLoaded) {
          errors.push('Firebase configuration missing or incomplete');
        }

        // Test analytics initialization
        let analyticsInitialized = false;
        let analyticsSupported = false;
        let testEventSent = false;

        try {
          const analytics = await getFirebaseAnalytics();
          analyticsInitialized = !!analytics;
          analyticsSupported = analyticsInitialized;

          if (analytics) {
            testEventSent = await testAnalytics();
          }
        } catch (error) {
          errors.push(`Analytics initialization error: ${error}`);
        }

        setDebugInfo({
          firebaseConfigLoaded,
          analyticsSupported,
          analyticsInitialized,
          testEventSent,
          errors,
          environment,
        });
      } catch (error) {
        errors.push(`Debug error: ${error}`);
        setDebugInfo((prev) => ({ ...prev, errors }));
      }
    };

    // Run debug in development and when pressing Ctrl+Shift+D
    if (process.env.NODE_ENV === 'development') {
      runDebug();
    }

    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.shiftKey && e.key === 'D') {
        setShowDebug(!showDebug);
        runDebug();
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [showDebug]);

  // Only show in development or when debug is toggled
  if (!showDebug && process.env.NODE_ENV !== 'development') {
    return null;
  }

  return (
    <div
      className="fixed bottom-4 right-4 max-w-md p-4 bg-black bg-opacity-90 text-white text-sm rounded-lg z-50"
      style={{ fontSize: '12px', fontFamily: 'monospace' }}
    >
      <div className="flex justify-between items-center mb-2">
        <h4 className="font-bold">📊 Analytics Debug</h4>
        <button
          onClick={() => setShowDebug(!showDebug)}
          className="text-gray-400 hover:text-white"
        >
          ✕
        </button>
      </div>

      <div className="space-y-2">
        <div>
          <span
            className={
              debugInfo.environment.isClient ? 'text-green-400' : 'text-red-400'
            }
          >
            {debugInfo.environment.isClient ? '✅' : '❌'}
          </span>
          <span className="ml-2">
            Client-side: {debugInfo.environment.isClient.toString()}
          </span>
        </div>

        <div>
          <span
            className={
              debugInfo.firebaseConfigLoaded ? 'text-green-400' : 'text-red-400'
            }
          >
            {debugInfo.firebaseConfigLoaded ? '✅' : '❌'}
          </span>
          <span className="ml-2">
            Firebase Config: {debugInfo.firebaseConfigLoaded.toString()}
          </span>
        </div>

        <div>
          <span
            className={
              debugInfo.analyticsSupported ? 'text-green-400' : 'text-red-400'
            }
          >
            {debugInfo.analyticsSupported ? '✅' : '❌'}
          </span>
          <span className="ml-2">
            Analytics Supported:{' '}
            {debugInfo.analyticsSupported?.toString() || 'unknown'}
          </span>
        </div>

        <div>
          <span
            className={
              debugInfo.analyticsInitialized ? 'text-green-400' : 'text-red-400'
            }
          >
            {debugInfo.analyticsInitialized ? '✅' : '❌'}
          </span>
          <span className="ml-2">
            Analytics Init: {debugInfo.analyticsInitialized.toString()}
          </span>
        </div>

        <div>
          <span
            className={
              debugInfo.testEventSent ? 'text-green-400' : 'text-red-400'
            }
          >
            {debugInfo.testEventSent ? '✅' : '❌'}
          </span>
          <span className="ml-2">
            Test Event: {debugInfo.testEventSent?.toString() || 'unknown'}
          </span>
        </div>

        <div className="text-gray-400">
          <div>Domain: {debugInfo.environment.domain}</div>
        </div>

        {debugInfo.errors.length > 0 && (
          <div className="mt-2 p-2 bg-red-900 rounded">
            <div className="text-red-300 font-semibold">Errors:</div>
            {debugInfo.errors.map((error, index) => (
              <div key={index} className="text-red-200 text-xs mt-1">
                {error}
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="text-gray-500 text-xs mt-2">
        Press Ctrl+Shift+D to toggle
      </div>
    </div>
  );
}
