import { logEvent } from 'firebase/analytics';
import { getFirebaseAnalytics } from './firebase';

// Wait for analytics to be ready with timeout
const waitForAnalytics = (timeout = 3000): Promise<boolean> => {
  return new Promise((resolve) => {
    const startTime = Date.now();
    const checkAnalytics = async () => {
      const analytics = await getFirebaseAnalytics();
      if (analytics) {
        console.log('✅ Analytics ready after', Date.now() - startTime, 'ms');
        resolve(true);
      } else if (Date.now() - startTime > timeout) {
        console.log('⏰ Analytics timeout after', timeout, 'ms');
        resolve(false);
      } else {
        setTimeout(checkAnalytics, 100);
      }
    };

    checkAnalytics();
  });
};

// Track page views
export const trackPageView = async (pageName: string, pageTitle?: string) => {
  const analytics = await getFirebaseAnalytics();
  console.log('📊 Attempting to track page view:', {
    pageName,
    pageTitle,
    analyticsExists: !!analytics,
  });

  // Wait for analytics to be ready
  const analyticsReady = await waitForAnalytics();

  if (analytics && analyticsReady) {
    logEvent(analytics, 'page_view', {
      page_title: pageTitle || pageName,
      page_location: window.location.href,
      page_path: window.location.pathname,
    });
    console.log('✅ Page view tracked successfully');
  } else {
    console.log('❌ Analytics not ready, page view not tracked');
  }
};

// Track custom events
export const trackEvent = async (
  eventName: string,
  parameters?: { [key: string]: unknown }
) => {
  const analytics = await getFirebaseAnalytics();

  if (analytics) {
    logEvent(analytics, eventName, parameters);
  }
};

// Track button/link clicks
export const trackClick = async (elementName: string, elementType?: string) => {
  const analytics = await getFirebaseAnalytics();

  if (analytics) {
    logEvent(analytics, 'click', {
      content_type: elementType || 'button',
      item_id: elementName,
    });
  }
};

// Track social media clicks
export const trackSocialClick = async (platform: string) => {
  const analytics = await getFirebaseAnalytics();

  console.log('📊 Attempting to track social click:', {
    platform,
    analyticsExists: !!analytics,
  });

  // Wait for analytics to be ready
  const analyticsReady = await waitForAnalytics();

  if (analytics && analyticsReady) {
    logEvent(analytics, 'click', {
      content_type: 'social_link',
      item_name: platform,
    });
    console.log('✅ Social click tracked successfully');
  } else {
    console.log('❌ Analytics not ready, social click not tracked');
  }
};

// Track section clicks (blogs, patents, projects)
export const trackSectionClick = async (
  sectionName: string,
  itemName?: string
) => {
  const analytics = await getFirebaseAnalytics();

  console.log('📊 Attempting to track section click:', {
    sectionName,
    itemName,
    analyticsExists: !!analytics,
  });

  // Wait for analytics to be ready
  const analyticsReady = await waitForAnalytics();

  if (analytics && analyticsReady) {
    logEvent(analytics, 'click', {
      content_type: 'section',
      section_name: sectionName,
      item_name: itemName,
    });
    console.log('✅ Section click tracked successfully');
  } else {
    console.log('❌ Analytics not ready, section click not tracked');
  }
};

// Test function to verify analytics is working
export const testAnalytics = async () => {
  const analytics = await getFirebaseAnalytics();

  console.log('🧪 Testing analytics...');

  // Wait for analytics to be ready
  const analyticsReady = await waitForAnalytics();

  if (analytics && analyticsReady) {
    logEvent(analytics, 'test_event', {
      test_parameter: 'analytics_working',
      timestamp: new Date().toISOString(),
    });
    console.log('✅ Test event sent successfully');
    return true;
  } else {
    console.log('❌ Analytics not ready for testing');
    return false;
  }
};
