// TISZTA VÍZ — analytics scaffolding.
//
// Inactive by design: every ID below is null, so nothing loads and
// nothing is sent anywhere right now. To go live later, fill in the
// real IDs from your Google Analytics / Google Ads / Meta accounts —
// nothing else in this file or in main.js needs to change.

const ANALYTICS_CONFIG = {
  GA4_MEASUREMENT_ID: null,        // e.g. 'G-XXXXXXXXXX'
  GOOGLE_ADS_CONVERSION_ID: null,  // e.g. 'AW-XXXXXXXXX'
  GOOGLE_ADS_CONVERSION_LABEL: null, // e.g. 'AbCdEfGhIjKlMnOp'
  META_PIXEL_ID: null,             // e.g. '1234567890123456'
};

(function loadGoogleTag() {
  if (!ANALYTICS_CONFIG.GA4_MEASUREMENT_ID && !ANALYTICS_CONFIG.GOOGLE_ADS_CONVERSION_ID) return;

  window.dataLayer = window.dataLayer || [];
  window.gtag = function () { window.dataLayer.push(arguments); };
  window.gtag('js', new Date());

  const primaryId = ANALYTICS_CONFIG.GA4_MEASUREMENT_ID || ANALYTICS_CONFIG.GOOGLE_ADS_CONVERSION_ID;
  const script = document.createElement('script');
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtag/js?id=${primaryId}`;
  document.head.appendChild(script);

  if (ANALYTICS_CONFIG.GA4_MEASUREMENT_ID) {
    window.gtag('config', ANALYTICS_CONFIG.GA4_MEASUREMENT_ID);
  }
  if (ANALYTICS_CONFIG.GOOGLE_ADS_CONVERSION_ID) {
    window.gtag('config', ANALYTICS_CONFIG.GOOGLE_ADS_CONVERSION_ID);
  }
})();

(function loadMetaPixel() {
  if (!ANALYTICS_CONFIG.META_PIXEL_ID) return;

  !(function (f, b, e, v, n, t, s) {
    if (f.fbq) return; n = f.fbq = function () {
      n.callMethod ? n.callMethod.apply(n, arguments) : n.queue.push(arguments);
    };
    if (!f._fbq) f._fbq = n; n.push = n; n.loaded = !0; n.version = '2.0';
    n.queue = []; t = b.createElement(e); t.async = !0; t.src = v;
    s = b.getElementsByTagName(e)[0]; s.parentNode.insertBefore(t, s);
  })(window, document, 'script', 'https://connect.facebook.net/en_US/fbevents.js');

  window.fbq('init', ANALYTICS_CONFIG.META_PIXEL_ID);
  window.fbq('track', 'PageView');
})();

/* ---- Shared helpers, called from main.js — safe no-ops until IDs above are set ---- */
function trackEvent(eventName, params = {}) {
  if (typeof window.gtag === 'function') window.gtag('event', eventName, params);
  if (typeof window.fbq === 'function') window.fbq('trackCustom', eventName, params);
}

function trackFormConversion(formName) {
  trackEvent('generate_lead', { form_name: formName });

  if (typeof window.fbq === 'function') {
    window.fbq('track', 'Lead', { content_name: formName });
  }

  if (
    typeof window.gtag === 'function' &&
    ANALYTICS_CONFIG.GOOGLE_ADS_CONVERSION_ID &&
    ANALYTICS_CONFIG.GOOGLE_ADS_CONVERSION_LABEL
  ) {
    window.gtag('event', 'conversion', {
      send_to: `${ANALYTICS_CONFIG.GOOGLE_ADS_CONVERSION_ID}/${ANALYTICS_CONFIG.GOOGLE_ADS_CONVERSION_LABEL}`,
    });
  }
}
