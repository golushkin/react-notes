/*import { NOTE } from '../../const'

export function delete_smt(state, action){
    const routeLen = action.payload.length
    if (routeLen > 1 && action.type === NOTE.DELETE)
        return deep_delete(state, action)
    else if (routeLen > 3)
        return deep_delete(state, action)
    else
        return shallow_delete(state, action)
}

function filter_arr(arr, index) {
    return arr.filter((note, i) => i !== index)
}

function split_route(route) {
    return route.split('-').map(index => Number(index))
}


function shallow_delete(state, action) {
    if (action.type === NOTE.DELETE) {
        const index = Number(action.payload)
        return {
            ...state,
            notes: filter_arr(state.notes, index)
        }
    }
    else {
        const [index1, index2] = split_route(action.payload)
        const notes = state.notes
        notes[index1].links = filter_arr(state.notes[index1].links, index2)
        return {
            ...state,
            notes
        }
    }
}

function deep_delete(state, action) {
    const indexes = split_route(action.payload)
    const notes = state.notes
    
    if (action.type === NOTE.DELETE)
        note_rec(notes, 1, indexes, action)
    else
        note_rec_link(notes, 1, indexes, action)
    return {
        ...state,
        notes
    }
}

function note_rec(arr, len, indexes, action) {
    const index = indexes[len - 1]

    if (indexes.length - 1 === len)
        arr[index].children = filter_arr(arr[index].children, indexes[len])
    else
        note_rec(arr[index].children, len + 1, indexes, action)
}

function note_rec_link(arr, len, indexes, action) {
    const index = indexes[len - 1]

    if (indexes.length - 1 === len)
        arr[index].links = filter_arr(arr[index].links, indexes[len])
    else
        note_rec_link(arr[index].children, len + 1, indexes, action)
}


*/