import { BaseDocument } from './BaseDocument';

export class GenericDocument extends BaseDocument {
    constructor(
        name: string,
        content: string
    ) {
        super(name, content);
    }

    exportData(): Record<string, any> {
        return {
            "ID": this.id,
            "Created At": this.createdAt.toISOString(),
            "Name": this.name,
            "Content": this.content
        };
    }
}
