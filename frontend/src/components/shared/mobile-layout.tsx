import React from "react";
import { cn } from "@heroui/react";
import { useIsMobile, useIsStandalone } from "../../hooks/use-pwa-detection";

interface MobileLayoutProps {
  children: React.ReactNode;
  className?: string;
  enableSafeArea?: boolean;
  fullHeight?: boolean;
}

export function MobileLayout({
  children,
  className,
  enableSafeArea = true,
  fullHeight = false,
}: MobileLayoutProps) {
  const isMobile = useIsMobile();
  const isStandalone = useIsStandalone();

  const layoutClasses = cn(
    "w-full",
    {
      // Mobile-specific styles
      "min-h-screen": fullHeight && isMobile,
      "h-screen": fullHeight && isMobile && isStandalone,

      // Safe area support for devices with notches
      "safe-area-top": enableSafeArea && isMobile,
      "safe-area-bottom": enableSafeArea && isMobile,
      "safe-area-left": enableSafeArea && isMobile,
      "safe-area-right": enableSafeArea && isMobile,

      // PWA standalone mode optimizations
      "select-none": isStandalone,
      "overflow-hidden": isStandalone && fullHeight,
    },
    className,
  );

  return <div className={layoutClasses}>{children}</div>;
}

interface MobileContainerProps {
  children: React.ReactNode;
  className?: string;
  padding?: "none" | "sm" | "md" | "lg";
}

export function MobileContainer({
  children,
  className,
  padding = "md",
}: MobileContainerProps) {
  const isMobile = useIsMobile();

  const paddingClasses = {
    none: "",
    sm: isMobile ? "p-2" : "p-4",
    md: isMobile ? "p-4" : "p-6",
    lg: isMobile ? "p-6" : "p-8",
  };

  return (
    <div className={cn("w-full", paddingClasses[padding], className)}>
      {children}
    </div>
  );
}

interface MobileTouchTargetProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  disabled?: boolean;
}

export function MobileTouchTarget({
  children,
  className,
  onClick,
  disabled = false,
}: MobileTouchTargetProps) {
  const isMobile = useIsMobile();

  return (
    <div
      className={cn(
        "cursor-pointer",
        {
          // Ensure minimum touch target size on mobile
          "min-h-[44px] min-w-[44px] flex items-center justify-center":
            isMobile,
          "opacity-50 cursor-not-allowed": disabled,
          "active:opacity-70 transition-opacity": !disabled && isMobile,
        },
        className,
      )}
      onClick={disabled ? undefined : onClick}
      role={onClick ? "button" : undefined}
      tabIndex={onClick && !disabled ? 0 : undefined}
      onKeyDown={
        onClick && !disabled
          ? (e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                onClick();
              }
            }
          : undefined
      }
    >
      {children}
    </div>
  );
}
