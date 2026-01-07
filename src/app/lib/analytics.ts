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
  try {
    console.log('📊 Attempting to track page view:', {
      pageName,
      pageTitle,
      userAgent:
        typeof window !== 'undefined' ? window.navigator.userAgent : 'SSR',
      location: typeof window !== 'undefined' ? window.location.href : 'SSR',
    });

    const analytics = await getFirebaseAnalytics();

    if (!analytics) {
      console.log('❌ Analytics not available, page view not tracked');
      return false;
    }

    // Wait for analytics to be ready with a shorter timeout for page views
    const analyticsReady = await waitForAnalytics(2000);

    if (analyticsReady) {
      await logEvent(analytics, 'page_view', {
        page_title: pageTitle || pageName,
        page_location:
          typeof window !== 'undefined' ? window.location.href : '',
        page_path:
          typeof window !== 'undefined' ? window.location.pathname : pageName,
        custom_page_name: pageName,
      });
      console.log('✅ Page view tracked successfully');
      return true;
    } else {
      console.log(
        '❌ Analytics not ready within timeout, page view not tracked'
      );
      return false;
    }
  } catch (error) {
    console.error('❌ Error tracking page view:', error);
    return false;
  }
};

// Track custom events
export const trackEvent = async (
  eventName: string,
  parameters?: { [key: string]: unknown }
) => {
  try {
    console.log('📊 Attempting to track custom event:', {
      eventName,
      parameters,
      timestamp: new Date().toISOString(),
    });

    const analytics = await getFirebaseAnalytics();

    if (!analytics) {
      console.log('❌ Analytics not available, custom event not tracked');
      return false;
    }

    await logEvent(analytics, eventName, {
      ...parameters,
      event_timestamp: new Date().toISOString(),
    });

    console.log('✅ Custom event tracked successfully');
    return true;
  } catch (error) {
    console.error('❌ Error tracking custom event:', error);
    return false;
  }
};

// Track button/link clicks
export const trackClick = async (elementName: string, elementType?: string) => {
  try {
    console.log('📊 Attempting to track click:', {
      elementName,
      elementType,
      timestamp: new Date().toISOString(),
    });

    const analytics = await getFirebaseAnalytics();

    if (!analytics) {
      console.log('❌ Analytics not available, click not tracked');
      return false;
    }

    await logEvent(analytics, 'click', {
      content_type: elementType || 'button',
      item_id: elementName,
      click_timestamp: new Date().toISOString(),
    });

    console.log('✅ Click tracked successfully');
    return true;
  } catch (error) {
    console.error('❌ Error tracking click:', error);
    return false;
  }
};

// Track social media clicks
export const trackSocialClick = async (platform: string) => {
  try {
    console.log('📊 Attempting to track social click:', {
      platform,
      timestamp: new Date().toISOString(),
    });

    const analytics = await getFirebaseAnalytics();

    if (!analytics) {
      console.log('❌ Analytics not available, social click not tracked');
      return false;
    }

    // Wait for analytics to be ready
    const analyticsReady = await waitForAnalytics();

    if (analyticsReady) {
      await logEvent(analytics, 'click', {
        content_type: 'social_link',
        item_name: platform,
        click_timestamp: new Date().toISOString(),
      });
      console.log('✅ Social click tracked successfully');
      return true;
    } else {
      console.log('❌ Analytics not ready, social click not tracked');
      return false;
    }
  } catch (error) {
    console.error('❌ Error tracking social click:', error);
    return false;
  }
};

// Track section clicks (blogs, patents, projects)
export const trackSectionClick = async (
  sectionName: string,
  itemName?: string
) => {
  try {
    console.log('📊 Attempting to track section click:', {
      sectionName,
      itemName,
      timestamp: new Date().toISOString(),
    });

    const analytics = await getFirebaseAnalytics();

    if (!analytics) {
      console.log('❌ Analytics not available, section click not tracked');
      return false;
    }

    // Wait for analytics to be ready
    const analyticsReady = await waitForAnalytics();

    if (analyticsReady) {
      await logEvent(analytics, 'click', {
        content_type: 'section',
        section_name: sectionName,
        item_name: itemName || 'unknown',
        click_timestamp: new Date().toISOString(),
      });
      console.log('✅ Section click tracked successfully');
      return true;
    } else {
      console.log('❌ Analytics not ready, section click not tracked');
      return false;
    }
  } catch (error) {
    console.error('❌ Error tracking section click:', error);
    return false;
  }
};

// Test function to verify analytics is working
export const testAnalytics = async () => {
  try {
    console.log('🧪 Testing analytics...');

    const analytics = await getFirebaseAnalytics();

    if (!analytics) {
      console.log('❌ Analytics not available for testing');
      return false;
    }

    // Wait for analytics to be ready
    const analyticsReady = await waitForAnalytics();

    if (analyticsReady) {
      await logEvent(analytics, 'test_event', {
        test_parameter: 'analytics_working',
        timestamp: new Date().toISOString(),
        user_agent:
          typeof window !== 'undefined'
            ? window.navigator.userAgent
            : 'unknown',
        page_url:
          typeof window !== 'undefined' ? window.location.href : 'unknown',
      });
      console.log('✅ Test event sent successfully');
      return true;
    } else {
      console.log('❌ Analytics not ready for testing');
      return false;
    }
  } catch (error) {
    console.error('❌ Error during analytics test:', error);
    return false;
  }
};
