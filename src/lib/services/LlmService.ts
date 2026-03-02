import { GoogleGenAI } from '@google/genai';

export interface LlmRequestOptions {
    parts: any[];
    systemInstruction?: string;
    responseMimeType?: string;
    model?: string;
}

export class LlmService {
    private ai: GoogleGenAI;
    private defaultModel: string;

    constructor() {
        const apiKey = process.env.GEMINI_API_KEY;
        const defaultModel = process.env.GEMINI_MODEL;

        if (!apiKey || !defaultModel) {
            throw new Error('GEMINI_API_KEY or GEMINI_MODEL is not defined in .env');
        }

        this.ai = new GoogleGenAI({ apiKey });
        this.defaultModel = defaultModel;
    }

    async generateContent(options: LlmRequestOptions): Promise<string> {
        try {
            const config: any = {};
            if (options.systemInstruction) {
                config.systemInstruction = options.systemInstruction;
            }
            if (options.responseMimeType) {
                config.responseMimeType = options.responseMimeType;
            }

            const response = await this.ai.models.generateContent({
                model: options.model || this.defaultModel,
                contents: [
                    {
                        role: 'user',
                        parts: options.parts
                    }
                ],
                config: Object.keys(config).length > 0 ? config : undefined
            });

            return response.text || '';
        } catch (error: any) {
            // Log or handle common errors here if needed
            throw new Error(`LLM Execution failed: ${error.message}`);
        }
    }
}
