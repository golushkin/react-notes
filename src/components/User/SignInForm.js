import React, { Component } from 'react'
import {
    Box,
    TextField,
    Button,
    CircularProgress
} from '@material-ui/core'
import { validate, isFormValid } from '../../utils/validate'
import { ServerReq } from '../../webservice/ServerReq'
import { save_user_to_storage } from '../../utils/storage'

export class SignInForm extends Component {

    constructor(props) {
        super(props)

        this.state = {
            formValid: false,
            show_spinner: false,
            formControls: {
                user: {
                    value: "",
                    touch: false,
                    valid: {
                        isValid: false,
                        msg: []
                    },
                    validationRules: {
                        isRequired: true
                    }
                },
                pass: {
                    value: "",
                    touch: false,
                    valid: {
                        isValid: false,
                        msg: []
                    },
                    validationRules: {
                        isRequired: true
                    }
                },
            }
        }
    }

    handleChange = (e) => {
        const { name, value } = e.target
        const formControls = {
            ...this.state.formControls
        }
        const element = {
            ...formControls[name]
        }
        
        element.touch = true
        element.value = value
        element.valid = validate(value, element.validationRules)
        formControls[name] = element
        let formValid = isFormValid(formControls)
        
        this.setState({
            formValid,
            formControls
        })
    }
    
    logIn = () => {
        const server = new ServerReq()
        const formControls = this.state.formControls
        const show_err = this.props.show_err
        const user = {
            username: formControls.user.value,
            pass: formControls.pass.value
        }

        this.setState({show_spinner: true})

        server
            .log_in(user)
            .then(res => {
                save_user_to_storage(res.data)
                this.props.log_in_user(res.data)
            })
            .catch(err => {
                show_err(err)
                this.setState({show_spinner: false})
            })
    }

    handleClose = () => {
        this.setState({ show_snack: false, error: '' })
    }

    render() {
        const { formValid, formControls, show_spinner } = this.state
        const { user, pass } = formControls
        return (
            <form className='sign-in-form'>
                {renderTextField(user, 'user', 'Username', this.handleChange)}
                {renderTextField(pass, 'pass', 'Password', this.handleChange, 'password')}
                <Box marginTop='10px'>
                    <Button onClick={this.logIn} disabled={!formValid}>
                        {
                            show_spinner
                            ?<CircularProgress size={20}/>
                            :'Sign In'
                        }
                    </Button>
                </Box>
            </form>
        )
    }
}

function renderTextField(obj, name, label, handler, type = 'text') {
    return <TextField error={!obj.valid.isValid && obj.touch}
        helperText={obj.valid.msg.join(', ')}
        required
        value={obj.value}
        fullWidth
        name={name}
        type={type}
        label={label}
        onChange={handler} />
}
