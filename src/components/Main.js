import React, { Component } from 'react'
import { Grid, Paper, Container } from '@material-ui/core'
import { styled } from '@material-ui/styles'
import { Switch, Route, Redirect } from 'react-router-dom'
import NoteCreate from './NoteCreate/index'
import NoteDisplay from './NoteDisplay/index'
import NoteEdit from './NoteEdit/index'
import { routes } from '../routes'

const StyledMain = styled(Container)({
    margin: '1.5% auto',
})

export class Main extends Component {
    render() {
        return (
            <StyledMain maxWidth={'md'}>
                <Paper>
                    <Switch>
                        <Route path={routes.home} exact component={NoteDisplay} />
                        <Route path={routes.create} component={NoteCreate} />
                        <Route path={`${routes.edit}/:route`} component={NoteEdit} />
                        <Redirect to={routes.home} />
                    </Switch>
                </Paper>
            </StyledMain>
        )
    }
}
