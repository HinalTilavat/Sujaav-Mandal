// Gemini API Configuration
// To use the Gemini API, you'll need to:
// 1. Get an API key from Google AI Studio (https://makersuite.google.com/app/apikey)
// 2. Add it to your environment variables or directly in the service

export const GEMINI_CONFIG = {
  // Replace with your actual API key
  API_KEY: 'YOUR_GEMINI_API_KEY_HERE',
  MODEL: 'gemini-pro',
  BASE_URL: 'https://generativelanguage.googleapis.com/v1beta/models',
};

// For production, use environment variables:
// export const GEMINI_CONFIG = {
//   API_KEY: process.env.EXPO_PUBLIC_GEMINI_API_KEY,
//   MODEL: 'gemini-pro',
//   BASE_URL: 'https://generativelanguage.googleapis.com/v1beta/models',
// };