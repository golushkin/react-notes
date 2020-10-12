import React, { Component } from 'react'
import { connect } from 'react-redux'
import {
    Button, TextField, CircularProgress, Box
} from '@material-ui/core'

import { Autocomplete } from '@material-ui/lab'
import { styled } from '@material-ui/core'
import { green } from '@material-ui/core/colors';
import CheckIcon from '@material-ui/icons/Check';
import { get_titles } from '../utils/work_with_notes'
import { validate, isFormValid } from '../utils/validate'
import { findNote } from '../utils/work_with_notes'
import { create_note, change_current_note } from '../store/actions/data'
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
    create_note: (info, place) => {
        dispatch(create_note(info))
        const route = info.route.length > 0 ? `${info.route}-${place}` : `${place}`
        dispatch(change_current_note(route))
    },
    change_current_note: ()=>dispatch(change_current_note('')),
    show_err: (err) =>dispatch(show_err(err))
})

export class NoteCreate extends Component {
    constructor(props) {
        super(props)
        this.state = {
            notes_titles: [],
            formValid: false,
            formControl: {
                title: {
                    value: '',
                    valid: { isValid: false, msg: [] },
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
            parent: '',
            saving: false,
            success: false,
            place_len: this.props.notes.length
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
            formValid: isFormValid(formControl, ['id', 'link_title', 'image'], true),
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
            formValid: isFormValid(formControl, ['id', 'link_title', 'image'], true)
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
                        matchPattern: /[-a-zA-Z0-9@:%_\+.~#?&\/=]{2,256}\.[a-z]{2,4}\b(\/[-a-zA-Z0-9@:%_\+.~#?&\/=]*)?/gi
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

    handleChangeRoute = (e, value, reason) => {
        if (reason === 'select-option') {
            this.setState({
                parent: value._id,
                //place_len: findNote(this.props.notes, value.route).children.length
            })
        }
        else if (reason === 'clear') {
            this.setState({
                parent: '',
                //place_len: this.props.notes.length
            })
        }
    }

    submit = (e) => {
        e.preventDefault()
        const { formControl, parent } = this.state
        const show_err = this.props.show_err
        const token = this.props.token
        const server = new ServerReq()
        const note = {
            title: formControl.title.value,
            desc: formControl.desc.value,
            links: formControl.links.map(link_obj => ({
                id: link_obj.id,
                link: link_obj.link.value,
                desc: link_obj.desc.value,
                link_title: link_obj.link.value,
                image: ""
            })),
            head: true,
            children: [],
        }

        if(parent){
            note.parent = parent
            note.head = false
        }

        this.setState({
            saving: true
        })

        get_data_from_links(note.links)
            .then(new_links => {
                note.links = new_links                
                return server.save_note(note, token)
            })
            .then(res =>{
                this.setState({
                    saving: false,
                    success: true
                })
                this.props.change_current_note()
                setTimeout(()=>this.props.history.push(routes.home),1000)
            })
            .catch(err => show_err(err))
        
    }

    componentDidMount() {
        const token = this.props.token
        const show_err = this.show_err
        const server = new ServerReq()

        server
            .get_notes_titles(token)
            .then(res => {
                this.setState({notes_titles: res.data})
            })
            .catch(err => show_err(err))
    }

    render() {
        const { title, desc, links } = this.state.formControl
        const { success, saving } = this.state
        if (saving || success) {
            return <div className="note-create">
                {success && <StyledIcon fontSize='large' style={{ color: green[500] }} />}
                {saving && <StyledProgress />}
            </div>
        }
        return (
            <Box padding={1} data-testid={'note-create'} className='note-create'>
                <form>
                    <Autocomplete
                        id="combo-box-demo"
                        ListboxProps={{ 'data-testid': 'auto-list' }}
                        options={this.state.notes_titles}
                        data-testid='autocomplete'
                        disabled={this.state.notes_titles.length > 0 ? false : true}
                        getOptionLabel={(option) => option.title}
                        renderInput={(params) => <TextField {...params} label="Parent Node" variant="outlined" />}
                        onChange={this.handleChangeRoute}
                    />
                    <Title title={title} callback={this.handleChange} />
                    <Desc value={desc.value} callback={this.handleChange} />
                    <Links createLink={this.createLink}
                        links={links}
                        handleChange={this.handleChange}
                        deleteLink={this.deleteLink} />

                    <Button data-testid='btn-cancel' onClick={this.goBack}>Cancel</Button>
                    <Button data-testid='btn-create' onClick={this.submit} disabled={!this.state.formValid} type='submit'>save</Button>
                </form>
            </Box>
        )
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(NoteCreate)

const StyledProgress = styled(CircularProgress)({
    marginLeft: 'calc(50% - 20px)'
})

const StyledIcon = styled(CheckIcon)({
    marginLeft: 'calc(50% - 20px)'
})
