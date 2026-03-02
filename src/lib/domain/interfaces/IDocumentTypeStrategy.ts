import { BaseDocument } from '../entities/BaseDocument';

export interface IDocumentTypeStrategy {
    documentType: string;
    promptFilePath: string;
    templateFilePath: string;
    documentClass: new (...args: any[]) => BaseDocument;
}
