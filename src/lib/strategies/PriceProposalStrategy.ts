import { IDocumentTypeStrategy } from '../domain/interfaces/IDocumentTypeStrategy';
import { PriceProposalDocument } from '../domain/entities/PriceProposalDocument';

export class PriceProposalStrategy implements IDocumentTypeStrategy {
    public readonly documentType = 'price_proposal';
    public readonly promptFilePath = 'prompts/price_proposal_task.txt';
    public readonly templateFilePath = 'templates/price_proposal_template.xlsx';
    public readonly documentClass = PriceProposalDocument;
}
