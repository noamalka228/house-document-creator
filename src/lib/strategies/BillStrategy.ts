import { IDocumentTypeStrategy } from '../domain/interfaces/IDocumentTypeStrategy';
import { BillDocument } from '../domain/entities/BillDocument';

export class BillStrategy implements IDocumentTypeStrategy {
    public readonly documentType = 'bill';
    public readonly templateFilePath = 'templates/bill_template.xlsx';
    public createDocument(name: string, content: string, parsedData: Record<string, any>): BillDocument {
        return new BillDocument(
            name,
            content,
            parsedData.providerName || '',
            parsedData.totalAmount || 0,
            parsedData.dueDate || ''
        );
    }
}
