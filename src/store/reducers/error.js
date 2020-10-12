import { WEB } from '../const'

const intialState = {
    show_err: false,
    msg: ''
}

export function errorReducer(state = intialState, action){
    switch(action.type){
        case WEB.SHOW_ERROR:
            return {show_err: true, msg: action.payload.response.data.error.message}
        
        case WEB.HIDE_ERROR:
            return {show_err: false, msg: ''}
            
        default:
            return {...state}
    }
}