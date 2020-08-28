import { data } from '../store/reducers/data'
import { NOTE, LINK } from '../store/const'
import {
    get_state_for_deep,
    get_state_for_shallow,
    get_state_for_deep_link,
    get_state_for_shallow_link
} from './states'

/* NOTE DELETE */

test('delete existing note', () => {
    const expect_obj = get_state_for_shallow()
    expect_obj.notes = []
    expect(data(get_state_for_shallow(), {
        type: NOTE.DELETE,
        payload: '0'
    })).toEqual(expect_obj)
})

test('delete exsisting children note', () => {
    const expect_obj = get_state_for_deep()
    expect_obj.notes[0].children = [] 
    expect(data(get_state_for_deep(), {
        type: NOTE.DELETE,
        payload: '0-0'
    })).toEqual(expect_obj)
})

/* LINK DELETE  */
//--------------------------------------------------------
test('delete existing link', () => {
    const expect_obj = get_state_for_shallow()
    const result = data(get_state_for_shallow_link(), {
        type: LINK.DELETE,
        payload: '0-0'
    })
    expect(result).toEqual(expect_obj)
})

//--------------------------------------------------------
test('delete exsisting children link', () => {
    let expect_obj = get_state_for_deep()

    expect(data(get_state_for_deep_link(), {
        type: LINK.DELETE,
        payload: '0-0-0'
    })).toEqual(expect_obj)
})