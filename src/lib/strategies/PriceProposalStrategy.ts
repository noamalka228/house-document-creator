import { IDocumentTypeStrategy } from '../domain/interfaces/IDocumentTypeStrategy';

export class PriceProposalStrategy implements IDocumentTypeStrategy {
    public readonly documentType = 'price_proposal';
    public readonly templateFilePath = 'templates/price_proposal_template.xlsx';
}
