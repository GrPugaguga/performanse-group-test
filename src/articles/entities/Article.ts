export class Article {
    id: number;
    title: string;
    content: string;
    isPublic: boolean; // <-- Исправлена опечатка
    authorId: number;
    createdAt: Date;
    updatedAt: Date;

    constructor(articleData: Partial<Article>) {
        Object.assign(this, articleData);
    }

    public static create(data: {
        title: string;
        content: string;
        authorId: number;
        isPublic: boolean; 
    }): Article {
        return new Article({ 
            ...data, 
            createdAt: new Date(), 
            updatedAt: new Date() 
        });
    }

    public isOwnedBy(userId: number): boolean {
        return this.authorId === userId;
    }

    public updateContent(newContent: string): void {
        this.content = newContent;
        this.updatedAt = new Date();
    }

    public updateTitle(newTitle: string): void {
        this.title = newTitle;
        this.updatedAt = new Date();
    }

    public publish(): void {
        this.isPublic = true; 
        this.updatedAt = new Date();
    }

    public unpublish(): void {
        this.isPublic = false; 
        this.updatedAt = new Date();
    }

    public isPubliс(): boolean { 
        return this.isPublic; 
    }
}
