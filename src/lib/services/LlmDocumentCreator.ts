import { BaseDocument } from '../domain/entities/BaseDocument';
import { GenericDocument } from '../domain/entities/GenericDocument';
import { IDocumentTypeStrategy } from '../domain/interfaces/IDocumentTypeStrategy';
import * as fs from 'fs';
import * as path from 'path';
import { LlmService } from './LlmService';

export class LlmDocumentCreator {
    private llmService: LlmService;

    constructor() {
        this.llmService = new LlmService();
    }

    async createDocument(content: string, documentName: string, templateBase64?: string, strategy?: IDocumentTypeStrategy): Promise<BaseDocument> {
        if (!templateBase64) return new GenericDocument(documentName, content);
        if (!strategy) throw new Error('Strategy is required for template-based document creation');

        const { systemInstruction, parts } = this.buildPrompt(content, templateBase64);
        const responseText = await this.llmService.generateContent({
            systemInstruction,
            parts,
            responseMimeType: 'application/json'
        });

        const rawJson = responseText || '{}';
        const data = JSON.parse(rawJson);

        return strategy.createDocument(documentName, content, data);
    }

    private buildPrompt(content: string, templateBase64: string): { systemInstruction: string, parts: any[] } {
        let systemInstruction = fs.readFileSync(path.join(process.cwd(), 'src', 'prompts', 'create-document.txt'), 'utf-8');
        systemInstruction = systemInstruction.replace('{{content}}', content);

        const parts: any[] = [{
            inlineData: {
                mimeType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
                data: templateBase64
            }
        }];
        return { systemInstruction, parts };
    }
}
