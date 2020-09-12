import React, { Component } from 'react'
import {
    Box, TextField,
    Button, Typography,
} from '@material-ui/core'
import { validate, isFormValid } from '../../utils/validate'

export class SignInForm extends Component {

    constructor(props){
        super(props)

        this.state = {
            formValid: false,
            formControls: {
                user: {
                    value: "",
                    touch: false,
                    valid: {
                        isValid: false,
                        msg: []
                    },
                    validationRules:{
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
                    validationRules:{
                        isRequired: true
                    }
                },
            }
        }
    }

    handleChange = (e) =>{
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
        let formValid = isFormValid(formControls)
        formControls[name] = element

        this.setState({
            formValid,
            formControls
        })
    }

    render() {
        const { formValid, formControls } = this.state
        const { user, pass } = formControls
        return (
            <form>
                {renderTextField(user, 'user', 'Username', this.handleChange)}
                {renderTextField(pass, 'pass', 'Password', this.handleChange, 'password')}
                <Box marginTop='10px'>
                    <Button disabled={!formValid}>Sign In</Button>
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
