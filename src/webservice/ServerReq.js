import axios from 'axios'

export class ServerReq {
    constructor(base_url = "http://localhost:8000", version_api = 1) {
        this.base_url = base_url
        this.version_api = version_api
    }

    sign_up(user) {
        return axios({
            method: 'post',
            url: `${this.base_url}/api/v${this.version_api}/users/`,
            data: user
        })
    }

    log_in(user) {
        return axios({
            method: 'post',
            url: `${this.base_url}/api/v${this.version_api}/users/login`,
            data: user
        })
    }

    get_notes(token) {
        return axios({
            method: 'get',
            url: `${this.base_url}/api/v${this.version_api}/notes/`,
            headers: {
                'Authorization': "Bearer " + token
            }
        })
    }

    get_notes_titles(token) {
        return axios({
            method: 'get',
            url: `${this.base_url}/api/v${this.version_api}/notes/titles/`,
            headers: {
                'Authorization': "Bearer " + token
            }
        })
    }

    get_notes_children(token, id) {
        return axios({
            method: 'get',
            url: `${this.base_url}/api/v${this.version_api}/notes/${id}`,
            headers: {
                'Authorization': "Bearer " + token
            }
        })
    }

    save_note(info, token) {
        return axios({
            method: 'post',
            url: `${this.base_url}/api/v${this.version_api}/notes/`,
            headers: {
                'Authorization': "Bearer " + token
            },
            data: info
        })
    }

    delete_note(id, token) {
        return axios({
            method: 'delete',
            url: `${this.base_url}/api/v${this.version_api}/notes/${id}`,
            headers: {
                'Authorization': "Bearer " + token
            },
        })
    }

    update_note(note, token) {
        return axios({
            method: 'put',
            url: `${this.base_url}/api/v${this.version_api}/notes/`,
            headers: {
                'Authorization': "Bearer " + token
            },
            data: note
        })
    }
}
