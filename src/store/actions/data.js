import { NOTE, WEB } from "../const"


export function populate_note(note_children, route){
    return {
        type: NOTE.POPULATE,
        payload:{
            note_children,
            route
        }
    }
}

export function save_notes(notes){
    return {
        type: WEB.SAVE,
        payload: notes
    }
}

export function change_current_note(route){
    return {
        type: NOTE.CHANGE,
        payload: route
    }
}