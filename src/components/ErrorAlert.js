import React from 'react'
import { Alert } from '@material-ui/lab'
import { Snackbar } from '@material-ui/core'

export function ErrorAlert(props) {
    const { open, msg, handleClose } = props
    const snackProps = {
        open,
        autoHideDuration: 4000,
        anchorOrigin: {
            vertical: 'top',
            horizontal: 'right'
        },
        onClose: handleClose
    }
    const alertProps = {
        onClose: handleClose,
        severity: props.saverity || "error"
    }

    return (
        <Snackbar {...snackProps}>
            <Alert {...alertProps}>
                {msg}
            </Alert>
        </Snackbar>
    )
}

