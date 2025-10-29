import { useState } from "react";
import PropTypes from "prop-types";

/**
 * Safe Image component for iOS webview compatibility
 * Handles image loading errors gracefully without crashing the app
 */
const SafeImage = ({
  src,
  alt,
  fallbackSrc = null,
  className = "",
  onError = null,
  ...props
}) => {
  const [imgSrc, setImgSrc] = useState(src);
  const [hasError, setHasError] = useState(false);

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
      src={imgSrc}
      alt={alt}
      className={className}
      onError={handleError}
      onLoad={handleLoad}
      loading="lazy"
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
};

export default SafeImage;
