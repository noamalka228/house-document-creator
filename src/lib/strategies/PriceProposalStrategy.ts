import { IDocumentTypeStrategy } from '../domain/interfaces/IDocumentTypeStrategy';
import { PriceProposalDocument } from '../domain/entities/PriceProposalDocument';

export class PriceProposalStrategy implements IDocumentTypeStrategy {
    public readonly documentType = 'price_proposal';
    public readonly templateFilePath = 'templates/price_proposal_template.xlsx';
    public createDocument(name: string, content: string, parsedData: Record<string, any>): PriceProposalDocument {
        return new PriceProposalDocument(
            name,
            content,
            parsedData.contractorName || '',
            parsedData.projectDescription || '',
            parsedData.totalPrice || 0
        );
    }
}
