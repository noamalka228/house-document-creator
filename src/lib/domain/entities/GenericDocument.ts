import { BaseDocument } from './BaseDocument';

export class GenericDocument extends BaseDocument {
    constructor(
        name: string,
        content: string
    ) {
        super(name, content);
    }
}
