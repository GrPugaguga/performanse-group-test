import { Tag } from "./Tag";


export class Article {
    id: number;
    title: string;
    content: string;
    isPublic: boolean; 
    author_id: number;
    created_at: Date;
    updated_at: Date;
    tags?: Tag[];

    constructor(articleData: Partial<Article>) {
        Object.assign(this, articleData);
    }

    public static create(data: {
        title: string;
        content: string;
        author_id: number;
        isPublic: boolean; 
    }): Article {
        return new Article({ 
            ...data, 
            created_at: new Date(), 
            updated_at: new Date() 
        });
    }

    public isOwnedBy(userId: number): boolean {
        return this.author_id === userId;
    }

    public updateContent(newContent: string): void {
        this.content = newContent;
        this.updated_at = new Date();
    }

    public updateTitle(newTitle: string): void {
        this.title = newTitle;
        this.updated_at = new Date();
    }

    public publish(): void {
        this.isPublic = true; 
        this.updated_at = new Date();
    }

    public unpublish(): void {
        this.isPublic = false; 
        this.updated_at = new Date();
    }

    public setTags(tags: Tag[]): void {
        this.tags = tags;
        this.updated_at = new Date();
    }

    public getTags(): Tag[] | undefined {
        return this.tags;
    }

    public getTagNames(): string[] | undefined {
        return this.tags?.map(tag => tag.name);
    }

    public isPubliс(): boolean { 
        return this.isPublic; 
    }
}
