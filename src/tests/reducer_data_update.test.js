import { data } from '../store/reducers/data'
import { NOTE, LINK } from '../store/const'
import {
    get_state_for_deep,
    get_state_for_shallow,
    get_state_for_deep_link,
    get_state_for_shallow_link
} from './states'

/* NOTE UPDATE */

test('upadte existing note', () => {
    const expect_obj = get_state_for_shallow()
    expect_obj.notes[0] = {
        title: 'test00',
        desc: '',
        children: [],
        links: []
    }

    expect(data(get_state_for_shallow(), {
        type: NOTE.UPDATE,
        payload: {
            route: '0', note: {
                title: 'test00',
                desc: '',
                children: [],
                links: []
            }
        }
    })).toEqual(expect_obj)
})

test('update exsisting children note', () => {
    const expect_obj = get_state_for_deep()
    expect_obj.notes[0].children[0] = {
        title: 'test11',
        desc: '',
        children: [],
        links: []
    }
    expect(data(get_state_for_deep(), {
        type: NOTE.UPDATE,
        payload: {
            route: '0-0', note: {
                title: 'test11',
                desc: '',
                children: [],
                links: []
            }
        }
    })).toEqual(expect_obj)
})

/* LINK UPATE */
//--------------------------------------------------------
test('upadte existing link', () => {
    const expect_obj = get_state_for_shallow_link()
    expect_obj.notes[0].links = [{
        desc: '123',
        link: 'https://test-link1.com'
    }]

    expect(data(get_state_for_shallow_link(), {
        type: LINK.UPDATE,
        payload: {
            route: '0-0', info: {
                desc: '123',
                link: 'https://test-link1.com'
            }
        }
    })).toEqual(expect_obj)
})

//--------------------------------------------------------
test('update exsisting children link', () => {
    let expect_obj = get_state_for_deep_link()
    expect_obj.notes[0].children[0].links = [
        {
            desc: '123',
            link: 'https://test-link1.com'
        }
    ]

    expect(data(get_state_for_deep_link(), {
        type: LINK.UPDATE,
        payload: {
            route: '0-0-0', info: {
                desc: '123',
                link: 'https://test-link1.com'
            }
        }
    })).toEqual(expect_obj)
})