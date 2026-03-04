import * as fs from 'fs';
import * as path from 'path';
import { ExcelDocument } from '../domain/entities/ExcelDocument';
import { documentStrategyRegistry } from './DocumentStrategyRegistry';
import { LlmTextExtractor } from './LlmTextExtractor';
import { LlmDocumentCreator } from './LlmDocumentCreator';

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
    ): Promise<ExcelDocument> {
        const documentName = fileName || `Unnamed_${new Date().toISOString()}`;
        const strategy = documentStrategyRegistry.getStrategy(documentType);

        // Read template as base64 string
        const templateContent = fs.readFileSync(path.join(process.cwd(), 'src', strategy.templateFilePath), 'base64');

        const creator = new LlmDocumentCreator();
        const xlsxBase64 = await creator.createDocument(extractedText, templateContent);

        return new ExcelDocument(documentName, extractedText, xlsxBase64);
    }
}
