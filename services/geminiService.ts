
import { GoogleGenAI, GenerateContentResponse } from "@google/genai";

export class GeminiVPNService {
  private ai: GoogleGenAI | null = null;

  constructor() {
    if (process.env.API_KEY) {
      this.ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    }
  }

  private async withRetry<T>(fn: () => Promise<T>, maxRetries = 2): Promise<T> {
    if (!this.ai) throw new Error("API_KEY_MISSING");
    
    let lastError: any;
    for (let i = 0; i < maxRetries + 1; i++) {
      try {
        return await fn();
      } catch (error: any) {
        lastError = error;
        const errorMsg = error?.message?.toLowerCase() || "";
        const isRateLimited = errorMsg.includes("429") || error?.status === 429 || errorMsg.includes("quota") || errorMsg.includes("exhausted");

        if (isRateLimited && i < maxRetries) {
          const waitTime = Math.pow(2, i) * 1200 + Math.random() * 800;
          await new Promise((resolve) => setTimeout(resolve, waitTime));
          continue;
        }
        throw error;
      }
    }
    throw lastError;
  }

  async getVPNOptimizationAdvice(ping: number, load: number, context: string) {
    try {
      const response: GenerateContentResponse = await this.withRetry(() => 
        this.ai!.models.generateContent({
          model: 'gemini-3-flash-preview',
          contents: `Status: ${ping}ms, ${load}% load. Context: ${context}. Dica técnica rápida de 1 frase para otimizar VPN.`,
          config: { temperature: 0.6 }
        })
      );
      return response.text || "Dica: Reduza o MTU para 1400 em conexões 4G para evitar fragmentação.";
    } catch (error: any) {
      console.warn("Gemini Fallback Active:", error.message);
      if (ping > 100) return "Dica: Tente mudar para o protocolo Trojan-Go para reduzir a latência em horários de pico.";
      if (load > 50) return "Dica: Este servidor está com carga alta; recomendamos mudar para o nó do Brasil para streaming.";
      return "Dica: O driver TUN no Windows garante que o tráfego de sistema não vaze fora da VPN.";
    }
  }

  async generateSalesPitch(companyName: string, userCount: number) {
    try {
      const response: GenerateContentResponse = await this.withRetry(() =>
        this.ai!.models.generateContent({
          model: 'gemini-3-flash-preview',
          contents: `Proposta para ${companyName} (${userCount} usuários). Fale sobre ads segmentados em Angola.`,
        })
      );
      return response.text || `A PM.TUNNEL oferece visibilidade para ${userCount} angolanos ativos.`;
    } catch (error) {
      return `Proposta para ${companyName}: Alcance o público mobile de Luanda e províncias com anúncios segmentados de alta conversão.`;
    }
  }

  async chatWithExpert(message: string) {
    try {
      const response: GenerateContentResponse = await this.withRetry(() => {
        const chat = this.ai!.chats.create({
          model: 'gemini-3-flash-preview',
          config: {
            systemInstruction: `Você é o VoltBot, expert em PM.TUNNEL. Tom angolano, profissional e prestativo.`,
          }
        });
        return chat.sendMessage({ message });
      });
      return response.text || "Mambo está fixe, mas a resposta falhou. O que precisas saber sobre o SNI?";
    } catch (error: any) {
      return "Mambo está um pouco lento por causa da alta demanda. O sistema AES-256 continua firme. Podes tentar de novo em alguns segundos? Estamos juntos!";
    }
  }
}

export const vpnAi = new GeminiVPNService();
