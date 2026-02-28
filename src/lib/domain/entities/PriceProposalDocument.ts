import { BaseDocument } from './BaseDocument';

export class PriceProposalDocument extends BaseDocument {
    constructor(
        name: string,
        content: string,
        public contractorName: string,
        public projectDescription: string,
        public totalPrice: number
    ) {
        super(name, content);
    }

    exportData(): Record<string, any> {
        return {
            "ID": this.id,
            "Created At": this.createdAt.toISOString(),
            "Name": this.name,
            "Contractor Name": this.contractorName,
            "Project Description": this.projectDescription,
            "Total Price": this.totalPrice
        };
    }
}
