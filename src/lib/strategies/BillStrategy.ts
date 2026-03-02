import { IDocumentTypeStrategy } from '../domain/interfaces/IDocumentTypeStrategy';
import { BillDocument } from '../domain/entities/BillDocument';

export class BillStrategy implements IDocumentTypeStrategy {
    public readonly documentType = 'bill';
    public readonly promptFilePath = 'prompts/bill-task.txt';
    public readonly templateFilePath = 'templates/bill_template.xlsx';
    public readonly documentClass = BillDocument;
}
