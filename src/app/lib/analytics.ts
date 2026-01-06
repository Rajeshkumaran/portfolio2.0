import { logEvent } from 'firebase/analytics';
import { analytics } from './firebase';

// Track page views
export const trackPageView = (pageName: string, pageTitle?: string) => {
  console.log('📊 Attempting to track page view:', {
    pageName,
    pageTitle,
    analyticsExists: !!analytics,
  });
  if (analytics) {
    logEvent(analytics, 'page_view', {
      page_title: pageTitle || pageName,
      page_location: window.location.href,
      page_path: window.location.pathname,
    });
    console.log('✅ Page view tracked successfully');
  } else {
    console.log('❌ Analytics not initialized, page view not tracked');
  }
};

// Track custom events
export const trackEvent = (
  eventName: string,
  parameters?: { [key: string]: unknown }
) => {
  if (analytics) {
    logEvent(analytics, eventName, parameters);
  }
};

// Track button/link clicks
export const trackClick = (elementName: string, elementType?: string) => {
  if (analytics) {
    logEvent(analytics, 'click', {
      content_type: elementType || 'button',
      item_id: elementName,
    });
  }
};

// Track social media clicks
export const trackSocialClick = (platform: string) => {
  console.log('📊 Attempting to track social click:', {
    platform,
    analyticsExists: !!analytics,
  });
  if (analytics) {
    logEvent(analytics, 'click', {
      content_type: 'social_link',
      item_name: platform,
    });
    console.log('✅ Social click tracked successfully');
  } else {
    console.log('❌ Analytics not initialized, social click not tracked');
  }
};

// Track section clicks (blogs, patents, projects)
export const trackSectionClick = (sectionName: string, itemName?: string) => {
  console.log('📊 Attempting to track section click:', {
    sectionName,
    itemName,
    analyticsExists: !!analytics,
  });
  if (analytics) {
    logEvent(analytics, 'click', {
      content_type: 'section',
      section_name: sectionName,
      item_name: itemName,
    });
    console.log('✅ Section click tracked successfully');
  } else {
    console.log('❌ Analytics not initialized, section click not tracked');
  }
};
