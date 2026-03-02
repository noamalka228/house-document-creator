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

        const systemPrompt = fs.readFileSync(path.join(process.cwd(), 'src', 'prompts', 'create-document.txt'), 'utf-8');
        const parts: any[] = [{ text: systemPrompt }];

        parts.unshift({ text: "Here is an example XLSX file showing the expected output structure:" });
        parts.push({
            inlineData: {
                mimeType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
                data: templateBase64
            }
        });
        parts.push({ text: `\n\nHere is the extracted text content to be structured and merged according to the template:\n${content}` });

        const responseText = await this.llmService.generateContent({
            parts,
            responseMimeType: 'application/json'
        });

        const rawJson = responseText || '{}';
        const data = JSON.parse(rawJson);

        return strategy.createDocument(documentName, content, data);
    }
}
