import { NOTE } from '../../const'

export function update_note(state, action){
    const routeLen = action.payload.route.length
    if(routeLen > 1)
        return deep_update(state, action)
    return shallow_update(state, action)
}

export function update_link(state, action){
    const routeLen = action.payload.route.length
    if(routeLen > 2)
        return deep_update(state, action)
    return shallow_update_link(state, action)
}

function shallow_update(state, action){
    const index = Number(action.payload.route)
    state.notes[index] = action.payload.note
    return {
        ...state
    }
}


function shallow_update_link(state, action){
    const indexes = action.payload.route.split('-').map(index => Number(index))
    const note = state.notes[indexes[0]]
    note.links[indexes[1]] = action.payload.info

    return {
        ...state,
    }
}


function deep_update(state, action){
    const indexes = action.payload.route.split('-').map(index => Number(index))
    const notes = state.notes

    if(action.type === NOTE.UPDATE)
        note_rec(notes, 1, indexes, action)
    else
        note_rec_link(notes, 1, indexes, action)

    return {
        ...state, 
        notes
    }
}


function note_rec(arr, len, indexes, action){
    const index = indexes[len - 1]
    if(indexes.length === len)
        arr[index] = action.payload.note
    else 
        note_rec(arr[index].children, len + 1, indexes, action)
}


function note_rec_link(arr, len, indexes, action){
    const index = indexes[len - 1]
    if(indexes.length - 1 === len){
        const last_index = indexes[indexes.length - 1]
        const links = arr[index].links

        links[last_index] = action.payload.info
    }
    else 
        note_rec_link(arr[index].children, len + 1, indexes, action)
}