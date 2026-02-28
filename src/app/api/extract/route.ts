import { NextRequest, NextResponse } from 'next/server';
import { DocumentProcessingService } from '@/lib/services/DocumentProcessingService';

export async function POST(req: NextRequest) {
    try {
        const formData = await req.formData();
        const file = formData.get('file') as File | null;
        const documentType = formData.get('type') as string;

        if (!file) return NextResponse.json({ error: 'No file provided' }, { status: 400 });
        if (!documentType) return NextResponse.json({ error: 'No document type provided' }, { status: 400 });

        const arrayBuffer = await file.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);

        const processingService = new DocumentProcessingService();
        const result = await processingService.processDocument(
            buffer,
            documentType,
            file.name
        );

        return NextResponse.json({
            document: result.document,
            csvHead: result.csvHead,
            csvData: result.csvData
        });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
