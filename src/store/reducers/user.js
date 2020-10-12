import { WEB } from '../const'

const initialState = {
    token: '',
    userData: {}
}

export function userReducer(state = initialState, action) {
    switch (action.type) {
        case WEB.LOG_IN:
        case WEB.SIGN_UP:
            return {
                ...state, token: action.payload.token, userData: { username: action.payload.username }
            }
        case WEB.LOG_OUT:
            return {
                ...state, token: '', userData: {}
            }
        default:
            return { ...state }
    }
}