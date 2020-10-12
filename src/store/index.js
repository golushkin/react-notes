import { createStore, combineReducers } from 'redux'
import { data } from './reducers/data'
import { userReducer } from './reducers/user'
import { errorReducer } from './reducers/error'

const rootReducer = combineReducers({user: userReducer, note: data, error: errorReducer})

export const store = createStore(
    rootReducer,
    window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
) 