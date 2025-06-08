/**
 * Mobile and PWA utility functions
 */

interface ExtendedDocument extends Document {
  webkitFullscreenElement?: Element;
  mozFullScreenElement?: Element;
  msFullscreenElement?: Element;
  webkitExitFullscreen?: () => Promise<void>;
  mozCancelFullScreen?: () => Promise<void>;
  msExitFullscreen?: () => Promise<void>;
}

interface ExtendedHTMLElement extends HTMLElement {
  webkitRequestFullscreen?: () => Promise<void>;
  mozRequestFullScreen?: () => Promise<void>;
  msRequestFullscreen?: () => Promise<void>;
}

/**
 * Prevents the default zoom behavior on iOS when double-tapping
 */
export function preventDoubleClickZoom(element: HTMLElement): () => void {
  let lastTouchEnd = 0;

  const handleTouchEnd = (event: TouchEvent) => {
    const now = new Date().getTime();
    if (now - lastTouchEnd <= 300) {
      event.preventDefault();
    }
    lastTouchEnd = now;
  };

  element.addEventListener("touchend", handleTouchEnd, { passive: false });

  return () => {
    element.removeEventListener("touchend", handleTouchEnd);
  };
}

/**
 * Handles safe area insets for devices with notches
 */
export function getSafeAreaInsets() {
  const style = getComputedStyle(document.documentElement);

  return {
    top: style.getPropertyValue("env(safe-area-inset-top)") || "0px",
    right: style.getPropertyValue("env(safe-area-inset-right)") || "0px",
    bottom: style.getPropertyValue("env(safe-area-inset-bottom)") || "0px",
    left: style.getPropertyValue("env(safe-area-inset-left)") || "0px",
  };
}

/**
 * Detects if the device is in landscape mode
 */
export function isLandscape(): boolean {
  return window.innerWidth > window.innerHeight;
}

/**
 * Detects if the device supports touch
 */
export function isTouchDevice(): boolean {
  return "ontouchstart" in window || navigator.maxTouchPoints > 0;
}

/**
 * Gets the device pixel ratio for high-DPI displays
 */
export function getDevicePixelRatio(): number {
  return window.devicePixelRatio || 1;
}

/**
 * Handles viewport height issues on mobile browsers
 */
export function setMobileViewportHeight(): () => void {
  const setVH = () => {
    const vh = window.innerHeight * 0.01;
    document.documentElement.style.setProperty("--vh", `${vh}px`);
  };

  setVH();
  window.addEventListener("resize", setVH);
  window.addEventListener("orientationchange", setVH);

  return () => {
    window.removeEventListener("resize", setVH);
    window.removeEventListener("orientationchange", setVH);
  };
}

/**
 * Prevents pull-to-refresh on mobile browsers
 */
export function preventPullToRefresh(): () => void {
  let startY = 0;

  const handleTouchStart = (e: TouchEvent) => {
    startY = e.touches[0].clientY;
  };

  const handleTouchMove = (e: TouchEvent) => {
    const currentY = e.touches[0].clientY;
    const isScrollingUp = currentY > startY;
    const isAtTop = window.scrollY === 0;

    if (isAtTop && isScrollingUp) {
      e.preventDefault();
    }
  };

  document.addEventListener("touchstart", handleTouchStart, { passive: true });
  document.addEventListener("touchmove", handleTouchMove, { passive: false });

  return () => {
    document.removeEventListener("touchstart", handleTouchStart);
    document.removeEventListener("touchmove", handleTouchMove);
  };
}

/**
 * Optimizes scrolling performance on mobile
 */
export function optimizeScrolling(element: HTMLElement): () => void {
  // Store original values
  const originalWebkitOverflowScrolling = element.style.webkitOverflowScrolling;
  const originalWillChange = element.style.willChange;

  // Add momentum scrolling for iOS
  // eslint-disable-next-line no-param-reassign
  element.style.webkitOverflowScrolling = "touch";

  // Improve scroll performance
  // eslint-disable-next-line no-param-reassign
  element.style.willChange = "scroll-position";

  const cleanup = () => {
    // eslint-disable-next-line no-param-reassign
    element.style.webkitOverflowScrolling = originalWebkitOverflowScrolling;
    // eslint-disable-next-line no-param-reassign
    element.style.willChange = originalWillChange;
  };

  return cleanup;
}

/**
 * Handles keyboard visibility on mobile devices
 */
export function handleMobileKeyboard(): () => void {
  const initialViewportHeight = window.innerHeight;

  const handleResize = () => {
    const currentHeight = window.innerHeight;
    const heightDifference = initialViewportHeight - currentHeight;

    // If height decreased significantly, keyboard is likely open
    if (heightDifference > 150) {
      document.body.classList.add("keyboard-open");
    } else {
      document.body.classList.remove("keyboard-open");
    }
  };

  window.addEventListener("resize", handleResize);

  return () => {
    window.removeEventListener("resize", handleResize);
    document.body.classList.remove("keyboard-open");
  };
}

/**
 * Adds haptic feedback on supported devices
 */
export function hapticFeedback(
  type: "light" | "medium" | "heavy" = "light",
): void {
  if ("vibrate" in navigator) {
    const patterns = {
      light: [10],
      medium: [20],
      heavy: [30],
    };
    navigator.vibrate(patterns[type]);
  }
}

/**
 * Checks if the app is running in fullscreen mode
 */
export function isFullscreen(): boolean {
  const doc = document as ExtendedDocument;
  return !!(
    doc.fullscreenElement ||
    doc.webkitFullscreenElement ||
    doc.mozFullScreenElement ||
    doc.msFullscreenElement
  );
}

/**
 * Requests fullscreen mode
 */
export async function requestFullscreen(
  element: HTMLElement = document.documentElement,
): Promise<void> {
  try {
    const el = element as ExtendedHTMLElement;
    if (el.requestFullscreen) {
      await el.requestFullscreen();
    } else if (el.webkitRequestFullscreen) {
      await el.webkitRequestFullscreen();
    } else if (el.mozRequestFullScreen) {
      await el.mozRequestFullScreen();
    } else if (el.msRequestFullscreen) {
      await el.msRequestFullscreen();
    }
  } catch (error) {
    // eslint-disable-next-line no-console
    console.warn("Failed to enter fullscreen mode:", error);
  }
}

/**
 * Exits fullscreen mode
 */
export async function exitFullscreen(): Promise<void> {
  try {
    const doc = document as ExtendedDocument;
    if (doc.exitFullscreen) {
      await doc.exitFullscreen();
    } else if (doc.webkitExitFullscreen) {
      await doc.webkitExitFullscreen();
    } else if (doc.mozCancelFullScreen) {
      await doc.mozCancelFullScreen();
    } else if (doc.msExitFullscreen) {
      await doc.msExitFullscreen();
    }
  } catch (error) {
    // eslint-disable-next-line no-console
    console.warn("Failed to exit fullscreen mode:", error);
  }
}
