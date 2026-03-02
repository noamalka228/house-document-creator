import { NextRequest, NextResponse } from 'next/server';
import { DocumentProcessingService, isValidDocType, type DocumentType } from '@/lib/services/DocumentProcessingService';

export async function POST(req: NextRequest) {
    try {
        const formData = await req.formData();
        const content = formData.get('content') as string;
        const docType = formData.get('documentType') as string;
        const fileName = formData.get('fileName') as string;

        if (!content) return NextResponse.json({ error: 'No text content provided' }, { status: 400 });
        if (!docType || !isValidDocType(docType)) {
            return NextResponse.json({ error: 'Invalid document type' }, { status: 400 });
        }

        const processingService = new DocumentProcessingService();
        const result = await processingService.createDocumentFromText(
            content,
            docType as DocumentType,
            fileName
        );

        return NextResponse.json({
            document: result.document,
            xlsxBase64: result.xlsxBase64
        });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
