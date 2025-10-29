import { useState, useEffect, useRef } from "react";
import PropTypes from "prop-types";

/**
 * Safe Image component for iOS webview compatibility
 * Handles image loading errors gracefully without crashing the app
 * Uses Intersection Observer for better lazy loading on iOS
 */
const SafeImage = ({
  src,
  alt,
  fallbackSrc = null,
  className = "",
  onError = null,
  useIntersectionObserver = true,
  ...props
}) => {
  const [imgSrc, setImgSrc] = useState(useIntersectionObserver ? null : src);
  const [hasError, setHasError] = useState(false);
  const imgRef = useRef(null);

  // Intersection Observer for better lazy loading
  useEffect(() => {
    if (!useIntersectionObserver) return;

    const currentRef = imgRef.current;
    if (!currentRef) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setImgSrc(src);
            // Stop observing once loaded
            observer.unobserve(entry.target);
          }
        });
      },
      {
        rootMargin: "50px", // Start loading 50px before element enters viewport
        threshold: 0.01,
      }
    );

    observer.observe(currentRef);

    return () => {
      if (currentRef) {
        observer.unobserve(currentRef);
      }
    };
  }, [src, useIntersectionObserver]);

  const handleError = (e) => {
    if (!hasError) {
      setHasError(true);

      if (fallbackSrc) {
        setImgSrc(fallbackSrc);
      } else {
        // Hide image on error if no fallback
        e.target.style.display = "none";
      }

      if (onError) {
        onError(e);
      }
    }
  };

  const handleLoad = () => {
    // Image loaded successfully, reset error state
    setHasError(false);
  };

  return (
    <img
      ref={imgRef}
      src={
        imgSrc ||
        "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7"
      }
      alt={alt}
      className={className}
      onError={handleError}
      onLoad={handleLoad}
      loading="lazy"
      decoding="async"
      {...props}
    />
  );
};

SafeImage.propTypes = {
  src: PropTypes.string.isRequired,
  alt: PropTypes.string.isRequired,
  fallbackSrc: PropTypes.string,
  className: PropTypes.string,
  onError: PropTypes.func,
  useIntersectionObserver: PropTypes.bool,
};

export default SafeImage;
