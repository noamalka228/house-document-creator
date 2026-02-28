import { OcrSpaceTextExtractor } from './OcrSpaceTextExtractor';
import { LlmDocumentCreator } from './LlmDocumentCreator';
import { PriceProposalDocument } from '../domain/entities/PriceProposalDocument';
import { BillDocument } from '../domain/entities/BillDocument';
import { BaseDocument } from '../domain/entities/BaseDocument';
import { CsvFormatter } from './CsvFormatter';

export interface ProcessedDocumentResult {
    document: BaseDocument;
    csvHead: string;
    csvData: string;
}

const LLM_TEMPLATES: Record<string, { prompt: string, example: string, docClass: any }> = {
    price_proposal: {
        prompt: "Extract contractorName, projectDescription, and totalPrice from the price proposal.",
        example: "{ contractorName: 'Name', projectDescription: 'Details', totalPrice: 1000 }",
        docClass: PriceProposalDocument
    },
    bill: {
        prompt: "Extract providerName, totalAmount, and dueDate from the bill.",
        example: "{ providerName: 'Provider', totalAmount: 150.00, dueDate: 'YYYY-MM-DD' }",
        docClass: BillDocument
    }
};

export class DocumentProcessingService {
    public async processDocument(
        imageBuffer: Buffer,
        documentType: string,
        fileName: string
    ): Promise<ProcessedDocumentResult> {
        // Find the template configuration for this document type
        const config = LLM_TEMPLATES[documentType];

        if (!config) {
            throw new Error(`Unsupported document type: ${documentType}`);
        }

        // Initialize dependencies
        const extractor = new OcrSpaceTextExtractor();
        const creator = new LlmDocumentCreator(extractor, config.prompt, config.example, config.docClass);

        // Process and generate the domain entity
        const document = await creator.createDocument(imageBuffer, fileName || `Unnamed_${new Date().toISOString()}`);

        // Format the document representations
        const formatter = new CsvFormatter();
        const csvHead = formatter.formatHeaders(document.exportData());
        const csvData = document.export(formatter);

        return {
            document,
            csvHead,
            csvData
        };
    }
}
