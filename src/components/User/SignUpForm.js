import React, { Component } from 'react'
import {
    Box, TextField,
    Button, Typography,
    CircularProgress
} from '@material-ui/core'
import { validate, validatePasswords, isFormValid } from '../../utils/validate'
import { ServerReq } from '../../webservice/ServerReq'
import { save_user_to_storage } from '../../utils/storage'


export class SignUpForm extends Component {
    constructor(props) {
        super(props)

        this.state = {
            formValid: false,
            show_spinner: false,
            formControls: {
                user: {
                    value: '',
                    touch: false,
                    valid: {
                        isValid: false,
                        msg: []
                    },
                    validationRules: {
                        isRequired: true,
                        maxLen: 50
                    }
                },
                pass1: {
                    value: '',
                    touch: false,
                    valid: {
                        isValid: false,
                        msg: []
                    },
                    validationRules: {
                        isRequired: true,
                    }
                },
                pass2: {
                    value: '',
                    touch: false,
                    valid: {
                        isValid: false,
                        msg: []
                    },
                    validationRules: {
                        isRequired: true,
                    }
                }
            }
        }
    }


    handleChange = (e) => {
        const { name, value } = e.target
        const formControls = {
            ...this.state.formControls
        }
        const elem = {
            ...formControls[name]
        }

        elem.value = value
        elem.touch = true
        elem.valid = validate(value, elem.validationRules)

        if (name === 'pass1') {
            let error_msg = 'This password don\'t equal to first password'
            if (formControls.pass2.value === value) {
                formControls.pass2.valid = validate(formControls.pass2.value, formControls.pass2.validationRules)
            }
            else {
                formControls.pass2.valid.isValid = false
                if (!formControls.pass2.valid.msg.includes(error_msg) && formControls.pass2.touch) {
                    formControls.pass2.valid.msg.push(error_msg)
                }
            }
        }
        if (name === 'pass2') {
            elem.valid = validatePasswords(formControls.pass1.value, value, elem.valid)
        }

        formControls[name] = elem
        let formValid = isFormValid(formControls)

        this.setState({
            formValid,
            formControls
        })
    }

    signUp = () => {
        const server = new ServerReq()
        const formControls = this.state.formControls
        const show_err = this.props.show_err
        const user = {
            username: formControls.user.value,
            pass: formControls.pass1.value
        }

        this.setState({show_spinner: true})

        server
            .sign_up(user)
            .then(res => {
                save_user_to_storage(res.data)
                this.props.sign_up_user(res.data)
            })
            .catch(err => {
                show_err(err);
                this.setState({show_spinner: false})
            })
    }

    render() {
        const { formValid, formControls, show_spinner } = this.state
        const { user, pass1, pass2 } = formControls
        return (
            <form>
                {renderTextField(user, 'user', 'Username', this.handleChange)}
                {renderTextField(pass1, 'pass1', 'Password', this.handleChange, 'password')}
                {renderTextField(pass2, 'pass2', 'Repeat password', this.handleChange, 'password')}
                <Box marginTop='10px'>
                    <Button disabled={!formValid} onClick={this.signUp}>
                        {
                            show_spinner
                                ? <CircularProgress size={20} />
                                : 'Sign Up'
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