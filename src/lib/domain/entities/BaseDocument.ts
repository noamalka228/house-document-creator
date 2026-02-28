import { IExportable } from '../interfaces/IExportable';
import { IFormatter } from '../interfaces/IFormatter';

export abstract class BaseDocument implements IExportable<string> {
    public id: string;
    public createdAt: Date;
    public name: string;
    public content: string;

    constructor(name: string, content: string) {
        this.id = crypto.randomUUID();
        this.createdAt = new Date();
        this.name = name;
        this.content = content;
    }

    abstract exportData(): Record<string, any>;

    export(formatter: IFormatter<string>): string {
        return formatter.format(this.exportData());
    }
}
