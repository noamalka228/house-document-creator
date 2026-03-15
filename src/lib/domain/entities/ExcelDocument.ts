import { BaseDocument } from './BaseDocument';

export class ExcelDocument extends BaseDocument {
    public xlsxBase64: string;

    constructor(
        name: string,
        content: string,
        xlsxBase64: string
    ) {
        super(name, content);
        this.xlsxBase64 = xlsxBase64;
    }
}
