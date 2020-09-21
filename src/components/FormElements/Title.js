import React from 'react'
import { styled } from '@material-ui/styles'
import { TextField } from '@material-ui/core'

const StyledTextField = styled(TextField)({
    marginTop: '10px'
})


export class Title extends React.Component {

    render() {
        const { valid, touch, value } = this.props.title
        return <StyledTextField
            value={value}
            label='Title'
            inputProps={{'data-testid':'edit-title'}}
            error={touch && !valid.isValid}
            helperText={valid.msg.join(', ')}
            fullWidth
            required
            name='title'
            onChange={this.props.callback} />
    }
}