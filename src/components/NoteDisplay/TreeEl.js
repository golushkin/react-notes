import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Box, CircularProgress } from '@material-ui/core'
import { create_request } from '../../webservice/ServerReq'
import { populate_note } from '../../store/actions/data'

export class LabelItem extends Component {

    constructor(props){
        super(props)
        this.state = {
            spinner: false
        }
    }

    handleClick = (e) => {
        const { item, route_l, token, populate_note } = this.props

        if (item.hasOwnProperty('children') && item.children.length > 0 && typeof item.children[0] === 'string') {
            const server = create_request()
            this.setState({spinner: true})

            server
                .get_notes_children(token, item._id)
                .then(res =>{
                    this.setState({spinner: false},()=>populate_note(res.data, route_l))
                })
                .catch(err => console.log(err))
        }
    }


    render() {
        const { spinner } = this.state
        const { children } = this.props
        if (spinner) {
            return (
                <Box textAlign='center'>
                    <CircularProgress size={25} />
                </Box>
            )
        }
        return (
            <Box onClick={this.handleClick}>
                {children}
            </Box>
        )
    }
}

export default connect(state=>({token: state.user.token}),{populate_note})(LabelItem)
