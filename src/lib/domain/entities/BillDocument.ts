import { BaseDocument } from './BaseDocument';

export class BillDocument extends BaseDocument {
    constructor(
        name: string,
        content: string,
        public providerName: string,
        public totalAmount: number,
        public dueDate: string
    ) {
        super(name, content);
    }

    exportData(): Record<string, any> {
        return {
            "ID": this.id,
            "Created At": this.createdAt.toISOString(),
            "Name": this.name,
            "Provider Name": this.providerName,
            "Total Amount": this.totalAmount,
            "Due Date": this.dueDate
        };
    }
}
