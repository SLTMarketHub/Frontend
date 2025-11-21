/**
 * Image Utilities for Placeholder Images
 * Provides data URI placeholders instead of external URLs
 */

/**
 * Generate a simple colored square as data URI
 * @param {number} size - Size in pixels (square)
 * @param {string} color - Hex color (e.g., '00A651')
 * @returns {string} Data URI
 */
export const generatePlaceholder = (size = 50, color = '00A651') => {
  // SVG placeholder with centered icon
  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">
      <rect width="${size}" height="${size}" fill="#${color}"/>
      <path d="M${size/2-8} ${size/2-5} h16 v10 h-16 z" fill="white" opacity="0.5"/>
      <circle cx="${size/2}" cy="${size/2-10}" r="4" fill="white" opacity="0.5"/>
    </svg>
  `.trim();
  
  return `data:image/svg+xml;base64,${btoa(svg)}`;
};

/**
 * Generate a banner placeholder with text
 * @param {number} width - Width in pixels
 * @param {number} height - Height in pixels
 * @param {string} text - Text to display
 * @param {string} bgColor - Background hex color
 * @param {string} textColor - Text hex color
 * @returns {string} Data URI
 */
export const generateBannerPlaceholder = (width = 1200, height = 400, text = 'Banner', bgColor = '00A651', textColor = 'FFFFFF') => {
  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">
      <rect width="${width}" height="${height}" fill="#${bgColor}"/>
      <text x="50%" y="50%" font-family="Arial, sans-serif" font-size="48" fill="#${textColor}" text-anchor="middle" dominant-baseline="middle">
        ${text}
      </text>
    </svg>
  `.trim();
  
  return `data:image/svg+xml;base64,${btoa(svg)}`;
};

/**
 * Get product placeholder image
 */
export const PRODUCT_PLACEHOLDER = generatePlaceholder(50, 'E5E7EB');

/**
 * Get banner placeholder image
 */
export const BANNER_PLACEHOLDER = generateBannerPlaceholder(800, 400, 'Banner Image', 'E5E7EB', '6B7280');

export default {
  generatePlaceholder,
  generateBannerPlaceholder,
  PRODUCT_PLACEHOLDER,
  BANNER_PLACEHOLDER,
};
