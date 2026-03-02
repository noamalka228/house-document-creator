import { NextRequest, NextResponse } from 'next/server';
import { DocumentProcessingService, isValidDocType, ImageType } from '@/lib/services/DocumentProcessingService';

export async function POST(req: NextRequest) {
    try {
        const formData = await req.formData();
        const file = formData.get('file') as File;
        const docType = formData.get('documentType') as string;

        if (!file) return NextResponse.json({ error: 'No file provided' }, { status: 400 });
        if (!docType || !isValidDocType(docType)) {
            return NextResponse.json({ error: 'Invalid document type' }, { status: 400 });
        }

        const arrayBuffer = await file.arrayBuffer();
        const bufferContent = Buffer.from(arrayBuffer);

        const processingService = new DocumentProcessingService();
        const text = await processingService.extractText(bufferContent, docType as ImageType);

        return NextResponse.json({ content: text });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
