export const addPagination = (totalCount: number, pageSize: number, pageNumber: number) => {
    return {
        pagesCount: Math.ceil(totalCount/pageSize),
        page: pageNumber,
        pageSize: pageSize,
        totalCount: totalCount,
    }
}
