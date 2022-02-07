export class PaginingModel {
    private constructor(pageSize: number, page: number, collectionSize: number) {
        this.pageSize = pageSize;
        this.page = page;
        this.collectionSize = collectionSize;
    }
    static getNew(pageSize?: number, page?: number, collectionSize?: number): PaginingModel {
        return new PaginingModel(pageSize ?? 9, page ?? 1, collectionSize ?? 0);
    }

    public page: number;
    public pageSize: number;
    public collectionSize: number;
}