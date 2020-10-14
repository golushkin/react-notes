export function findNote(notes, route) {
  if (!notes.length) {
    return {}
  }
  if (route.length > 1) {
    return find_deep_note(notes, route)
  }
  return find_shallow_note(notes, route)
}

function find_shallow_note(notes, route) {
  const index = Number(route)
  return notes[index]
}

function find_deep_note(notes, route) {
  const indexes = route.split('-').map(index => Number(index))

  function note_rec(arr, len) {
    const index = indexes[len - 1]

    if (indexes.length === len)
      return arr[index]
    else
      return note_rec(arr[index].children, len + 1)

  }

  return note_rec(notes, 1)
}



export function get_titles(notes_titles, notes, route = '', deep = 0) {
  notes.forEach((el, i) => {
    let route_l = "";
    if (deep === 0) {
      route_l = `${i}`;
    } else {
      route_l = `${route}-${i}`;
    }
    if (el.children.length > 0) {
      get_titles(notes_titles, el.children, route_l, deep + 1)
    }
    notes_titles.push({
      _id: el._id,
      title: el.title,
      route: route_l,
    });
  });
}

/* SAVE */
function get_note_obj(action) {
  const note = action.note
  return note
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

  return { ...state }
}

export function create_note(state, action) {
  const routeLen = action.route.length
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
  const routeLen = action.route.length

  if (routeLen > 1)
    return create_deep(state, action)

  return create_shallow(state, action)
}


function create_deep(state, action) {
  const indexes = action.route.split('-').map(index => Number(index))
  const notes = state.notes

  function note_rec(arr, len) {
    const index = indexes[len - 1]

    if (indexes.length === len)
      arr[index].children.push(get_note_obj(action))
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
  const index = Number(action.route)
  const notes = state.notes

  notes[index].children = [
    ...notes[index].children,
    get_note_obj(action)
  ]

  return {
    ...state,
    notes
  }
}

/* DELETE */

export function delete_smt(state, route) {
  const routeLen = route.length
  if (routeLen > 1)
    return deep_delete(state, route)
  else
    return shallow_delete(state, route)
}

function filter_arr(arr, index) {
  return arr.filter((note, i) => i !== index)
}

function split_route(route) {
  return route.split('-').map(index => Number(index))
}


function shallow_delete(state, route) {
  const index = Number(route)
  return {
    notes: filter_arr(state.notes, index)
  }
}

function deep_delete(state, route) {
  const indexes = split_route(route)
  const notes = state.notes

  note_rec(notes, 1, indexes, route)

  return {
    notes
  }
}

function note_rec(arr, len, indexes) {
  const index = indexes[len - 1]

  if (indexes.length - 1 === len)
    arr[index].children = filter_arr(arr[index].children, indexes[len])
  else
    note_rec(arr[index].children, len + 1, indexes)
}


/* UPDATE */

export function update_note(state, action) {
  const routeLen = action.route.length
  if (routeLen > 1)
    return deep_update(state, action)
  return shallow_update(state, action)
}


function shallow_update(state, action) {
  const index = +action.route
  state.notes[index] = action.note
  return {
    ...state
  }
}


function deep_update(state, action) {
  const indexes = action.route.split('-').map(index => +index)
  const notes = state.notes

  note_rec_upd(notes, 1, indexes, action)

  return {
    ...state,
    notes
  }
}


function note_rec_upd(arr, len, indexes, action) {
  const index = indexes[len - 1]
  if (indexes.length === len)
    arr[index] = action.note
  else
    note_rec(arr[index].children, len + 1, indexes, action)
}

