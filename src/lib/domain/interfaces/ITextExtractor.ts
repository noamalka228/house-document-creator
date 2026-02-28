export interface ITextExtractor {
    extractText(imageBuffer: Buffer): Promise<string>;
}
