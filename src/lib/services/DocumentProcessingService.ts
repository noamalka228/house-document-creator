import * as fs from 'fs';
import * as path from 'path';
import { BaseDocument } from '../domain/entities/BaseDocument';
import { XlsxFormatter } from './XlsxFormatter';
import { documentStrategyRegistry } from './DocumentStrategyRegistry';
import { LlmTextExtractor } from './LlmTextExtractor';
import { LlmDocumentCreator } from './LlmDocumentCreator';

export interface ProcessedDocumentResult {
    document: BaseDocument;
    xlsxBase64: string;
}

// We define the supported types statically for strict TypeScript type checking.
// These must correspond to the strategies registered in DocumentStrategyRegistry.
export const DOCUMENT_TYPES = ['price_proposal', 'bill'] as const;
export type DocumentType = typeof DOCUMENT_TYPES[number];

export function isValidDocType(docType: string): boolean {
    return documentStrategyRegistry.getAllTypes().includes(docType);
}

export class DocumentProcessingService {
    public async extractText(
        imageBuffer: Buffer,
    ): Promise<string> {
        const extractor = new LlmTextExtractor();
        return await extractor.extractText(imageBuffer);
    }

    public async createDocumentFromText(
        extractedText: string,
        documentType: DocumentType,
        fileName?: string,
    ): Promise<ProcessedDocumentResult> {
        const strategy = documentStrategyRegistry.getStrategy(documentType);

        const templateContent = fs.readFileSync(path.join(process.cwd(), 'src', strategy.templateFilePath), 'utf-8');
        const creator = new LlmDocumentCreator(strategy.documentClass);

        const documentName = fileName || `Unnamed_${new Date().toISOString()}`;
        const document = await creator.createDocument(extractedText, documentName, templateContent);
        const formatter = new XlsxFormatter();
        const buffer = await formatter.format(document.exportData());

        return {
            document,
            xlsxBase64: buffer.toString('base64')
        };
    }
}
