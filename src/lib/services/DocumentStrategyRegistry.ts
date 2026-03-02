import { IDocumentTypeStrategy } from '../domain/interfaces/IDocumentTypeStrategy';
import { PriceProposalStrategy } from '../strategies/PriceProposalStrategy';
import { BillStrategy } from '../strategies/BillStrategy';

export class DocumentStrategyRegistry {
    private ObjectMap = new Map<string, IDocumentTypeStrategy>();

    constructor() {
        this.register(new PriceProposalStrategy());
        this.register(new BillStrategy());
    }

    public register(strategy: IDocumentTypeStrategy): void {
        this.ObjectMap.set(strategy.documentType, strategy);
    }

    public getStrategy(documentType: string): IDocumentTypeStrategy {
        const strategy = this.ObjectMap.get(documentType);
        if (!strategy) {
            throw new Error(`Unsupported document type: ${documentType}`);
        }
        return strategy;
    }

    public getAllTypes(): string[] {
        return Array.from(this.ObjectMap.keys());
    }
}

export const documentStrategyRegistry = new DocumentStrategyRegistry();
