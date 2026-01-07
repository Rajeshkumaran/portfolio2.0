import { logEvent } from 'firebase/analytics';
import { getFirebaseAnalytics } from './firebase';

// Track page views
export const trackPageView = async (pageName: string, pageTitle?: string) => {
  try {
    const analytics = await getFirebaseAnalytics();

    if (!analytics) {
      return false;
    }

    await logEvent(analytics, 'page_view', {
      page_title: pageTitle || pageName,
      page_location: typeof window !== 'undefined' ? window.location.href : '',
      page_path:
        typeof window !== 'undefined' ? window.location.pathname : pageName,
      custom_page_name: pageName,
    });
    return true;
  } catch {
    return false;
  }
};

// Track custom events
export const trackEvent = async (
  eventName: string,
  parameters?: { [key: string]: unknown }
) => {
  try {
    const analytics = await getFirebaseAnalytics();

    if (!analytics) {
      return false;
    }

    await logEvent(analytics, eventName, {
      ...parameters,
      event_timestamp: new Date().toISOString(),
    });

    return true;
  } catch {
    return false;
  }
};

// Track button/link clicks
export const trackClick = async (elementName: string, elementType?: string) => {
  try {
    const analytics = await getFirebaseAnalytics();

    if (!analytics) {
      return false;
    }

    await logEvent(analytics, 'click', {
      content_type: elementType || 'button',
      item_id: elementName,
      click_timestamp: new Date().toISOString(),
    });

    return true;
  } catch {
    return false;
  }
};

// Track social media clicks
export const trackSocialClick = async (platform: string) => {
  try {
    const analytics = await getFirebaseAnalytics();

    if (!analytics) {
      return false;
    }

    await logEvent(analytics, 'click', {
      content_type: 'social_link',
      item_name: platform,
      click_timestamp: new Date().toISOString(),
    });
    return true;
  } catch {
    return false;
  }
};

// Track section clicks (blogs, patents, projects)
export const trackSectionClick = async (
  sectionName: string,
  itemName?: string
) => {
  try {
    const analytics = await getFirebaseAnalytics();

    if (!analytics) {
      return false;
    }

    await logEvent(analytics, 'click', {
      content_type: 'section',
      section_name: sectionName,
      item_name: itemName || 'unknown',
      click_timestamp: new Date().toISOString(),
    });
    return true;
  } catch {
    return false;
  }
};
