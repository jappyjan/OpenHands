import { useEffect } from "react";
import {
  setMobileViewportHeight,
  preventPullToRefresh,
  handleMobileKeyboard,
  preventDoubleClickZoom,
} from "../utils/mobile-utils";
import { useIsMobile } from "./use-pwa-detection";

interface MobileOptimizationOptions {
  preventZoom?: boolean;
  preventPullToRefresh?: boolean;
  handleKeyboard?: boolean;
  setViewportHeight?: boolean;
}

export function useMobileOptimizations(
  options: MobileOptimizationOptions = {},
) {
  const isMobile = useIsMobile();

  const {
    preventZoom = true,
    preventPullToRefresh: preventPull = true,
    handleKeyboard = true,
    setViewportHeight = true,
  } = options;

  useEffect(() => {
    if (!isMobile) {
      return undefined;
    }

    const cleanupFunctions: (() => void)[] = [];

    // Prevent double-click zoom
    if (preventZoom) {
      const cleanup = preventDoubleClickZoom(document.body);
      cleanupFunctions.push(cleanup);
    }

    // Prevent pull-to-refresh
    if (preventPull) {
      const cleanup = preventPullToRefresh();
      cleanupFunctions.push(cleanup);
    }

    // Handle mobile keyboard
    if (handleKeyboard) {
      const cleanup = handleMobileKeyboard();
      cleanupFunctions.push(cleanup);
    }

    // Set mobile viewport height
    if (setViewportHeight) {
      const cleanup = setMobileViewportHeight();
      cleanupFunctions.push(cleanup);
    }

    return () => {
      cleanupFunctions.forEach((cleanup) => cleanup());
    };
  }, [isMobile, preventZoom, preventPull, handleKeyboard, setViewportHeight]);
}
