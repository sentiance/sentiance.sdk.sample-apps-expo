// Replace with the URL of your backend that provides authentication codes.
// See: https://github.com/sentiance/sample-apps-api
export default {
  BASE_URL: 'https://your-backend.example.com',
  // Optional: set to your Sentiance platform URL, or leave undefined to use the default.
  PLATFORM_URL: undefined as string | undefined,
  PERMISSION_UNAVAILABLE: 'unavailable',
  PERMISSION_DENIED: 'denied',
  PERMISSION_BLOCKED: 'blocked',
  PERMISSION_GRANTED: 'granted',
  STARTED: 'STARTED',
  ENABLED_AND_DETECTING: 'ENABLED_AND_DETECTING',
};
