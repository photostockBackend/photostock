const users = [
    {
        login: 'login-1',
        email: 'email-1@mail.com',
        password: 'password-1',
    },
    {
        login: 'login-2',
        email: 'email-2@mail.com',
        password: 'password-2',
    },
    {
        login: 'login-3',
        email: 'email-3@mail.com',
        password: 'password-3',
    },
    {
        login: 'login-4',
        email: 'email-4@mail.com',
        password: 'password-4',
    },
    {
        login: 'real-login',
        email: 'NameFamaly111@yandex.ru',
        password: 'real-password',
    }
]


class Variables {

    query = {
        pageSize: 10,
        pageNumber: 1,
    }

    createdUsers = [] 

    accessTokens = []

    cookies = []

    incorrectAnyObjectId = '640a31cb3acdb24a61157777'
    incorrectToken = '77777GciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2MzkyM2I5NTVlZTgwZDRkZGIyYzdlMjEiLCJkZXZpY2VJZCI6IjEwNzMxMjFjLTM1YWQtNGMyMi04ZTFhLWM2NTNmMzhkYmJmMyIsImlzc3VlZEF0IjoxNjcwNTI3ODkzMjg5LCJpYXQiOjE2NzA1Mjc4OTMsImV4cCI6MTY3MDUyODE5M30.53_vG0GlhTqXosc2sq2-TnzxEyItCLrDHw8ZJjWRSQc'

    setQuery(query: any){
        this.query = query
    }

    setCreatedUsers(createdUsers: any[]){
        this.createdUsers = createdUsers
    }
    
    setAccessTokens(accessToken: string[]){
        this.accessTokens = accessToken
    }

    setCookies(cookies: any[]){
        this.cookies = cookies
    }
    
}

const variables = new Variables()

export {
    users, 
    variables,
}
