import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Button, Typography, Box } from '@material-ui/core'
import { styled } from '@material-ui/styles'
import { Edit } from '@material-ui/icons'
import { routes } from '../../routes'
import { findNote } from '../../utils/work_with_notes'
import { DisplayChildren } from './DisplayChildren'
import {DisplayLinks} from './DisplayLinks'

const mapStateToProps = (state) => ({
    currentMenu: state.currentMenu,
    notes: state.notes
})


const Right = styled('div')({
    display: 'flex',
    justifyContent: 'flex-end'
})


export class NoteDisplay extends Component {

    handleClick = () => {
        this.props.history.push(routes.create)
    }

    handleEdit = () =>{
        const { history, currentMenu } = this.props
        history.push(`${routes.edit}/${currentMenu}`)
    }

    render() {
        const notesExist = this.props.notes.length > 0
        const currentMenuExist = this.props.currentMenu.length > 0
        
        if (!notesExist) {
            return (
                <div className='display'>
                    <Right>
                        <Button onClick={this.handleClick}>Create Note</Button>
                    </Right>
                    <Typography variant='h5'>
                        You don't have any notes, but you can create new if you press 'create new note'
                    </Typography>
                </div>
            )
        }
        if (notesExist && !currentMenuExist) {
            return (
                <div className='display'>
                    <Typography variant='h5'>
                        Choose note that you want to see
                    </Typography>
                </div>
            )
        }

        const note = findNote(this.props.notes, this.props.currentMenu)
        return (
            <div className='display'>
                <div className="note">
                    <Box display="flex" alignItems='center' justifyContent="space-between">
                        <Typography variant='h5'>{note.title}</Typography>
                        <Button onClick={this.handleEdit}><Edit/></Button>
                    </Box>
                    <Typography variant='body1'>{note.desc}</Typography>
                    <DisplayChildren note_children={note.children}/>
                    <DisplayLinks links={note.links}/>
                </div>
            </div>
        )
    }
}

export default connect(mapStateToProps, null)(NoteDisplay)
