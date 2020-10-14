import { userReducer } from '../store/reducers/user'
import { errorReducer } from '../store/reducers/error'
import { save_notes, populate_note, change_current_note } from '../store/actions/data'
import { log_in_user, log_out_user } from '../store/actions/user'
import { show_err, hide_err } from '../store/actions/error'
import { data } from '../store/reducers/data'


describe('user reducer', () => {
    test('sign up/ log in', () => {
        const token = 'test_token'
        const username = 'test_user'
        const expect_obj = {
            token,
            userData: {
                username
            }
        }

        expect(
            userReducer(
                { token: "", userData: {} },
                log_in_user({ token, username }))
        )
            .toEqual(expect_obj)
    })

    test('log out', () => {
        const token = 'test_token'
        const username = 'test_user'
        const state = {
            token,
            userData: {
                username
            }
        }

        expect(userReducer(state, log_out_user()))
            .toEqual({ token: '', userData: {} })
    })
})


describe('data reducer', () => {
    test('save notes from server', () => {
        const note = {
            title: 'test_title',
            desc: 'test desc',
            links: [],
            children: []
        }
        const expect_obj = {
            currentMenu: '',
            notes: [
                note
            ]
        }

        expect(data({
            currentMenu: '',
            notes: []
        }, save_notes([note]))).toEqual(expect_obj)
    })

    test('populate exsisting note', () => {
        const note = {
            title: 'test_title',
            desc: 'test desc',
            links: [],
            children: [{
                title: 'test_title 1',
                desc: 'test desc',
                links: [],
                children: ['1']
            }]
        }

        const state = {
            currentMenu: '',
            notes: [
                note
            ]
        }

        const expect_obj = {
            currentMenu: '',
            notes: [
                {
                    title: 'test_title',
                    desc: 'test desc',
                    links: [],
                    children: [{
                        title: 'test_title 1',
                        desc: 'test desc',
                        links: [],
                        children: [{
                            title: 'test_title 2',
                            desc: 'test desc',
                            links: [],
                            children: []
                        }]
                    }]
                }
            ]
        }

        expect(data(state, populate_note([{
            title: 'test_title 2',
            desc: 'test desc',
            links: [],
            children: []
        }], '0-0'))).toEqual(expect_obj)
    })

    test('change curren route', () => {
        const note = {
            title: 'test_title',
            desc: 'test desc',
            links: [],
            children: [{
                title: 'test_title 1',
                desc: 'test desc',
                links: [],
                children: ['1']
            }]
        }

        const state = {
            currentMenu: '',
            notes: [
                note
            ]
        }

        const expect_obj = {
            currentMenu: '0',
            notes: [
                note
            ]
        }

        expect(data(state, change_current_note('0'))).toEqual(expect_obj)
    })

})


describe('error reducer', () => {
    test('show err', () => {
        const err = {
            response: {
                data: {
                    msg: "Smt bad",
                    error: {
                        name: "ErrorName",
                        message: "message"
                    }
                }
            }
        }
        const state = {
            show_err: false,
            msg: '',
        }

        const expect_obj = {
            show_err: true,
            msg: 'message'
        }

        expect(errorReducer(state, show_err(err))).toEqual(expect_obj)
    })

    test('hide err', () => {
        const state = {
            show_err: true,
            msg: ',sg',
        }

        const expect_obj = {
            show_err: false,
            msg: ''
        }

        expect(errorReducer(state, hide_err())).toEqual(expect_obj)
    })
})