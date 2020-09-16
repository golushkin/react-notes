import { LINK, NOTE } from '../../const'
import { create_note, create_link } from "./create"
import { update_note, update_link } from "./update"
import { delete_smt } from "./delete"
import { initialState } from './initialState'
// const initialState = {
//     currentMenu: '',
//     notes: []
// }

export function data(state = initialState, action){ 
    switch (action.type){
        case NOTE.CREATE:
            return create_note(state, action)
        case LINK.CREATE:
            return create_link(state, action)

        case NOTE.UPDATE:
            return update_note(state, action)
        case LINK.UPDATE:
            return update_link(state, action)
        
        case LINK.DELETE:
        case NOTE.DELETE:
            return delete_smt(state, action)

        case NOTE.CHANGE:
            return {
                ...state,
                currentMenu: action.payload
            }
        
        default:
            return state
    }
}

