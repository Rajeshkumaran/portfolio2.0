import { logEvent } from 'firebase/analytics';
import { analytics } from './firebase';

// Track page views
export const trackPageView = (pageName: string, pageTitle?: string) => {
  if (analytics) {
    logEvent(analytics, 'page_view', {
      page_title: pageTitle || pageName,
      page_location: window.location.href,
      page_path: window.location.pathname,
    });
  }
};

// Track custom events
export const trackEvent = (
  eventName: string,
  parameters?: { [key: string]: any }
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
  if (analytics) {
    logEvent(analytics, 'click', {
      content_type: 'social_link',
      item_name: platform,
    });
  }
};

// Track section clicks (blogs, patents, projects)
export const trackSectionClick = (sectionName: string, itemName?: string) => {
  if (analytics) {
    logEvent(analytics, 'click', {
      content_type: 'section',
      section_name: sectionName,
      item_name: itemName,
    });
  }
};
