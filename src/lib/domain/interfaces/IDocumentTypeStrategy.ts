import { BaseDocument } from '../entities/BaseDocument';

export interface IDocumentTypeStrategy {
    documentType: string;
    templateFilePath: string;
    createDocument(name: string, content: string, parsedData: Record<string, any>): BaseDocument;
}
