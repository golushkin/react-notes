import React, { Component } from 'react'
import { connect } from 'react-redux'
import {
    Button, Typography,
    Box, Grid, Hidden
} from '@material-ui/core'
import { styled } from '@material-ui/styles'
import { Edit } from '@material-ui/icons'
import { Sidebar } from './Sidebar'
import { routes } from '../../routes'
import { findNote } from '../../utils/work_with_notes'
import { DisplayChildren } from './DisplayChildren'
import { DisplayLinks } from './DisplayLinks'
import { change_current_note } from '../../store/actions/data'

const mapStateToProps = (state) => ({
    currentMenu: state.currentMenu,
    notes: state.notes
})

const mapDispatchToProps = {
    change_current_note
}

const Right = styled('div')({
    display: 'flex',
    justifyContent: 'flex-end'
})


export class NoteDisplay extends Component {

    handleClick = () => {
        this.props.history.push(routes.create)
    }

    handleEdit = () => {
        const { history, currentMenu } = this.props
        history.push(`${routes.edit}/${currentMenu}`)
    }

    render() {
        const props_obj = {
            notes: this.props.notes,
            currentMenu: this.props.currentMenu,
            change_current_note: this.props.change_current_note
        }
        const notesExist = props_obj.notes.length > 0
        const currentMenuExist = props_obj.currentMenu.length > 0

        if (!notesExist) {
            return withSidbar((
                <div className='display'>
                    <Right>
                        <Button onClick={this.handleClick}>Create Note</Button>
                    </Right>
                    <Typography variant='h5'>
                        You don't have any notes, but you can create new if you press 'create new note'
                    </Typography>
                </div>
            ), props_obj)
        }
        if (notesExist && !currentMenuExist) {
            return withSidbar((<div className='display'>
                <Typography variant='h5'>
                    Choose note that you want to see
            </Typography>
            </div>), props_obj)

        }

        const note = findNote(props_obj.notes, props_obj.currentMenu)
        return withSidbar((<div className='display'>
            <div className="note">
                <Box display="flex" alignItems='center' justifyContent="space-between">
                    <Typography variant='h5'>{note.title}</Typography>
                    <Button onClick={this.handleEdit}><Edit /></Button>
                </Box>
                <Typography variant='body1'>{note.desc}</Typography>
                <DisplayChildren note_children={note.children} />
                <DisplayLinks links={note.links} />
            </div>
        </div>), props_obj)
    }
}

function withSidbar(component, props) {
    return (
        <Grid container spacing={1}>
            <Hidden smDown>
                <Grid item xs={2}>
                    <Sidebar {...props} />
                </Grid>
            </Hidden>
            <Grid item xs={true}>
                <Box padding={1}>
                    {component}
                </Box>
            </Grid>
        </Grid>
    )
}

export default connect(mapStateToProps, mapDispatchToProps)(NoteDisplay)
