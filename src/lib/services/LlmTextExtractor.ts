import * as fs from 'fs';
import * as path from 'path';
import { LlmService } from './LlmService';

export class LlmTextExtractor {
    private llmService: LlmService;

    constructor() {
        this.llmService = new LlmService();
    }

    async extractText(documentBuffer: Buffer, mimeType: string = 'image/jpeg'): Promise<string> {
        const base64Document = documentBuffer.toString('base64');
        const systemPrompt = fs.readFileSync(path.join(process.cwd(), 'src', 'prompts', 'text-extractor.txt'), 'utf-8');

        return await this.llmService.generateContent({
            parts: [
                {
                    inlineData: {
                        mimeType,
                        data: base64Document
                    }
                }
            ],
            systemInstruction: systemPrompt,
            temperature: 0
        });
    }
}
