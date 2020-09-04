import { data } from '../store/reducers/data'
import { NOTE, LINK } from '../store/const'
import { get_empty_state, get_state_for_deep, get_state_for_shallow } from './states'

/* ADD NOTES */

test('add note to empty state', () => {
    expect(data(get_empty_state(), {
        type: NOTE.CREATE,
        payload: { route: '', note: { title: 'test0', desc: '', children: [], links: [] } }
    })).toEqual(get_state_for_shallow())
})

test('add note to exsist note', () => {
    expect(data(get_state_for_shallow(), {
        type: NOTE.CREATE,
        payload: { route: '0', note: { title: 'test1', desc: '', children: [], links: [] } }
    })).toEqual(get_state_for_deep())
})

test('add note to children of exsisting note', () => {
    const expext_note = get_state_for_deep()
    const note = { title: 'test2', desc: '', children: [], links: [] }

    expext_note.notes[0].children[0].children = [note]

    expect(data(get_state_for_deep(), {
        type: NOTE.CREATE,
        payload: { route: '0-0', note }
    })).toEqual(expext_note)
})


/* ADD LINKS */


test('add link to shallow note', () => {
    const expect_obj = get_state_for_shallow()
    const link = {
        desc: '',
        link: 'https://test-link.com'
    }
    expect_obj.notes[0].links = [link]

    expect(data(get_state_for_shallow(), {
        type: LINK.CREATE,
        payload: {
            route: '0', info: link
        }
    })).toEqual(expect_obj)
})

test('add link to children note', () => {
    const expect_obj = get_state_for_deep()
    const link = {
        desc: '',
        link: 'https://test-link.com'
    }
    expect_obj.notes[0].children[0].links = [link]

    expect(data(get_state_for_deep(), {
        type: LINK.CREATE,
        payload: {
            route: '0-0', info: link
        }
    })).toEqual(
        expect_obj)
})
