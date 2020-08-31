export function findNote(notes, route){
    if (route.length > 1) {
        return find_deep_note(notes, route)
    }
    return find_shallow_note(notes, route)
}

function find_shallow_note(notes, route){
    const index = Number(route)
    return notes[index]
}

function find_deep_note(notes, route){
    const indexes = route.split('-').map(index => Number(index))

    function note_rec(arr, len){
        const index = indexes[len - 1]

        if(indexes.length === len)
           return arr[index]
        else 
            note_rec(arr[index].children, len + 1)

    }

    return note_rec(notes, 1)
}
