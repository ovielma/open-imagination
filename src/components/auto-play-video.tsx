"use client";

import { useRef, forwardRef } from "react";
import { useInViewAutoplay } from "@/hooks/useInViewAutoplay";

interface AutoPlayVideoProps extends React.ComponentPropsWithoutRef<"video"> {
  onRefSet?: (element: HTMLVideoElement | null) => void;
}

export const AutoPlayVideo = forwardRef<HTMLVideoElement, AutoPlayVideoProps>(
  ({ onRefSet, children, ...props }, externalRef) => {
    const internalRef = useRef<HTMLVideoElement | null>(null);
    
    // Use the hook for in-view autoplay
    useInViewAutoplay(internalRef);
    
    const setRefs = (element: HTMLVideoElement | null) => {
      internalRef.current = element;
      
      // Set external ref if provided
      if (typeof externalRef === 'function') {
        externalRef(element);
      } else if (externalRef) {
        externalRef.current = element;
      }
      
      // Call the callback if provided
      if (onRefSet) {
        onRefSet(element);
      }
    };
    
    return (
      <video ref={setRefs} {...props}>
        {children}
      </video>
    );
  }
);

AutoPlayVideo.displayName = "AutoPlayVideo";
