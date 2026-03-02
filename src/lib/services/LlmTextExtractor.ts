import * as fs from 'fs';
import * as path from 'path';
import { LlmService } from './LlmService';
import { documentStrategyRegistry } from './DocumentStrategyRegistry';

export class LlmTextExtractor {
    private llmService: LlmService;

    constructor() {
        this.llmService = new LlmService();
    }

    async extractText(documentBuffer: Buffer, imageType: string): Promise<string> {
        const base64Document = documentBuffer.toString('base64');
        let prompt = fs.readFileSync(path.join(process.cwd(), 'src', 'prompts', 'text-extractor.txt'), 'utf-8');

        const strategy = documentStrategyRegistry.getStrategy(imageType);
        const specificInstructions = fs.readFileSync(path.join(process.cwd(), 'src', strategy.promptFilePath), 'utf-8');
        prompt += `\n\nPay special attention to these specific fields:\n${specificInstructions}`;

        return await this.llmService.generateContent({
            parts: [
                {
                    inlineData: {
                        mimeType: 'image/jpeg',
                        data: base64Document
                    }
                }
            ],
            systemInstruction: prompt
        });
    }
}
