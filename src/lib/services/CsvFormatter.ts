import { IFormatter } from '../domain/interfaces/IFormatter';

export class CsvFormatter implements IFormatter<string> {
    format(data: Record<string, any>): string {
        const escape = (val: any) => `"${String(val ?? '').replace(/"/g, '""')}"`;
        return Object.values(data).map(escape).join(',');
    }

    formatHeaders(data: Record<string, any>): string {
        const escape = (val: any) => `"${String(val ?? '').replace(/"/g, '""')}"`;
        return Object.keys(data).map(escape).join(',');
    }
}
