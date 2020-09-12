import React, { Component } from 'react'
import {
    Box, Slide,
    Button, Typography,
} from '@material-ui/core'
import { SignUpForm } from './SignUpForm'
import { SignInForm } from './SignInForm'
import { routes } from '../../routes'

export default class UserCreate extends Component {
    constructor(props) {
        super(props)

        this.state = {
            sign_up: this.props.match.path === routes.sign_up,
            sign_in: this.props.match.path === routes.sign_in,
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
  
        return (
            <Box overflow='hidden'>
                <Box width={'50%'} margin='0 auto'>
                    <Slide direction="left" in={sign_up} mountOnEnter unmountOnExit onExited={() => this.setState({ sign_in: true })}>
                        <SignUpForm />
                    </Slide>
                    <Slide direction="right" in={sign_in} mountOnEnter unmountOnExit onExited={() => this.setState({ sign_up: true })}>
                        <SignInForm />
                    </Slide>
                    <Box>
                        {this.renderButton()}
                    </Box>
                </Box>
            </Box>
        )
    }
}
