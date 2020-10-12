import { NOTE } from '../../const'

function get_note_obj(action) {
    const note = action.payload.note
    return note
}

function get_link_obj(action) {
    return action.payload.info
}


export function populate_note(state, action) {
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

export function create_note(state, action) {
    const routeLen = action.payload.route.length
    const routeExsist = routeLen > 0

    if (routeExsist && routeLen > 1)
        return create_deep(state, action)
    if (routeExsist)
        return create_shallow(state, action)

    return {
        ...state,
        notes: [
            ...state.notes,
            get_note_obj(action)
        ]
    }
}


export function create_link(state, action) {
    const routeLen = action.payload.route.length

    if (routeLen > 1)
        return create_deep(state, action)

    return create_shallow(state, action)
}


function create_deep(state, action) {
    const indexes = action.payload.route.split('-').map(index => Number(index))
    const notes = state.notes

    function note_rec(arr, len) {
        const index = indexes[len - 1]

        if (indexes.length === len)
            if (action.type === NOTE.CREATE)
                arr[index].children.push(get_note_obj(action))
            else
                arr[index].links.push(get_link_obj(action))
        else
            note_rec(arr[index].children, len + 1)

    }

    note_rec(notes, 1)
    return {
        ...state,
        notes
    }
}


function create_shallow(state, action) {
    const index = Number(action.payload.route)
    const notes = state.notes

    if (action.type === NOTE.CREATE) {
        notes[index].children = [
            ...notes[index].children,
            get_note_obj(action)
        ]
    }
    else {
        notes[index].links = [
            ...notes[index].links,
            get_link_obj(action)
        ]
    }

    return {
        ...state,
        notes
    }
}