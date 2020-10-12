import React, { Component } from 'react'
import { connect } from 'react-redux'
import {
    Button, Typography,
    Box, Grid, Hidden,
    CircularProgress,
} from '@material-ui/core'
import { Edit } from '@material-ui/icons'
import { Sidebar } from './Sidebar'
import { routes } from '../../routes'
import { findNote } from '../../utils/work_with_notes'
import { DisplayChildren } from './DisplayChildren'
import { DisplayLinks } from './DisplayLinks'
import { change_current_note, save_notes } from '../../store/actions/data'
import { log_out_user } from '../../store/actions/user'
import { show_err } from '../../store/actions/error'
import { ServerReq } from '../../webservice/ServerReq'


const mapStateToProps = (state) => ({
    currentMenu: state.note.currentMenu,
    notes: state.note.notes,
    token: state.user.token,
})

const mapDispatchToProps = {
    change_current_note,
    save_notes,
    log_out_user,
    show_err
}

export class NoteDisplay extends Component {

    constructor(props) {
        super(props)

        this.state = {
            spinner: true,
            show_snack: false,
            error: ''
        }
    }

    handleEdit = () => {
        const { history, currentMenu } = this.props
        history.push(`${routes.edit}/${currentMenu}`)
    }

    componentDidMount() {
        const server = new ServerReq()
        const { token, save_notes, log_out_user } = this.props

        server
            .get_notes(token)
            .then(res => {
                save_notes(res.data)
                this.setState({ spinner: false })
            })
            .catch(err => {
                const data = err.response.data
                show_err(err)
                if (data.error.name === 'TokenExpiredError') {
                    setTimeout(() => log_out_user(), 4000)
                }
            })
    }

    handleClose = () => {
        this.setState({ show_snack: false, error: '' })
    }

    render() {
        const { spinner } = this.state

        if (spinner) {
            return <Box display='flex' justifyContent='center'>
                <CircularProgress />
            </Box>
        }
        const { currentMenu, notes, change_current_note } = this.props

        const props_obj = {
            notes,
            currentMenu,
            change_current_note,
        }
        const notesExist = props_obj.notes.length > 0
        const currentMenuExist = props_obj.currentMenu.length > 0

        if (!notesExist) {
            return withSidbar((
                <div className='display'>
                    <Typography variant='subtitle1'>
                        You don't have any notes, but you can create
                        new if you press 'create note'
                    </Typography>
                </div>
            ), props_obj)
        }
        if (notesExist && !currentMenuExist) {
            return withSidbar((<div className='display'>
                <Typography variant='subtitle1'>
                    Choose note that you want to see
                </Typography>
            </div>), props_obj)

        }

        const note = findNote(props_obj.notes, props_obj.currentMenu)
        return withSidbar((<div className='display'>
            <div data-testid='note' className="note">
                <Box display="flex" alignItems='center' justifyContent="space-between">
                    <Typography variant='h5'>{note.title}</Typography>
                    <Button id='edit-btn' onClick={this.handleEdit}><Edit /></Button>
                </Box>
                <Typography variant='body1'>{note.desc}</Typography>
                <DisplayChildren currentMenu={props_obj.currentMenu} change_current_note={props_obj.change_current_note} note_children={note.children} />
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
