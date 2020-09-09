import React, { Component } from 'react'
import { styled } from '@material-ui/styles'
import {
    List, ListItem,
    ListItemSecondaryAction,
    Button, TextField, IconButton
} from '@material-ui/core'
import DeleteIcon from '@material-ui/icons/Delete'

export class Links extends Component {

    render() {
        return (
            <CreateLinks>
                <Button onClick={this.props.createLink}>Create New Link</Button>
                <List>
                    {this.props.links.map((item, i) => (
                        <ListItem key={i}>
                            <GroupInputs>
                                <TextField name='link'
                                    label='Link'
                                    value={item.link.value}
                                    error={item.link.touch && !item.link.valid.isValid}
                                    helperText={item.link.valid.msg.join(', ')}
                                    required
                                    fullWidth
                                    onChange={(e) => this.props.handleChange(e, i, 'link')} />
                                <TextField name='desc'
                                    label='Description'
                                    fullWidth
                                    value={item.desc.value}
                                    onChange={(e) => this.props.handleChange(e, i, 'link')}
                                    multiline />
                            </GroupInputs>
                            <ListItemSecondaryAction>
                                <IconButton edge="end" onClick={() => {
                                    this.props.deleteLink(item)
                                }} aria-label="delete">
                                    <DeleteIcon />
                                </IconButton>
                            </ListItemSecondaryAction>
                        </ListItem>
                    ))}
                </List>
            </CreateLinks>
        )
    }
}


const CreateLinks = styled('div')({
    marginTop: "20px"
})

const GroupInputs = styled('div')({
    width: '98%'
})
