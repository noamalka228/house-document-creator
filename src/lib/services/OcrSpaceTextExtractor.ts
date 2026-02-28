import { ITextExtractor } from '../domain/interfaces/ITextExtractor';

export class OcrSpaceTextExtractor implements ITextExtractor {
    private readonly apiKey = process.env.OCR_SPACE_API_KEY as string;

    constructor() {
        if (!this.apiKey) {
            throw new Error('OCR_SPACE_API_KEY is not defined');
        }
    }

    async extractText(imageBuffer: Buffer): Promise<string> {
        const base64Image = `data:image/jpeg;base64,${imageBuffer.toString('base64')}`;

        const formData = new FormData();
        formData.append('apikey', this.apiKey);
        formData.append('language', 'auto');
        formData.append('base64Image', base64Image);

        const response = await fetch('https://api.ocr.space/parse/image', {
            method: 'POST',
            body: formData,
        });

        if (!response.ok) {
            throw new Error(`OCR.Space API failed: ${response.statusText}`);
        }

        const data = await response.json();
        if (data.IsErroredOnProcessing) {
            throw new Error(`OCR Processing Error: ${data.ErrorMessage}`);
        }

        if (data.ParsedResults && data.ParsedResults.length > 0) {
            return data.ParsedResults.map((res: any) => res.ParsedText).join('\n');
        }

        return '';
    }
}
