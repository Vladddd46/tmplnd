/**
 * MMA Kids Landing — main.js
 * Meta Ads → Landing → Telegram bot → Lead
 *
 * Config lives in js/config.js (TELEGRAM_BOT_URL, META_PIXEL_ID).
 */

function getConfig() {
  return window.SITE_CONFIG || {};
}

function getTelegramBotUrl() {
  return getConfig().TELEGRAM_BOT_URL || "https://t.me/YOUR_BOT_USERNAME?start=mma_meta";
}

function getMetaPixelId() {
  return getConfig().META_PIXEL_ID || "YOUR_META_PIXEL_ID";
}

const TRAFFIC_STORAGE_KEY = "mma_traffic_source";
const TRAFFIC_PARAMS = [
  "utm_source",
  "utm_medium",
  "utm_campaign",
  "utm_content",
  "utm_term",
  "fbclid",
];

/* --------------------------------------------
   Traffic source capture & sessionStorage
--------------------------------------------- */
function saveTrafficSource() {
  try {
    const params = new URLSearchParams(window.location.search);
    const incoming = {};

    TRAFFIC_PARAMS.forEach(function (key) {
      const value = params.get(key);
      if (value) {
        incoming[key] = value;
      }
    });

    if (Object.keys(incoming).length === 0) {
      return getTrafficSource();
    }

    const existing = getTrafficSource();
    const merged = Object.assign({}, existing, incoming);
    sessionStorage.setItem(TRAFFIC_STORAGE_KEY, JSON.stringify(merged));
    return merged;
  } catch (error) {
    console.debug("Unable to save traffic source", error);
    return {};
  }
}

function getTrafficSource() {
  try {
    const raw = sessionStorage.getItem(TRAFFIC_STORAGE_KEY);
    if (!raw) {
      return {};
    }
    const parsed = JSON.parse(raw);
    return parsed && typeof parsed === "object" ? parsed : {};
  } catch (error) {
    console.debug("Unable to read traffic source", error);
    return {};
  }
}

/* --------------------------------------------
   5. Meta Pixel tracking (defensive)
--------------------------------------------- */
function isPixelReady() {
  return typeof window.fbq === "function";
}

function trackTelegramClick() {
  if (!isPixelReady()) {
    return;
  }

  try {
    fbq("track", "Contact", {
      content_name: "MMA Kids Telegram CTA",
    });

    fbq("trackCustom", "TelegramClick", {
      source: "landing_page",
    });

    // Do NOT fire Lead here.
    // A real Lead should be sent later via Meta Conversions API
    // after the user completes the application in Telegram.
  } catch (error) {
    console.debug("Meta Pixel tracking failed", error);
  }
}

/* --------------------------------------------
   4. Telegram CTA setup
--------------------------------------------- */
function setupTelegramLinks() {
  const telegramUrl = getTelegramBotUrl();
  const links = document.querySelectorAll(".telegram-cta");

  links.forEach(function (link) {
    link.setAttribute("href", telegramUrl);

    link.addEventListener("click", function () {
      trackTelegramClick();

      console.debug("Telegram CTA clicked", {
        cta: link.getAttribute("data-cta") || "unknown",
        trafficSource: getTrafficSource(),
        telegramUrl: telegramUrl,
        metaPixelId: getMetaPixelId(),
      });
    });
  });
}

/* --------------------------------------------
   6. IntersectionObserver animations
--------------------------------------------- */
function setupScrollAnimations() {
  const prefersReducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;

  const elements = document.querySelectorAll(".reveal");

  function showAll() {
    elements.forEach(function (el) {
      el.classList.add("is-visible");
    });
  }

  if (prefersReducedMotion || !("IntersectionObserver" in window)) {
    showAll();
    return;
  }

  // Arm hide-until-visible only after we can reveal in-view items
  document.documentElement.classList.add("anim-ready");

  const observer = new IntersectionObserver(
    function (entries, obs) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          obs.unobserve(entry.target);
        }
      });
    },
    {
      rootMargin: "0px 0px -40px 0px",
      threshold: 0.01,
    }
  );

  elements.forEach(function (el) {
    const rect = el.getBoundingClientRect();
    const inView = rect.top < window.innerHeight && rect.bottom > 0;
    if (inView) {
      el.classList.add("is-visible");
    } else {
      observer.observe(el);
    }
  });

  // Safety net: never leave content invisible
  window.setTimeout(showAll, 1200);
}

/* --------------------------------------------
   7. Sticky mobile CTA visibility
--------------------------------------------- */
function setupStickyCTA() {
  const sticky = document.getElementById("sticky-cta");
  if (!sticky) {
    return;
  }

  // Show only on mobile viewports
  const mobileQuery = window.matchMedia("(max-width: 767px)");

  function updateVisibility() {
    if (!mobileQuery.matches) {
      sticky.hidden = true;
      sticky.classList.remove("is-visible");
      return;
    }

    sticky.hidden = false;
    const hero = document.querySelector(".hero");
    const threshold = hero ? Math.max(220, hero.offsetHeight * 0.55) : 260;
    const scrolled = window.scrollY || document.documentElement.scrollTop;
    if (scrolled > threshold) {
      sticky.classList.add("is-visible");
    } else {
      sticky.classList.remove("is-visible");
    }
  }

  updateVisibility();
  window.addEventListener("scroll", updateVisibility, { passive: true });

  if (typeof mobileQuery.addEventListener === "function") {
    mobileQuery.addEventListener("change", updateVisibility);
  } else if (typeof mobileQuery.addListener === "function") {
    mobileQuery.addListener(updateVisibility);
  }
}

/* --------------------------------------------
   Init
--------------------------------------------- */
function init() {
  saveTrafficSource();
  setupTelegramLinks();
  setupScrollAnimations();
  setupStickyCTA();
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", init);
} else {
  init();
}
