import { IFormatter } from '../domain/interfaces/IFormatter';
import * as ExcelJS from 'exceljs';

export class XlsxFormatter implements IFormatter<Buffer> {
    async format(data: Record<string, any>): Promise<Buffer> {
        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet("Document");

        // Setup columns dynamically based on data keys
        const keys = Object.keys(data);
        worksheet.columns = keys.map(key => ({ header: key, key: key }));

        // Add single row of data
        worksheet.addRow(data);

        const buffer = await workbook.xlsx.writeBuffer();
        return buffer as unknown as Buffer;
    }
}
