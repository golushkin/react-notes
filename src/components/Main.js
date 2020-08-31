import React, { Component } from 'react'
import { Grid, Paper } from '@material-ui/core'
import { styled } from '@material-ui/styles'
import { Switch, Route, Redirect } from 'react-router-dom'
import { Sidebar } from './Sidebar'
import { NoteCreate } from './NoteCreate'
import NoteDisplay from './NoteDisplay/index'
import { NoteEdit } from './NoteEdit'
import { routes } from '../routes'

const StyledMain = styled(Paper)({
    width: '60%',
    margin: '1.5% auto',
})

export class Main extends Component {
    render() {
        return (
            <StyledMain>
                <Grid container spacing={1}>
                    <Grid item xs={2}><Sidebar /></Grid>
                    <Grid item xs={10}>
                        <Switch>
                            <Route path={routes.home} exact component={NoteDisplay} />
                            <Route path={routes.create} component={NoteCreate} />
                            <Route path={`${routes.edit}/:route`} component={NoteEdit} />
                            <Redirect to='/'/>
                        </Switch>
                    </Grid>
                </Grid>
            </StyledMain>

        )
    }
}
