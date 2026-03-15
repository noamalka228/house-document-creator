export abstract class BaseDocument {
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
}
