import React, { Component } from 'react'
import { Paper, Container, Box } from '@material-ui/core'
import { styled } from '@material-ui/styles'
import { Switch, Route, Redirect } from 'react-router-dom'
import NoteCreate from './NoteCreate'
import NoteDisplay from './NoteDisplay/index'
import NoteEdit from './NoteEdit'
import { routes } from '../routes'
import Header from './Header'
import UserSign from './User/UserSign'

const StyledPaper = styled(Paper)({
    margin: '2.5% auto',
})

export class Main extends Component {
    render() {
        return (
            <Box>
                <Header />
                <Container maxWidth={'md'}>
                    <StyledPaper>
                        <Switch>
                            <Route path={routes.home} exact component={NoteDisplay} />
                            <Route path={routes.create} component={NoteCreate} />
                            <Route path={routes.sign_up} component={UserSign} />
                            <Route path={`${routes.edit}/:route`} component={NoteEdit} />
                            <Redirect to={routes.home} />
                        </Switch>
                    </StyledPaper>
                </Container>
            </Box>
        )
    }
}
