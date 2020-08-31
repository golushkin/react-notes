import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Button, Typography } from '@material-ui/core'
import { styled } from '@material-ui/styles'
import { routes } from '../../routes'
import { findNote } from '../../utils'
import { DisplayChildren } from './DisplayChildren'
import { DisplayLinks } from './DisplayLinks'

const mapStateToProps = (state) => ({
    currentMenu: state.currentMenu,
    notes: state.notes
})


const Right = styled('div')({
    display: 'flex',
    justifyContent: 'flex-end'
})


export class NoteDisplay extends Component {

    constructor(props) {
        super(props)

        this.state = {
            note: {}
        }
    }

    find_note() {
        this.setState({
            note: findNote(this.props.notes, this.props.currentMenu)
        })
    }

    handleClick = () => {
        this.props.history.push(routes.create)
    }

    componentDidMount() {
        const { currentMenu, notes } = this.props
        const currentMenuExist = currentMenu.length > 0
        const notesExist = notes.length > 0
        const noteEmpty = Object.keys(this.state.note).length === 0

        if (currentMenuExist && notesExist && noteEmpty) {
            this.find_note()
        }
    }

    render() {
        const noteEmpty = Object.keys(this.state.note).length === 0
        if (noteEmpty) {
            return (
                <div className='display'>
                    <Right>
                        <Button onClick={this.handleClick}>Create Note</Button>
                    </Right>
                    <h1>
                        You don't have any notes, but you can create new if you press 'create new note'
                    </h1>
                </div>
            )
        }

        const note = this.state.note
        return (
            <div className='display'>
                <div className="note">
                    <Typography variant='h5'>{note.title}</Typography>
                    <Typography variant='body1'>{note.desc}</Typography>
                    <DisplayChildren note_children={note.children}/>
                    <DisplayLinks links={note.links}/>
                </div>
            </div>
        )
    }
}

export default connect(mapStateToProps, null)(NoteDisplay)
