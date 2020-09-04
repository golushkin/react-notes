import { LINK, NOTE } from "../const"

export function create_note(info){
    return {
        type: NOTE.CREATE,
        payload: info
    }
}

export function update_note(info){
    return {
        type: NOTE.UPDATE,
        payload: info
    }
}

export function change_note(route){
    return {
        type: NOTE.UPDATE,
        payload: route
    }
}

export function delete_note(route){
    return {
        type: NOTE.DELETE,
        payload: route
    }
}

export function create_link(info){
    return {
        type: LINK.CREATE,
        payload: info
    }
}

export function update_link(info){
    return {
        type: LINK.UPDATE,
        payload: info
    }
}

export function delete_link(route){
    return {
        type: LINK.DELETE,
        payload: route
    }
}

export function change_current_note(route){
    return {
        type: NOTE.CHANGE,
        payload: route
    }
}