import axios from 'axios'
import { getAvailableApiKey, releaseApiKey } from './auth'

const ZUKIJOURNEY_API_URL = process.env.ZUKIJOURNEY_API_URL || 'https://api.zukijourney.com'

export interface ChatMessage {
  role: 'user' | 'assistant' | 'system'
  content: string
}

export interface ChatResponse {
  content: string
  model: string
  usage?: {
    prompt_tokens: number
    completion_tokens: number
    total_tokens: number
  }
}

export interface CodeGenerationRequest {
  prompt: string
  language?: string
  framework?: string
}

export interface CodeGenerationResponse {
  code: string
  explanation: string
  language: string
}

export interface SuperQueryRequest {
  query: string
  context?: string
}

export interface SuperQueryResponse {
  response: string
  models: string[]
  confidence: number
  reasoning: string
}

export interface TextToSpeechRequest {
  text: string
  voice?: string
  speed?: number
}

export interface EmbeddingRequest {
  text: string
  model?: string
}

export interface EmbeddingResponse {
  embedding: number[]
  model: string
}

export interface ModerationRequest {
  text: string
}

export interface ModerationResponse {
  flagged: boolean
  categories: {
    hate: boolean
    hate_threatening: boolean
    self_harm: boolean
    sexual: boolean
    sexual_minors: boolean
    violence: boolean
    violence_graphic: boolean
  }
  category_scores: {
    hate: number
    hate_threatening: number
    self_harm: number
    sexual: number
    sexual_minors: number
    violence: number
    violence_graphic: number
  }
}

export interface ImageUpscaleRequest {
  image: string // base64 encoded image
  scale?: number
}

export interface ImageUpscaleResponse {
  image: string // base64 encoded upscaled image
  original_size: { width: number; height: number }
  upscaled_size: { width: number; height: number }
}

export interface TranslationRequest {
  text: string
  target_language: string
  source_language?: string
}

export interface TranslationResponse {
  translated_text: string
  source_language: string
  target_language: string
}

class ZukijourneyAPI {
  private async makeRequest(endpoint: string, data: any, apiKey?: string): Promise<any> {
    const key = apiKey || await getAvailableApiKey()
    if (!key) {
      throw new Error('No API key available')
    }

    try {
      const response = await axios.post(`${ZUKIJOURNEY_API_URL}${endpoint}`, data, {
        headers: {
          'Authorization': `Bearer ${key}`,
          'Content-Type': 'application/json',
        },
        timeout: 30000,
      })

      return response.data
    } catch (error) {
      console.error('Zukijourney API error:', error)
      throw error
    }
  }

  async chat(messages: ChatMessage[], apiKey?: string): Promise<ChatResponse> {
    return this.makeRequest('/v1/chat/completions', {
      messages,
      model: 'gpt-4',
      max_tokens: 2000,
      temperature: 0.7,
    }, apiKey)
  }

  async generateCode(request: CodeGenerationRequest, apiKey?: string): Promise<CodeGenerationResponse> {
    return this.makeRequest('/v1/code/generate', {
      prompt: request.prompt,
      language: request.language || 'javascript',
      framework: request.framework,
    }, apiKey)
  }

  async superQuery(request: SuperQueryRequest, apiKey?: string): Promise<SuperQueryResponse> {
    // Use multiple models and combine their responses
    const models = ['gpt-4', 'claude-3-sonnet', 'gemini-pro']
    const responses = await Promise.allSettled(
      models.map(model => 
        this.makeRequest('/v1/chat/completions', {
          messages: [
            { role: 'system', content: 'You are an advanced AI assistant. Provide detailed, accurate, and helpful responses.' },
            { role: 'user', content: request.query }
          ],
          model,
          max_tokens: 2000,
          temperature: 0.3,
        }, apiKey)
      )
    )

    const successfulResponses = responses
      .filter((result): result is PromiseFulfilledResult<any> => result.status === 'fulfilled')
      .map(result => result.value)

    if (successfulResponses.length === 0) {
      throw new Error('All models failed to respond')
    }

    // Combine responses (simplified approach - in production, you might want more sophisticated combination)
    const combinedResponse = successfulResponses
      .map(r => r.choices[0].message.content)
      .join('\n\n---\n\n')

    return {
      response: combinedResponse,
      models: successfulResponses.map(r => r.model || 'unknown'),
      confidence: successfulResponses.length / models.length,
      reasoning: `Combined responses from ${successfulResponses.length} models`,
    }
  }

  async textToSpeech(request: TextToSpeechRequest, apiKey?: string): Promise<ArrayBuffer> {
    const response = await axios.post(`${ZUKIJOURNEY_API_URL}/v1/audio/speech`, {
      text: request.text,
      voice: request.voice || 'alloy',
      speed: request.speed || 1.0,
    }, {
      headers: {
        'Authorization': `Bearer ${apiKey || await getAvailableApiKey()}`,
        'Content-Type': 'application/json',
      },
      responseType: 'arraybuffer',
    })

    return response.data
  }

  async createEmbedding(request: EmbeddingRequest, apiKey?: string): Promise<EmbeddingResponse> {
    return this.makeRequest('/v1/embeddings', {
      input: request.text,
      model: request.model || 'text-embedding-ada-002',
    }, apiKey)
  }

  async moderate(request: ModerationRequest, apiKey?: string): Promise<ModerationResponse> {
    return this.makeRequest('/v1/moderations', {
      input: request.text,
    }, apiKey)
  }

  async upscaleImage(request: ImageUpscaleRequest, apiKey?: string): Promise<ImageUpscaleResponse> {
    return this.makeRequest('/v1/images/upscale', {
      image: request.image,
      scale: request.scale || 2,
    }, apiKey)
  }

  async translate(request: TranslationRequest, apiKey?: string): Promise<TranslationResponse> {
    return this.makeRequest('/v1/translations', {
      text: request.text,
      target_language: request.target_language,
      source_language: request.source_language,
    }, apiKey)
  }
}

export const zukijourneyAPI = new ZukijourneyAPI()
