import { WEB } from '../const'

const initialState = {
    token: '',
    userData: {}
}

export function userReducer(state = initialState, action) {
    switch (action.type) {
        case WEB.LOG_IN:
        case WEB.SIGN_UP:
            localStorage.setItem("user",JSON.stringify(action.payload))
            return {
                ...state, token: action.payload.token, userData: { username: action.payload.username }
            }
        case WEB.LOG_OUT:
            localStorage.removeItem("user")
            return {
                ...state, token: '', userData: {}
            }
        default:
            return { ...state }
    }
}