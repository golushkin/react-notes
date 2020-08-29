import { createStore } from 'redux'
import { data } from './reducers/data'

export const store = createStore(
    data,
    window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
) 