export class PaginingModel {
    constructor() {
        this.pageSize = 7;
        this.page = 1;
        this.collectionSize = 0;
    }
    static getNew(pageSize?: number, page?: number, collectionSize?: number): PaginingModel {
        return {
            page: page ?? 1,
            pageSize: pageSize ?? 7,
            collectionSize: collectionSize ?? 0
        } as PaginingModel;
    }

    public page: number;
    public pageSize: number;
    public collectionSize: number;
}