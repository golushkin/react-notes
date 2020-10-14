import React, { Component } from 'react'
import {
    Box, Slide,
    Button, Typography,
} from '@material-ui/core'
import { connect } from 'react-redux'
import { SignUpForm } from './SignUpForm'
import { SignInForm } from './SignInForm'
import { sign_up_user, log_in_user } from '../../store/actions/user'
import { show_err } from '../../store/actions/error'
import { routes } from '../../routes'

const mapStateToProps = state => ({
    user: state.user
})

const mapDispatchToProps = {
    show_err,
    sign_up_user,
    log_in_user
}

export class UserSign extends Component {
    constructor(props) {
        super(props)

        this.state = {
            sign_up: true,
            sign_in: false,
        }
    }

    renderButton() {
        const { sign_up } = this.state
        if (sign_up) {
            return (
                <Typography>Already have an account?
                    <Button onClick={() => this.setState({ sign_up: false })}>
                        Sign In
                        </Button>
                </Typography>
            )
        }
        else {
            return (
                <Typography>Don't have an account?
                    <Button onClick={() => this.setState({ sign_in: false })}>
                        Sign Up
                        </Button>
                </Typography>
            )
        }
    }


    render() {
        let { sign_up, sign_in } = this.state
        const { sign_up_user, log_in_user, show_err, user, history } = this.props

        if (user.token) {
            history.replace(routes.home) 
        }
  
        return (
            <Box className="user-sign" overflow='hidden'>
                <Box width={'50%'} margin='0 auto'>
                    <Slide direction="left" in={sign_up} mountOnEnter unmountOnExit onExited={() => this.setState({ sign_in: true })}>
                        <SignUpForm sign_up_user={sign_up_user} show_err={show_err}/>
                    </Slide>
                    <Slide direction="right" in={sign_in} mountOnEnter unmountOnExit onExited={() => this.setState({ sign_up: true })}>
                        <SignInForm log_in_user={log_in_user} show_err={show_err}/>
                    </Slide>
                    <Box>
                        {this.renderButton()}
                    </Box>
                </Box>
            </Box>
        )
    }
}


export default connect(mapStateToProps, mapDispatchToProps)(UserSign)