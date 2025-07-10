import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';

@Injectable()
export class HuggingFaceService {
  private readonly endpoint: string;
  private readonly apiKey: string;

  constructor(private configService: ConfigService) {
    this.endpoint = this.configService.get<string>(
      'HUGGINGFACE_MODEL_URL',
      'https://api-inference.huggingface.co/models/meta-llama/Meta-Llama-3.1-8B-Instruct'
    );
    this.apiKey = this.configService.get<string>('HUGGINGFACE_API_KEY') || '';
    
    if (!this.apiKey) {
      console.warn('⚠️  HUGGINGFACE_API_KEY no está configurado en las variables de entorno');
    }
  }

  async generate(prompt: string): Promise<string> {
    try {
      if (!this.apiKey) {
        return 'Error: Token de Hugging Face no configurado. Por favor configura HUGGINGFACE_API_KEY en tu archivo .env';
      }

      const response = await axios.post(
        this.endpoint,
        { 
          inputs: prompt,
          parameters: {
            max_new_tokens: 200,
            temperature: 0.7,
            return_full_text: false
          }
        },
        {
          headers: {
            Authorization: `Bearer ${this.apiKey}`,
            'Content-Type': 'application/json',
          },
          timeout: 30000, // 30 segundos de timeout
        }
      );

      // Manejar diferentes formatos de respuesta de la API
      const result = response.data;
      
      if (Array.isArray(result) && result.length > 0) {
        return result[0]?.generated_text || 'Sin respuesta del modelo';
      }
      
      if (result && typeof result === 'object' && 'generated_text' in result) {
        return (result as any).generated_text || 'Sin respuesta del modelo';
      }

      return 'Sin respuesta del modelo';
      
    } catch (error) {
      console.error('Error al generar respuesta con Hugging Face:', error);
      
      if (error.response?.status === 503) {
        return 'El modelo está cargando, por favor intenta de nuevo en unos minutos.';
      }
      
      if (error.response?.status === 401) {
        return 'Error de autenticación: Verifica tu token de Hugging Face.';
      }
      
      if (error.code === 'ECONNABORTED') {
        return 'Timeout: El modelo tardó demasiado en responder.';
      }
      
      return 'Error al procesar tu solicitud. Por favor intenta de nuevo.';
    }
  }

  /**
   * Genera una respuesta basada en el contexto de datos CSV y la pregunta del usuario
   */
  async generateWithContext(userQuestion: string, csvContext: string = ''): Promise<string> {
    let prompt = '';
    
    if (csvContext.trim()) {
      prompt = `Contexto de datos disponibles:
${csvContext}

Pregunta del usuario: ${userQuestion}

Por favor responde la pregunta basándote en los datos proporcionados. Si la información no está disponible en los datos, indícalo claramente.

Respuesta:`;
    } else {
      prompt = `Pregunta: ${userQuestion}

Respuesta:`;
    }

    return this.generate(prompt);
  }

  /**
   * Verifica si el servicio está configurado correctamente
   */
  isConfigured(): boolean {
    return !!this.apiKey;
  }

  /**
   * Obtiene información sobre la configuración actual
   */
  getStatus(): { configured: boolean; endpoint: string } {
    return {
      configured: this.isConfigured(),
      endpoint: this.endpoint,
    };
  }
}
