import * as fs from 'fs';
import * as path from 'path';
import { LlmService } from './LlmService';
import { EXCEL_MIME_TYPE } from '../constants';

export class LlmDocumentCreator {
    private llmService: LlmService;

    constructor() {
        this.llmService = new LlmService();
    }

    async createDocument(content: string, templateBase64: string): Promise<string> {
        if (!templateBase64) throw new Error('Template is required for document creation');

        const { systemInstruction, parts } = this.buildPrompt(content, templateBase64);
        const responseText = await this.llmService.generateContent({
            systemInstruction,
            parts,
            responseMimeType: 'text/plain'
        });

        // The LLM might wrap the base64 string in markdown blocks like ````base64 ... ```` or just spaces
        let base64 = responseText || '';
        base64 = base64.replace(/```(?:base64)?\n?/i, '').replace(/```$/i, '').trim();

        return base64;
    }

    private buildPrompt(content: string, templateBase64: string): { systemInstruction: string, parts: any[] } {
        let systemInstruction = fs.readFileSync(path.join(process.cwd(), 'src', 'prompts', 'create-document.txt'), 'utf-8');
        systemInstruction = systemInstruction.replace('{{content}}', content);

        const parts: any[] = [{
            inlineData: {
                mimeType: EXCEL_MIME_TYPE,
                data: templateBase64
            }
        }];
        return { systemInstruction, parts };
    }
}
