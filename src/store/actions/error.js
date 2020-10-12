import { WEB } from '../const'

export function show_err(err){
    return {
        type: WEB.SHOW_ERROR,
        payload: err
    }
}

export function hide_err(){
    return {
        type: WEB.HIDE_ERROR,
    }
}