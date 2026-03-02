import { BaseDocument } from '../domain/entities/BaseDocument';
import * as fs from 'fs';
import * as path from 'path';
import { LlmService } from './LlmService';

export class LlmDocumentCreator {
    private llmService: LlmService;

    constructor(
        private prompt: string,
        private exampleFileContent: string,
        private docClassType: new (...args: any[]) => BaseDocument
    ) {
        this.llmService = new LlmService();
    }

    async createDocument(extractedText: string, documentName: string, templateBase64?: string): Promise<BaseDocument> {
        const systemPromptTemplate = fs.readFileSync(path.join(process.cwd(), 'src', 'prompts', 'create_document_system.txt'), 'utf-8');
        const systemPrompt = systemPromptTemplate
            .replace('{{task_prompt}}', this.prompt)
            .replace('{{example_prompt}}', this.exampleFileContent)
            .replace('{{extracted_text}}', extractedText);

        const parts: any[] = [{ text: systemPrompt }];

        if (templateBase64) {
            parts.unshift({ text: "Here is an example XLSX file showing the expected output structure:" });
            parts.push({
                inlineData: {
                    mimeType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
                    data: templateBase64
                }
            });
        }

        const responseText = await this.llmService.generateContent({
            parts,
            responseMimeType: 'application/json'
        });

        const rawJson = responseText || '{}';
        const data = JSON.parse(rawJson);

        if (this.docClassType.name === 'PriceProposalDocument') {
            return new this.docClassType(
                documentName,
                extractedText,
                data.contractorName || '',
                data.projectDescription || '',
                data.totalPrice || 0
            );
        } else if (this.docClassType.name === 'BillDocument') {
            return new this.docClassType(
                documentName,
                extractedText,
                data.providerName || '',
                data.totalAmount || 0,
                data.dueDate || ''
            );
        }

        throw new Error(`Unsupported document class: ${this.docClassType.name}`);
    }
}
