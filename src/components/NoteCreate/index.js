import React, { Component } from 'react'
import { connect } from 'react-redux'
import {
    Button, TextField, CircularProgress, Box
} from '@material-ui/core'

import { Autocomplete } from '@material-ui/lab'
import { styled } from '@material-ui/core'
import { green } from '@material-ui/core/colors';
import CheckIcon from '@material-ui/icons/Check';
import { get_titles } from '../../utils/work_with_notes'
import { validate, isFormValid } from '../../utils/validate'
import { findNote } from '../../utils/work_with_notes'
import { create_note, change_current_note } from '../../store/actions/data'
import { Title } from '../Title'
import { Desc } from '../Desc'
import { Links } from '../Links'
import { get_data_from_links } from '../../webservice/RestData'
import { routes } from '../../routes'

const mapStateToProps = (state) => ({
    notes: state.notes
})

const mapDispatchToProps = dispatch => ({
    create_note: (info, place) => {
        dispatch(create_note(info))
        const route = info.route.length > 0 ? `${info.route}-${place}` : `${place}`
        dispatch(change_current_note(route))
    }
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
            route: '',
            saving: false,
            success: false,
            place_len: this.props.notes.length
        }
    }

    goBack = () => {
        this.props.history.goBack()
    }

    get_notes_titles() {
        if (this.state.notes_titles.length === 0) {
            const notes_titles = []
            get_titles(notes_titles, this.props.notes, "", 0);
            this.setState({ notes_titles })
        }
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
            formValid: this.isFormValid(formControl),
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
                route: value.route,
                place_len: findNote(this.props.notes, value.route).children.length
            })
        }
        else if (reason === 'clear') {
            this.setState({
                route: '',
                place_len: this.props.notes.length
            })
        }
    }

    submit = (e) => {
        e.preventDefault()
        const { formControl, route } = this.state
        const note = {
            id: Date.now(),
            title: formControl.title.value,
            desc: formControl.desc.value,
            links: formControl.links.map(link_obj => ({
                id: link_obj.id,
                link: link_obj.link.value,
                desc: link_obj.desc.value,
                link_title: link_obj.link.value,
                image: ""
            })),
            children: [],
        }

        this.setState({
            saving: true
        })

        get_data_from_links(note.links)
            .then(new_links => {
                note.links = new_links
                this.props.create_note({
                    route, note
                }, this.state.place_len)
                this.setState({
                    saving: false,
                    success: true
                })
                setTimeout(() => this.props.history.push(routes.home), 1000)
            })
    }

    componentDidMount() {
        this.get_notes_titles()
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
            <Box padding={1} className='note-create'>
                <form>
                    <Autocomplete
                        id="combo-box-demo"
                        options={this.state.notes_titles}
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

                    <Button onClick={this.goBack}>Cancel</Button>
                    <Button onClick={this.submit} disabled={!this.state.formValid} type='submit'>save</Button>
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
