import { IFormatter } from '../domain/interfaces/IFormatter';
import * as xlsx from 'xlsx';

export class XlsxFormatter implements IFormatter<Buffer> {
    format(data: Record<string, any>): Buffer {
        const workSheet = xlsx.utils.json_to_sheet([data]);
        const workBook = xlsx.utils.book_new();
        xlsx.utils.book_append_sheet(workBook, workSheet, "Document");
        return xlsx.write(workBook, { type: 'buffer', bookType: 'xlsx' });
    }
}
