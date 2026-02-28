import { NextRequest, NextResponse } from 'next/server';
import { OcrSpaceTextExtractor } from '@/lib/services/OcrSpaceTextExtractor';
import { LlmDocumentCreator } from '@/lib/services/LlmDocumentCreator';
import { PriceProposalDocument } from '@/lib/domain/entities/PriceProposalDocument';
import { BillDocument } from '@/lib/domain/entities/BillDocument';
import { CsvFormatter } from '@/lib/services/CsvFormatter';

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

export async function POST(req: NextRequest) {
    try {
        const formData = await req.formData();
        const file = formData.get('file') as File | null;
        const documentType = formData.get('type') as string;

        if (!file) {
            return NextResponse.json({ error: 'No file provided' }, { status: 400 });
        }

        const arrayBuffer = await file.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);

        const config = LLM_TEMPLATES[documentType] || LLM_TEMPLATES['bill'];
        const extractor = new OcrSpaceTextExtractor();
        const creator = new LlmDocumentCreator(extractor, config.prompt, config.example, config.docClass);

        const document = await creator.createDocument(buffer, file.name || 'Unnamed' + new Date().toISOString());

        const formatter = new CsvFormatter();
        const csvHead = formatter.formatHeaders(document.exportData());
        const csvData = document.export(formatter);

        return NextResponse.json({
            document,
            csvHead,
            csvData
        });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
