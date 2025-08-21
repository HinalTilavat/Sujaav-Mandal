# AI Product Advisor

A comprehensive React Native application that revolutionizes product discovery through AI-powered recommendations. Users can describe their needs in natural language and receive intelligent, personalized product suggestions.

## Features

### 🤖 AI-Powered Search
- Natural language processing for product queries
- Google Gemini API integration for intelligent recommendations
- Contextual understanding of user needs and preferences
- Match scoring and detailed reasoning for each recommendation

### 📱 Intuitive Mobile Experience
- Clean, modern UI with smooth animations
- Tab-based navigation for easy access to all features
- Responsive design optimized for mobile devices
- Voice-to-text support for accessibility

### 🛍️ Smart Product Discovery
- Comprehensive product catalog with detailed specifications
- Advanced filtering by category, price range, and brand
- Featured products and trending categories
- Example queries to guide users

### ❤️ Personalization
- Favorites system for saving preferred products
- User preferences and search history
- Personalized recommendations based on past interactions
- Price alerts and notifications

### 🔍 Advanced Search & Filtering
- Real-time search with intelligent matching
- Category-based filtering
- Price range selection
- Brand-specific searches
- Sort by relevance, price, or name

## Technology Stack

- **React Native** with Expo Router for navigation
- **TypeScript** for type safety
- **Google Gemini AI** for intelligent recommendations
- **AsyncStorage** for local data persistence
- **Lucide React Native** for consistent iconography
- **Expo Linear Gradient** for beautiful UI elements

## Getting Started

### Prerequisites
- Node.js 18+ 
- Expo CLI
- Google Gemini API key (optional for demo mode)

### Installation

1. Install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npm run dev
```

3. (Optional) Configure Gemini API:
   - Get an API key from [Google AI Studio](https://makersuite.google.com/app/apikey)
   - Update the API key in `app/config/gemini.ts`

## Project Structure

```
app/
├── (tabs)/                 # Tab navigation screens
│   ├── index.tsx          # Home screen with featured products
│   ├── search.tsx         # AI search interface
│   ├── favorites.tsx      # Saved products
│   └── profile.tsx        # User settings and preferences
├── data/
│   └── products.ts        # Product catalog data
├── services/
│   ├── geminiService.ts   # AI recommendation service
│   └── favoritesService.ts # Favorites management
├── hooks/
│   ├── useSearch.ts       # Search functionality hook
│   └── useFavorites.ts    # Favorites management hook
└── utils/
    └── searchUtils.ts     # Search and filtering utilities

components/
├── ProductCard.tsx        # Product display component
├── RecommendationCard.tsx # AI recommendation display
└── LoadingSpinner.tsx     # Loading state component
```

## Key Features Explained

### AI Recommendations
The app uses Google's Gemini AI to understand user queries and provide intelligent product recommendations. The AI considers:
- User's specific needs and use cases
- Product features and specifications
- Price considerations and value propositions
- Category relevance and alternatives

### Smart Matching Algorithm
When AI is unavailable, the app falls back to a sophisticated keyword-based matching system that:
- Analyzes query terms against product descriptions
- Weights matches by category and brand relevance
- Provides confidence scores for each recommendation

### Favorites System
Users can save products they're interested in:
- Persistent storage using AsyncStorage
- Quick add/remove functionality
- Favorites counter and management
- Cross-screen synchronization

### Responsive Design
The app is designed with mobile-first principles:
- Optimized for various screen sizes
- Touch-friendly interface elements
- Smooth animations and transitions
- Accessible color contrast and typography

## Usage Examples

### Natural Language Queries
- "I need a device to help with chronic back pain"
- "Looking for smart security solutions for my apartment"
- "Want entertainment gadgets for my 8-year-old child"
- "Need kitchen appliances for healthy meal preparation"

### Advanced Filtering
- Filter by specific categories (Health, Entertainment, etc.)
- Set price ranges for budget-conscious shopping
- Search within specific brands
- Sort results by relevance or price

## Future Enhancements

- User accounts and cloud synchronization
- Product reviews and ratings
- Price tracking and alerts
- Social sharing of recommendations
- Advanced AI learning from user feedback
- Integration with e-commerce platforms
- Augmented reality product visualization

## Contributing

This project follows React Native and Expo best practices. When contributing:
- Use TypeScript for all new code
- Follow the established component structure
- Add proper error handling
- Include loading states for async operations
- Maintain responsive design principles

## License

MIT License - see LICENSE file for details.