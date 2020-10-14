import React, { Component } from 'react'
import { connect } from 'react-redux'
import {
    Button, CircularProgress,
    Dialog, DialogActions,
    DialogContentText, DialogTitle,
    DialogContent, Box
} from '@material-ui/core'
import { styled } from '@material-ui/core'
import { green } from '@material-ui/core/colors';
import CheckIcon from '@material-ui/icons/Check';
import { validate, isFormValid } from '../utils/validate'
import { findNote } from '../utils/work_with_notes'
import { change_current_note } from '../store/actions/data'
import { show_err } from '../store/actions/error'
import { Title } from './FormElements/Title'
import { Desc } from './FormElements/Desc'
import { Links } from './FormElements/Links'
import { get_data_from_links } from '../webservice/RestData'
import { routes } from '../routes'
import { ServerReq } from '../webservice/ServerReq'

const mapStateToProps = (state) => ({
    notes: state.note.notes,
    token: state.user.token
})

const mapDispatchToProps = dispatch => ({
    change_current_note: () => dispatch(change_current_note("")),
    show_err: (err) => dispatch(show_err(err))
})

function get_state_links(note) {
    if (!Object.keys(note).length) {
        return []
    }
    return note.links.map(item => ({
        id: item.id,
        link: {
            value: item.link,
            valid: { isValid: true, msg: [] },
            touch: false,
            validationRules: {
                isRequired: true,
                matchPattern: /[-a-zA-Z0-9@:%_+.~#?&/=]{2,256}\.[a-z]{2,4}\b(\/[-a-zA-Z0-9@:%_+.~#?&/=]*)?/gi
            }
        },
        desc: {
            value: item.desc,
            touch: false,
            valid: { isValid: true, msg: [] },
            validationRules: {

            }
        },
        link_title: item.link_title,
        image: item.image
    }))
}


export class NoteEdit extends Component {
    constructor(props) {
        super(props)
        this.state = {
            formValid: true,
            formControl: {
                title: {
                    value: '',
                    valid: { isValid: true, msg: [] },
                    touch: false,
                    validationRules: {
                        maxLen: 50,
                        isRequired: true
                    }
                },
                desc: {
                    value: '',
                    touch: false,
                    valid: { isValid: true, msg: [] },
                    validationRules: {}
                },
                links: [],
            },
            route: this.props.match.params.route,
            saving: false,
            success: false,
            note: {},
            open_modal: false,
            delete_spinner: false,
            update_spinner: false,
        }
    }

    goBack = () => {
        this.props.history.goBack()
    }

    handleChange = (e, index = 0, type = 'note') => {
        const name = e.target.name
        const value = e.target.value

        const formControl = {
            ...this.state.formControl
        }

        if (type === 'note') {
            const updateEl = {
                ...formControl[name]
            }
            updateEl.value = value
            updateEl.touch = true
            updateEl.valid = validate(value, updateEl.validationRules)
            formControl[name] = updateEl

        }
        else {
            const updateEl = {
                ...formControl.links[index][name]
            }
            updateEl.value = value
            updateEl.touch = true
            updateEl.valid = validate(value, updateEl.validationRules)
            formControl.links[index][name] = updateEl
        }

        this.setState({
            formValid: isFormValid(formControl, ['children', '_id', 'image', 'link_title'], true),
            formControl
        })
    }

    deleteLink = (link) => {
        const formControl = {
            ...this.state.formControl
        }
        formControl.links = formControl.links.filter((item) => item.id !== link.id)

        this.setState({
            formControl,
            formValid: isFormValid(formControl, ['children', '_id', 'image', 'link_title'], true)
        })
    }

    createLink = () => {
        const formControl = {
            ...this.state.formControl
        }

        formControl.links = [
            ...this.state.formControl.links,
            {
                id: Date.now(),
                link: {
                    value: '',
                    valid: { isValid: false, msg: [] },
                    touch: false,
                    validationRules: {
                        isRequired: true,
                        matchPattern: /[-a-zA-Z0-9@:%_+.~#?&/=]{2,256}\.[a-z]{2,4}\b(\/[-a-zA-Z0-9@:%_+.~#?&/=]*)?/gi
                    }
                },
                desc: {
                    value: '',
                    touch: false,
                    valid: { isValid: true, msg: [] },
                    validationRules: {

                    }
                },
                link_title: '',
                image: ''
            }
        ]

        this.setState({
            formValid: false,
            formControl
        })
    }

    handleOpenModal = () => {
        this.setState({ open_modal: true })
    }

    handleCloseModal = () => {
        this.setState({ open_modal: false })
    }


    handleDeleteNote = () => {
        const server = new ServerReq()
        const note_id = this.state.note._id
        const token = this.props.token
        const show_err = this.props.show_err

        this.setState({ delete_spinner: true, open_modal: false })

        server
            .delete_note(note_id, token)
            .then(res => {
                this.setState({ delete_spinner: false })
                this.props.change_current_note()
                this.props.history.push(routes.home)
            })
            .catch(err => show_err(err))

    }

    submit = (e) => {
        e.preventDefault()
        const { formControl, note } = this.state
        const { token, change_current_note, show_err } = this.props

        const note_obj = {
            _id: note._id,
            title: formControl.title.value,
            desc: formControl.desc.value,
        }
        const links_obj = formControl.links.map(link_obj => ({
            id: link_obj.id,
            link: link_obj.link.value,
            desc: link_obj.desc.value,
            link_title: link_obj.link_title,
            image: link_obj.image
        }))
        const original_links_id = note.links.map(item => item.id)
        const new_links = []
        const old_links = []

        for (let i = 0; i < links_obj.length; i++) {
            let item = links_obj[i]
            let index = original_links_id.indexOf(item.id)
            if (index >= 0) {
                if (note.links[index].link === item.link) {
                    old_links.push(item)
                }
                else {
                    item.link_title = item.link
                    new_links.push(item)
                }
            }
            else {
                item.link_title = item.link
                new_links.push(item)
            }
        }

        this.setState({
            saving: true
        })

        const server = new ServerReq()

        if (new_links.length === 0) {
            note_obj.links = old_links

            server
                .update_note(note_obj, token)
                .then(res => {
                    this.setState({
                        saving: false,
                        success: true
                    })
                    change_current_note()
                    setTimeout(() => this.props.history.push(routes.home), 1000)
                })
                .catch(err => show_err(err))
        }
        else {
            get_data_from_links(new_links)
                .then(links_res => {
                    note_obj.links = [...links_res, ...old_links]

                    return server.update_note(note_obj, token)
                })
                .then(res => {
                    this.setState({
                        saving: false,
                        success: true
                    })
                    change_current_note()
                    setTimeout(() => this.props.history.push(routes.home), 1000)
                })
                .catch(err => show_err(err))
        }
    }

    componentDidMount() {
        const note = findNote(this.props.notes, this.props.match.params.route)
        const links = get_state_links(note)
        const formControl = this.state.formControl

        this.setState({
            note,
            formControl: {
                title: {
                    ...formControl.title,
                    value: note.title,
                },
                desc: {
                    ...formControl.desc,
                    value: note.desc,
                },
                links,
            },
        })
    }

    render() {
        const { title, desc, links } = this.state.formControl
        const { success, saving } = this.state
        const { history, notes } = this.props

        if (!notes.length) {
            history.replace(routes.home)
        }

        if (saving || success) {
            return <div className="note-create">
                {success && <StyledIcon fontSize='large' style={{ color: green[500] }} />}
                {saving && <StyledProgress />}
            </div>
        }
        return (
            <Box padding={1} data-testid={'note-edit'} className='note-edit'>
                <form>
                    <Title title={title} callback={this.handleChange} />
                    <Desc value={desc.value} callback={this.handleChange} />
                    <Links createLink={this.createLink}
                        links={links}
                        handleChange={this.handleChange}
                        deleteLink={this.deleteLink} />
                    <Button data-testid={'btn-cancel'} onClick={this.goBack}>Cancel</Button>
                    <Button data-testid={'btn-update'} onClick={this.submit} disabled={!this.state.formValid}>Update</Button>
                    <Button data-testid={'btn-delete'} onClick={this.handleOpenModal} color='secondary'>{this.state.delete_spinner ? <CircularProgress size={20} /> : "Delete Note"}</Button>
                    <Dialog
                        data-testid={'edit-dialog'}
                        open={this.state.open_modal}
                        onClose={this.handleCloseModal}
                        aria-labelledby="alert-dialog-title"
                        aria-describedby="alert-dialog-description"
                    >
                        <DialogTitle id="alert-dialog-title">{'Are you sure about that?'}</DialogTitle>
                        <DialogContent>
                            <DialogContentText id="alert-dialog-description">
                                {`You will delete note "${this.state.note.title}", all his childrens and links.`}.
                        </DialogContentText>
                        </DialogContent>
                        <DialogActions>
                            <Button data-testid={'btn-dialog-dis'} onClick={this.handleCloseModal} color="primary">
                                Disagree
                            </Button>
                            <Button data-testid={'btn-dialog-ag'} onClick={this.handleDeleteNote} color="primary" autoFocus>
                                Agree
                            </Button>
                        </DialogActions>
                    </Dialog>
                </form>
            </Box>
        )
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(NoteEdit)

const StyledProgress = styled(CircularProgress)({
    marginLeft: 'calc(50% - 20px)'
})

const StyledIcon = styled(CheckIcon)({
    marginLeft: 'calc(50% - 20px)'
})
