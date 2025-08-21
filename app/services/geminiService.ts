import { Product } from '../data/products';

export interface Recommendation {
  product: Product;
  matchScore: number;
  reasoning: string;
  pros: string[];
  cons: string[];
}

class GeminiService {
  private apiKey: string = '';
  private baseUrl: string = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent';

  setApiKey(key: string) {
    this.apiKey = key;
  }

  async getRecommendations(query: string, products: Product[]): Promise<Recommendation[]> {
    if (!this.apiKey) {
      // For demo purposes, return mock recommendations
      return this.getMockRecommendations(query, products);
    }

    try {
      const prompt = this.buildPrompt(query, products);
      
      const response = await fetch(`${this.baseUrl}?key=${this.apiKey}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: prompt
            }]
          }]
        })
      });

      if (!response.ok) {
        throw new Error('Failed to get AI recommendations');
      }

      const data = await response.json();
      const aiResponse = data.candidates[0].content.parts[0].text;
      
      return this.parseAIResponse(aiResponse, products);
    } catch (error) {
      console.error('Gemini API error:', error);
      // Fallback to mock recommendations
      return this.getMockRecommendations(query, products);
    }
  }

  private buildPrompt(query: string, products: Product[]): string {
    return `
You are an expert product advisor. A user is looking for products and has described their needs as: "${query}"

Here is the available product catalog:
${JSON.stringify(products, null, 2)}

Please analyze the user's query and recommend the top 5 most suitable products. For each recommendation, provide:
1. The exact product ID from the catalog
2. A match score (0-100) indicating how well it fits their needs
3. Clear reasoning for why this product matches their requirements
4. 2-3 key pros specific to their needs
5. 1-2 potential cons or considerations

Format your response as a JSON array with this structure:
[
  {
    "productId": number,
    "matchScore": number,
    "reasoning": "string",
    "pros": ["string", "string"],
    "cons": ["string"]
  }
]

Focus on understanding the user's underlying needs, use case, and context. Consider factors like:
- Primary use case and functionality needed
- Budget considerations (if mentioned)
- User demographics (if implied)
- Quality vs price trade-offs
- Specific features mentioned

Provide only the JSON response, no additional text.
`;
  }

  private parseAIResponse(response: string, products: Product[]): Recommendation[] {
    try {
      // Extract JSON from response
      const jsonMatch = response.match(/\[[\s\S]*\]/);
      if (!jsonMatch) {
        throw new Error('No JSON found in response');
      }

      const aiRecommendations = JSON.parse(jsonMatch[0]);
      
      return aiRecommendations.map((rec: any) => {
        const product = products.find(p => p.id === rec.productId);
        if (!product) return null;

        return {
          product,
          matchScore: rec.matchScore,
          reasoning: rec.reasoning,
          pros: rec.pros || [],
          cons: rec.cons || [],
        };
      }).filter(Boolean);
    } catch (error) {
      console.error('Failed to parse AI response:', error);
      return this.getMockRecommendations('', products);
    }
  }

  private getMockRecommendations(query: string, products: Product[]): Recommendation[] {
    // Simple keyword-based matching for demo
    const keywords = query.toLowerCase().split(' ');
    
    const scored = products.map(product => {
      let score = 0;
      const searchText = `${product.product_name} ${product.description} ${product.category}`.toLowerCase();
      
      keywords.forEach(keyword => {
        if (searchText.includes(keyword)) {
          score += 20;
        }
      });

      // Add category bonus
      if (keywords.some(k => product.category.toLowerCase().includes(k))) {
        score += 30;
      }

      // Add brand bonus
      if (keywords.some(k => product.brand.toLowerCase().includes(k))) {
        score += 15;
      }

      return {
        product,
        matchScore: Math.min(score, 95),
        reasoning: `This product matches your search for "${query}" based on its features and category.`,
        pros: [
          'High-quality construction',
          'Good value for money',
          'Positive user reviews'
        ],
        cons: [
          'May require setup time',
          'Consider warranty terms'
        ]
      };
    });

    return scored
      .filter(item => item.matchScore > 0)
      .sort((a, b) => b.matchScore - a.matchScore)
      .slice(0, 5);
  }
}

export const geminiService = new GeminiService();