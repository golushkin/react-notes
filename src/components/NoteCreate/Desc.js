import React from 'react'
import { makeStyles } from '@material-ui/styles'
import { TextField } from '@material-ui/core'

const useStyles = makeStyles({
    root: {
        marginTop: '10px'
    }
})

export function Desc(props){
    const classes = useStyles()
    return <TextField className={classes.root}
                        id="standard-multiline-flexible"
                        label='Description' 
                        name='desc'
                        fullWidth
                        multiline
                        value={props.value}
                        rowsMax={4}
                        onChange={props.callback}/>
}
