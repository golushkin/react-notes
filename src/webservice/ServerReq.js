import { get_titles, create_note, delete_smt, update_note as update_action } from '../utils/work_with_notes'

let last_id = 3

let state = {
    notes: [
        {
            _id: '1',
            title: 'test',
            desc: 'test desc',
            links: [],
            children: [{
                _id: '2',
                title: 'test 2',
                desc: 'test desc',
                links: [],
                children: [
                    {
                        _id: '3',
                        title: 'test 3',
                        desc: 'test desc',
                        links: [],
                        children: []
                    }
                ]
            }]
        }
    ]
}

const time_out = 500


function get_err(msg, name, message) {
    return {
        response: {
            data: {
                msg,
                error: {
                    name,
                    message
                }
            }
        }
    }
}

function get_data(data_obj) {
    return {
        data: data_obj
    }
}

export class ServerReq {
    sign_up(user, err = false) {
        check_params(user)
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                if (err) {
                    reject(get_err("erorr", "ValidError", "username is already taken"))
                }
                resolve(get_data({
                    token: 'test_token',
                    username: "test_user"
                }))
            }, time_out)
        })
    }

    log_in(user, err = false) {
        check_params(user)
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                if (err) {
                    reject(get_err("erorr", "Error", "there is error in username or pass"))
                }
                resolve(get_data({
                    token: 'test_token',
                    username: "test_user"
                }))
            }, time_out)
        })
    }

    get_notes(token) {
        check_params(token)
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                const notes = state.notes.slice(1)
                resolve(get_data([
                    {
                        _id: '1',
                        title: 'test',
                        desc: 'test desc',
                        links: [],
                        children: [{
                            _id: '2',
                            title: 'test 2',
                            desc: 'test desc',
                            links: [],
                            children: [
                                '3'
                            ]
                        }]
                    },
                     ...notes,
                ]))
            }, time_out)
        })
    }

    get_notes_titles(token) {
        check_params(token)
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                const titles = []
                get_titles(titles, state.notes)
                resolve(get_data(titles))
            }, time_out)
        })
    }

    get_notes_children(token, id) {
        check_params(token, id)
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                resolve(get_data([
                    {
                        _id: '3',
                        title: 'test 3',
                        desc: 'test desc',
                        links: [],
                        children: []
                    }
                ]))
            }, time_out)
        })
    }

    save_note(info, token, route) {
        check_params(info, token)
        last_id++
        info._id = last_id
        state = create_note(state, { note: info, route })
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                resolve(get_data(info))
            }, time_out)
        })
    }

    delete_note(id, token, route) {
        check_params(id, token)
        state = delete_smt(state, route)
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                resolve(get_data({}))
            }, time_out)
        })
    }

    update_note(note, token, route) {
        check_params(note, token)
        // debugger
        state = update_action(state, { route, note })
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                resolve(get_data({}))
            }, time_out)
        })
    }
}


function check_params(...params) {
    params.forEach(param => {
        if (!param) {
            throw new Error("Didn't specified param")
        }
    })
}