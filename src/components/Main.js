import React, { Component } from 'react'
import { Paper, Container, Box } from '@material-ui/core'
import { styled } from '@material-ui/styles'
import { Switch, Route, Redirect } from 'react-router-dom'
import { connect } from 'react-redux'
import NoteCreate from './NoteCreate'
import NoteDisplay from './NoteDisplay/index'
import NoteEdit from './NoteEdit'
import { routes } from '../routes'
import Header from './Header'
import UserSign from './User/UserSign'
import { ErrorAlert } from './ErrorAlert'
import { hide_err } from '../store/actions/error'

const StyledPaper = styled(Paper)({
    margin: '2.5% auto',
})

const mapStateToProps = (state) =>({
    token: state.user.token,
    error: state.error
})

const mapDispatchToProps = {
    hide_err
}

class Main extends Component {
    render() {
        const { token, hide_err,error } = this.props

        if (!token) {
            return (
                <Box>
                    <Header />
                    <Container maxWidth={'md'}>
                        <StyledPaper>
                            <UserSign />
                        </StyledPaper>
                    </Container>
                    <ErrorAlert handleClose={hide_err} msg={error.msg} open={error.show_err}/>
                </Box>
            )
        }
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
                <ErrorAlert handleClose={hide_err} msg={error.msg} open={error.show_err}/>
            </Box>
        )
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Main)