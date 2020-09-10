import React, { Component } from 'react'
import {
    AppBar, IconButton,
    Toolbar, Button,
    Typography, Box,
    Drawer, Hidden
} from '@material-ui/core'
import { connect } from 'react-redux'
import { Menu } from '@material-ui/icons'
import { styled } from '@material-ui/styles'
import { change_current_note } from '../store/actions/data'
import { Sidebar } from './NoteDisplay/Sidebar'


const mapStateToProps = (state) => ({
    currentMenu: state.currentMenu,
    notes: state.notes
})

const mapDispatchToProps = {
    change_current_note
}

export class Header extends Component {

    constructor(props) {
        super(props)
        this.state = {
            drawer: false
        }
    }

    handleDrawer = () => {
        this.setState({
            drawer: !this.state.drawer
        })
    }

    render() {
        const { notes, currentMenu, change_current_note } = this.props
        return (
            <Box>
                <AppBar position="static">
                    <Toolbar>
                        <Hidden mdUp>
                            <IconButton edge="start" color="inherit" onClick={this.handleDrawer} aria-label="menu">
                                <Menu />
                            </IconButton>
                        </Hidden>
                        <Box display="flex" justifyContent="flex-end" flexGrow='1'>
                            <Button color="inherit">Sign In</Button>
                            <Button color="inherit">Sign Out</Button>
                            <Button color="inherit">Sign Up</Button>
                        </Box>
                    </Toolbar>
                </AppBar>
                <Hidden mdUp>
                    <Drawer open={this.state.drawer} onClose={this.handleDrawer}>
                        <Box padding={2}>
                            <Sidebar notes={notes} currentMenu={currentMenu} change_current_note={change_current_note} />
                        </Box>
                    </Drawer>
                </Hidden>
            </Box>
        )
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Header)