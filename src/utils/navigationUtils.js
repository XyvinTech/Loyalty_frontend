// utils/navigationUtils.js
import { useNavigate, useSearchParams } from "react-router-dom";
import { useCustomerAuth } from "../hooks/useCustomerAuth";

/**
 * Custom hook for navigation with parameter preservation
 * Preserves customerID, apiKey, and name parameters across navigation
 */
export const useNavigationWithParams = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { customerID, apiKey } = useCustomerAuth();

  /**
   * Get current navigation URL with preserved parameters
   * @param {string} basePath - The base path to navigate to
   * @param {object} additionalState - Additional state to pass with navigation
   * @returns {object} Object containing url and state
   */
  const getNavigationUrl = (basePath, additionalState = null) => {
    const currentParams = new URLSearchParams();
    
    // Get parameters from URL first, then fall back to auth context
    const urlCustomerID = searchParams.get("customerID") || customerID;
    const urlApiKey = searchParams.get("apiKey") || apiKey;
    const urlName = searchParams.get("name");

    if (urlCustomerID && urlApiKey) {
      currentParams.set("customerID", urlCustomerID);
      currentParams.set("apiKey", urlApiKey);
    }
    if (urlName) {
      currentParams.set("name", urlName);
    }

    const url = currentParams.toString()
      ? `${basePath}?${currentParams.toString()}`
      : basePath;

    return { url, state: additionalState };
  };

  /**
   * Navigate to a path while preserving current parameters
   * @param {string} basePath - The base path to navigate to
   * @param {object} additionalState - Additional state to pass with navigation
   */
  const navigateWithParams = (basePath, additionalState = null) => {
    const { url, state } = getNavigationUrl(basePath, additionalState);
    if (state) {
      navigate(url, { state });
    } else {
      navigate(url);
    }
  };

  /**
   * Get preserved parameters as an object
   * @returns {object} Object containing preserved parameters
   */
  const getPreservedParams = () => {
    return {
      customerID: searchParams.get("customerID") || customerID,
      apiKey: searchParams.get("apiKey") || apiKey,
      name: searchParams.get("name")
    };
  };

  return {
    navigateWithParams,
    getNavigationUrl,
    getPreservedParams
  };
};