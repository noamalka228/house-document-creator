import { IDocumentTypeStrategy } from '../domain/interfaces/IDocumentTypeStrategy';

export class BillStrategy implements IDocumentTypeStrategy {
    public readonly documentType = 'bill';
    public readonly templateFilePath = 'templates/bill_template.xlsx';
}
