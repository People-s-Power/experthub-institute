// lib/gtag.js
export const GA_MEASUREMENT_ID = 'G-KKVTDS2T71'; // Replace with your ID

export const pageview = (url: string) => {
  if (typeof window !== 'undefined') {
    window.gtag?.('config', GA_MEASUREMENT_ID, {
      page_path: url,
    });
  }
};

export const event = ({
  action,
  category,
  label,
  value,
}: {
  action: string;
  category: string;
  label: string;
  value: string;
}) => {
  if (typeof window !== 'undefined') {
    window.gtag?.('event', action, {
      event_category: category,
      event_label: label,
      value,
    });
  }
};

declare global {
  interface Window {
    gtag?: (...args: any[]) => void;
  }
}