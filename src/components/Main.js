import React, { Component } from 'react'
import { Grid } from '@material-ui/core'
import { styled } from '@material-ui/styles'
import { Content } from './Content'
import { Sidebar } from './Sidebar'

const StyledMain = styled('main')({
    width: '80%',
    margin: '0 auto'
})

export class Main extends Component {
    render() {
        return (
            <StyledMain>
                <Grid container spacing={1}>
                    <Grid item><Sidebar /></Grid>
                    <Grid item><Content /></Grid>
                </Grid>
            </StyledMain>

        )
    }
}
