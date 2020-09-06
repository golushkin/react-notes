export function findNote(notes, route) {
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


/*get all node's titles recursive
[{title: '', route: ''}...]
*/

export function get_titles(notes_titles, notes, route, deep) {
  notes.forEach((el, i) => {
    let route_l = "";
    if (deep === 0) {
      route_l = `${i}`;
    } else {
      route_l = `${route}-${i}`;
    }
    if (el.children.length > 0) {
      get_titles(notes_titles, el.children, route_l, deep + 1);
    }
    notes_titles.push({
      title: el.title,
      route: route_l
    });
  });
}
