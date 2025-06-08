import { useEffect, useState } from "react";

interface PWADetection {
  isPWA: boolean;
  isMobile: boolean;
  isStandalone: boolean;
  canInstall: boolean;
}

export function usePWADetection(): PWADetection {
  const [detection, setDetection] = useState<PWADetection>({
    isPWA: false,
    isMobile: false,
    isStandalone: false,
    canInstall: false,
  });

  useEffect(() => {
    const checkPWAStatus = () => {
      // Check if running in standalone mode (PWA)
      const isStandalone =
        window.matchMedia("(display-mode: standalone)").matches ||
        (window.navigator as { standalone?: boolean }).standalone === true ||
        document.referrer.includes("android-app://");

      // Check if mobile device
      const isMobile =
        /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
          navigator.userAgent,
        ) || window.innerWidth <= 768;

      // Check if PWA (has service worker support and manifest)
      const isPWA = "serviceWorker" in navigator && "PushManager" in window;

      // Check if can install (beforeinstallprompt event support)
      const canInstall = "onbeforeinstallprompt" in window;

      setDetection({
        isPWA,
        isMobile,
        isStandalone,
        canInstall,
      });
    };

    checkPWAStatus();

    // Listen for display mode changes
    const mediaQuery = window.matchMedia("(display-mode: standalone)");
    const handleChange = () => checkPWAStatus();

    if (mediaQuery.addEventListener) {
      mediaQuery.addEventListener("change", handleChange);
    } else {
      // Fallback for older browsers
      mediaQuery.addListener(handleChange);
    }

    // Listen for resize events to update mobile detection
    window.addEventListener("resize", checkPWAStatus);

    return () => {
      if (mediaQuery.removeEventListener) {
        mediaQuery.removeEventListener("change", handleChange);
      } else {
        mediaQuery.removeListener(handleChange);
      }
      window.removeEventListener("resize", checkPWAStatus);
    };
  }, []);

  return detection;
}

export function useIsMobile(): boolean {
  const { isMobile } = usePWADetection();
  return isMobile;
}

export function useIsStandalone(): boolean {
  const { isStandalone } = usePWADetection();
  return isStandalone;
}

export function useCanInstallPWA(): boolean {
  const { canInstall } = usePWADetection();
  return canInstall;
}
