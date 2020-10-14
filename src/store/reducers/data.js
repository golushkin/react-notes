import { NOTE, WEB } from '../const'

const initialState = {
    currentMenu: '',
    notes: []
}


export function data(state = initialState, action){ 
    switch (action.type){
        case WEB.SAVE:
            return {...state, notes: action.payload}

        case NOTE.POPULATE:
            state.notes = [...state.notes]
            return populate_note(state, action)

        case NOTE.CHANGE:
            return {
                ...state,
                currentMenu: action.payload
            }
        
        default:
            return {...state}
    }
}


function populate_note(state, action) {
    const { route, note_children } = action.payload
    const indexes = route.split('-').map(index => Number(index))

    function note_rec(arr, len) {
        const index = indexes[len - 1]

        if (indexes.length === len)
            arr[index].children = note_children
        else
            return note_rec(arr[index].children, len + 1)

    }

    note_rec(state.notes, 1)

    return {...state}
}