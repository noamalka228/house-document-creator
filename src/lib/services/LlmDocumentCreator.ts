import { ITextExtractor } from '../domain/interfaces/ITextExtractor';
import { BaseDocument } from '../domain/entities/BaseDocument';

export class LlmDocumentCreator {
    constructor(
        private extractor: ITextExtractor,
        private prompt: string,
        private exampleFileContent: string,
        private docClassType: new (...args: any[]) => BaseDocument
    ) { }

    async createDocument(imageBuffer: Buffer, documentName: string): Promise<BaseDocument> {
        const rawText = await this.extractor.extractText(imageBuffer);

        // Here an actual LLM service call would map the `rawText` directly into a structured CSV line 
        // or a JSON object using the `prompt` and `exampleFileContent`.

        console.log('Sending to LLM with prompt:', this.prompt);
        console.log('Using example format:', this.exampleFileContent);
        console.log('Extracted raw text from image. Length:', rawText.length);

        // Simulating result mapped directly into the specific Document Type.
        // In reality, this data would come mapped cleanly from the LLM execution.
        return new this.docClassType(documentName, rawText, 'Simulated Value 1', 'Simulated Value 2', 5000);
    }
}
