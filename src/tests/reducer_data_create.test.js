import { data } from '../store/reducers/data'
import { NOTE, LINK } from '../store/const'
import { get_empty_state, get_state_for_deep, get_state_for_shallow } from './states'

/* ADD NOTES */

test('add note to empty state', () => {
    expect(data(get_empty_state(), {
        type: NOTE.CREATE,
        payload: { route: '', title: 'test0' }
    })).toEqual(get_state_for_shallow())
})

test('add note to exsist note', () => {
    expect(data(get_state_for_shallow(), {
        type: NOTE.CREATE,
        payload: { route: '0', title: 'test1' }
    })).toEqual(get_state_for_deep())
})

test('add note to children of exsisting note', () => {
    expect(data(get_state_for_deep(), {
        type: NOTE.CREATE,
        payload: { route: '0-0', title: 'test2' }
    })).toEqual({
        currentMenu: '',
        notes: [
            {
                title: 'test0',
                desc: '',
                children: [
                    {
                        title: 'test1',
                        desc: '',
                        children: [
                            {
                                title: 'test2',
                                desc: '',
                                children: [],
                                links: []
                            }
                        ],
                        links: []
                    }
                ],
                links: []
            }
        ]
    })
})


/* ADD LINKS */


test('add link to shallow note', () => {
    expect(data(get_state_for_shallow(), {
        type: LINK.CREATE,
        payload: {
            route: '', info: {
                desc: '',
                link: 'https://test-link.com'
            }
        }
    })).toEqual({
        currentMenu: '',
        notes: [
            {
                title: 'test0',
                desc: '',
                children: [],
                links: [
                    {
                        desc: '',
                        link: 'https://test-link.com'
                    }
                ]
            }
        ]
    })
})

test('add link to children note', () => {
    expect(data(get_state_for_deep(), {
        type: LINK.CREATE,
        payload: {
            route: '0-0', info: {
                desc: '',
                link: 'https://test-link.com'
            }
        }
    })).toEqual(
        {
            currentMenu: '',
            notes: [
                {
                    title: 'test0',
                    desc: '',
                    children: [
                        {
                            title: 'test1',
                            desc: '',
                            children: [],
                            links: [{
                                desc: '',
                                link: 'https://test-link.com'
                            }]
                        }
                    ],
                    links: []
                }
            ]
        })
})
