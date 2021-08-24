import { InMemoryCache, ApolloClient, createHttpLink } from "@apollo/client"
import { setContext } from '@apollo/client/link/context';
import { IS_LOGGED_IN } from "./queries/client";

export const cache = new InMemoryCache()

const httpLink = createHttpLink({
    uri: 'http://localhost:5000/graphql',
});

const authLink = setContext((_, { headers }) => {
    // get the authentication token from local storage if it exists
    const token = localStorage.getItem('token');
    // return the headers to the context so httpLink can read them
    return {
        headers: {
            ...headers,
            authorization: token ? `Bearer ${token}` : "",
        }
    }
});

const client = new ApolloClient({
    cache,
    link: authLink.concat(httpLink),
    // uri: 'http://localhost:5000/graphql',
    // request: operation => {
    //     const token = localStorage.getItem('token');
    //     operation.set
    //     operation.setContext({
    //         headers: {
    //             authorization: token ? 'Bearer ' + token: ''
    //         }
    //     })
    // }
})

cache.writeQuery({
    query: IS_LOGGED_IN,
    data: {
        isLoggedIn: !!localStorage.getItem('token')
    }
})


export default client