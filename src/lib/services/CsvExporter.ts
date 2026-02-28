import { IExportable } from '../domain/interfaces/IExportable';
import { CsvFormatter } from './CsvFormatter';

export class CsvExporter {
    public static export(documents: IExportable<string>[]): string {
        if (documents.length === 0) return '';
        const formatter = new CsvFormatter();
        // TODO: Add export via LLM call
        return documents.map(doc => doc.export(formatter)).join('\n');
    }
}
