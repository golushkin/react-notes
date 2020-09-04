import React, { Component } from 'react'
import { connect } from 'react-redux'
import {
    Button, TextField, CircularProgress
} from '@material-ui/core'

import { Autocomplete } from '@material-ui/lab'
import { styled } from '@material-ui/core'
import { green } from '@material-ui/core/colors';
import CheckIcon from '@material-ui/icons/Check';
import { get_titles } from '../../utils/work_with_notes'
import { validate } from '../../utils/validate'
import { create_note } from '../../store/actions/data'
import { Title } from './Title'
import { Desc } from './Desc'
import { Links } from './Links'
import { get_data_from_links } from '../../webservice/RestData'
import { routes } from '../../routes'

const mapStateToProps = (state) => ({
    notes: state.notes
})

const mapDispatchToProps = {
    create_note
}

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
            success: false
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

    isFormValid(formControl) {
        let formValid = true
        for (let element in formControl) {
            if (Array.isArray(formControl[element])) {
                for (let item of formControl[element]) {
                    formValid = item.link.valid.isValid && formValid
                }
            }
            else {
                formValid = formControl[element].valid.isValid && formValid
            }
        }
        return formValid
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
            formValid: this.isFormValid(formControl)
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
                title: '',
                image: ''
            }
        ]

        this.setState({
            formValid: false,
            formControl
        })
    }

    handleChangeRoute = (e, value, reason) => {
        console.log(reason);
        if (reason === 'select-option') {
            this.setState({
                route: value.route
            })
        }
        else if (reason === 'clear') {
            this.setState({
                route: ''
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
                link: link_obj.link.value,
                desc: link_obj.desc.value,
                title: link_obj.link.value,
                image: ""
            })),
            children: [],
        }

        this.setState({
            saving: true
        })

        get_data_from_links(note)
            .then(new_note => {
                new_note.id = Date.now()
                this.props.create_note({
                    route, note: new_note
                })
                this.setState({
                    saving: false,
                    success: true
                })
                setTimeout(()=>this.props.history.push(routes.home),1000)
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
                {success && <StyledIcon fontSize='large' style={{ color: green[500] }}/>}
                {saving && <StyledProgress />}
            </div>
        }
        return (
            <div className='note-create'>
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
            </div>
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