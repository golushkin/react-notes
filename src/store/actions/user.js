import { WEB } from '../const'

export function sign_up_user(user){
    return {
        type: WEB.SIGN_UP,
        payload: user
    }
}

export function log_in_user(user){
    return {
        type: WEB.LOG_IN,
        payload: user
    }
}

export function log_out_user(){
    return {
        type: WEB.LOG_OUT
    }
}
