# AI Product Advisor

A comprehensive React Native application that revolutionizes product discovery through AI-powered recommendations. Users can describe their needs in natural language and receive intelligent, personalized product suggestions with detailed reasoning and match scores.

## Features

### 🤖 AI-Powered Recommendations
- **Natural Language Processing**: Users input queries in plain English describing their needs
- **Top 5 Matched Items**: AI returns the most relevant products from the available dataset
- **Match Scoring**: Each recommendation includes a confidence score (0-100%) indicating relevance
- **Pros and Cons Analysis**: Detailed advantages and potential considerations for each product
- **Reasoning Explanation**: Clear explanation of why each product was recommended
- **Loading Skeleton**: Smooth loading states while AI processes the request

### 📊 Data Flow Architecture
```
User Input Query → Custom Prompt + Available Dataset → Gemini AI Model → Formatted Response → User Interface
```

1. **User Input**: Natural language query describing product needs
2. **Prompt Engineering**: Query combined with product catalog in structured prompt
3. **AI Processing**: Gemini model analyzes requirements against available products
4. **Response Parsing**: Structured JSON response with recommendations, scores, and reasoning
5. **UI Rendering**: Beautiful cards displaying recommendations with all details

### 📱 Core Functionality
- **Smart Product Discovery**: Browse featured products and categories
- **Advanced Search**: AI-powered search with fallback keyword matching
- **Favorites System**: Save and manage preferred products with persistent storage
- **Product Details**: Comprehensive product pages with specifications and related items
- **Category Filtering**: Browse products by specific categories
- **Responsive Design**: Optimized for various mobile screen sizes

## Architecture

### High-Level Component Structure

```
app/
├── (tabs)/                 # Tab-based navigation (Expo Router)
│   ├── index.tsx          # Home screen with featured products
│   ├── search.tsx         # AI search interface and recommendations
│   ├── favorites.tsx      # Saved products management
│   └── profile.tsx        # User settings and preferences
├── product/
│   └── [id].tsx          # Dynamic product detail pages
├── data/
│   ├── products.ts       # Typed product catalog with 51 items
│   └── skus.json         # Raw product data source
├── services/
│   ├── geminiService.ts  # AI recommendation engine
│   └── favoritesService.ts # Local storage management
├── hooks/
│   ├── useSearch.ts      # Search functionality and state
│   └── useFavorites.ts   # Favorites management logic
├── utils/
│   └── searchUtils.ts    # Search filtering and sorting utilities
└── config/
    └── gemini.ts         # AI model configuration

components/
├── ProductCard.tsx        # Reusable product display component
├── RecommendationCard.tsx # AI recommendation with scoring
└── LoadingSpinner.tsx     # Loading states and skeletons
```

### Data Flow Implementation

#### 1. User Query Processing
```typescript
// User enters natural language query
const query = "I need a device to help with chronic back pain";

// Query is processed through AI service
const recommendations = await geminiService.getRecommendations(query, PRODUCT_CATALOG);
```

#### 2. AI Prompt Engineering
```typescript
// Custom prompt structure combines user query with product data
const prompt = `
You are an expert product advisor. A user is looking for products and has described their needs as: "${query}"

Here is the available product catalog:
${JSON.stringify(products, null, 2)}

Please analyze and recommend the top 5 most suitable products with:
- Match score (0-100)
- Clear reasoning
- Pros and cons
- JSON formatted response
`;
```

#### 3. Response Processing
```typescript
// Structured response from Gemini API
interface Recommendation {
  product: Product;
  matchScore: number;
  reasoning: string;
  pros: string[];
  cons: string[];
}
```

## Key Design Decisions

### 1. **File-Based Routing Architecture**
- **Choice**: Expo Router with file-based routing similar to Next.js
- **Rationale**: Provides intuitive navigation structure and automatic route generation
- **Implementation**: Tab-based primary navigation with stack navigation for details

### 2. **AI Integration Strategy**
- **Choice**: Google Gemini API with intelligent fallback system
- **Rationale**: Provides sophisticated natural language understanding with graceful degradation
- **Implementation**: Custom service layer with mock recommendations when API unavailable

### 3. **State Management Approach**
- **Choice**: React hooks with AsyncStorage for persistence
- **Rationale**: Lightweight solution appropriate for app complexity without Redux overhead
- **Implementation**: Custom hooks for search and favorites with local storage

### 4. **Component Architecture**
- **Choice**: Modular, reusable components with clear separation of concerns
- **Rationale**: Maintainable codebase with consistent UI patterns
- **Implementation**: Dedicated components for products, recommendations, and loading states

### 5. **Data Structure Design**
- **Choice**: TypeScript interfaces with comprehensive product model
- **Rationale**: Type safety and clear data contracts throughout the application
- **Implementation**: Centralized product catalog with utility functions for manipulation

## File Structure Explanation

### Core Application Files
- **`app/_layout.tsx`**: Root layout with navigation configuration
- **`app/(tabs)/_layout.tsx`**: Tab navigation setup with icons and styling
- **`app/product/[id].tsx`**: Dynamic product detail pages with full specifications

### Data Layer
- **`app/data/products.ts`**: Typed product catalog with 51 curated items across 8 categories
- **`app/data/skus.json`**: Raw product data source for easy updates

### Service Layer
- **`app/services/geminiService.ts`**: AI recommendation engine with prompt engineering
- **`app/services/favoritesService.ts`**: Persistent storage for user preferences

### Business Logic
- **`app/hooks/useSearch.ts`**: Search state management and API integration
- **`app/hooks/useFavorites.ts`**: Favorites management with real-time updates
- **`app/utils/searchUtils.ts`**: Product filtering, sorting, and search utilities

### UI Components
- **`components/ProductCard.tsx`**: Reusable product display with favorites integration
- **`components/RecommendationCard.tsx`**: AI recommendation display with scoring
- **`components/LoadingSpinner.tsx`**: Loading states and skeleton screens

## Technical Implementation

### AI Recommendation Engine
```typescript
// Sophisticated prompt engineering for accurate recommendations
const prompt = this.buildPrompt(query, products);
const response = await fetch(`${this.baseUrl}?key=${this.apiKey}`, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    contents: [{ parts: [{ text: prompt }] }]
  })
});
```

### Loading States
- **Skeleton Loading**: Smooth loading animations while AI processes requests
- **Error Handling**: Graceful fallback to keyword-based search when AI unavailable
- **Progressive Enhancement**: App works fully without AI, enhanced with AI when available

### Performance Optimizations
- **Lazy Loading**: Components load on demand for better performance
- **Memoization**: Expensive calculations cached to prevent unnecessary re-renders
- **Efficient Filtering**: Optimized search algorithms for real-time filtering

## Development Environment

This application is built using:
- **Expo SDK 52.0.30** with Expo Router 4.0.17
- **React Native 0.79.1** with TypeScript for type safety
- **File-based routing** similar to Next.js structure
- **Compatible with snack.expo.dev** for easy development and testing

## Getting Started

1. **Install Dependencies**:
   ```bash
   npm install
   ```

2. **Configure AI (Optional)**:
   - Get API key from [Google AI Studio](https://makersuite.google.com/app/apikey)
   - Update `app/config/gemini.ts` with your API key

3. **Start Development**:
   ```bash
   npm run dev
   ```

4. **Test AI Functionality**:
   - Try queries like "I need help with back pain" or "Looking for kitchen gadgets"
   - Observe AI recommendations with match scores and reasoning

## AI Prompt Engineering

The application uses sophisticated prompt engineering to ensure accurate recommendations:

- **Context Setting**: Establishes AI as expert product advisor
- **Data Integration**: Includes complete product catalog in prompt
- **Output Formatting**: Requests structured JSON response with specific fields
- **Quality Criteria**: Emphasizes match scoring, reasoning, and pros/cons analysis

## Future Enhancements

- **User Accounts**: Cloud synchronization of preferences and history
- **Advanced Analytics**: Track recommendation accuracy and user satisfaction
- **Price Tracking**: Notifications for price drops on favorited items
- **Social Features**: Share recommendations and reviews
- **Voice Integration**: Enhanced voice-to-text for accessibility
- **Machine Learning**: Learn from user interactions to improve recommendations

This application demonstrates modern React Native development practices with AI integration, providing a foundation for intelligent product discovery that can be extended and customized for various use cases.