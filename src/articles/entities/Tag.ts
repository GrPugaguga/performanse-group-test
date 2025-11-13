export class Tag{
    id: number;
    name: string;

    constructor(tagData: Partial<Tag>) {
        Object.assign(this, tagData);
    }

    public static normalize( name: string ): string {
        if (!name || name.trim() === '') {
            throw new Error('Tag name cannot be empty');
        }
        return name.trim().toLowerCase();
    }
}