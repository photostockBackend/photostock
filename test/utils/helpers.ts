// создаёт случайную пагинацию
export const generatePagination = (countItems: number) => {

    const pageSize = getRandomNumber(countItems)
    const pagesCount = Math.ceil(countItems / pageSize)
    const page = getRandomNumber(pagesCount)

    return {
        pageNumber: page, 
        pageSize: pageSize, 
        pagesCount: pagesCount, 
        totalCount: countItems,
    }
}

// из переданного объекта пагинации делает query-строку
export const generateQueryPagination = (query: any) => {
    if (Object.keys(query).length === 0) {
        return
    }
    let queryString = []
    Object.keys(query).forEach(q => {
        queryString.push(`${q}=${query[q]}`)
    })
    return `?${queryString.join('&')}`
}

// из сущностей в базе, делает срез под query-параметры
export const slicedEntityArray = (items: any, query: any) => {
    let array = []
    array = items
        .sort((a, b) => a.createdAt < b.createdAt ? 1 : -1)
        .slice((query.pageNumber-1) * query.pageSize, (query.pageNumber-1) * query.pageSize + query.pageSize)
        
    return array
}

// общий helper для случайного числа в пределах сущностей в базе
export const getRandomNumber = (max: number) => {
    return (Math.floor(Math.random() * max) + 1)
}