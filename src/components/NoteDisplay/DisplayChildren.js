import React, { Component } from 'react'
import {
    Accordion,
    AccordionSummary,
    AccordionDetails,
    Typography, List,
    ListItem, ListItemText,
    Link
} from '@material-ui/core'
import { styled } from '@material-ui/styles'
import ExpandMoreIcon from '@material-ui/icons/ExpandMore'

export class DisplayChildren extends Component {
    renderListItems() {
        return this.props.note_children.map((item, i) => (
            <ListItem key={i}>
                <ListItemText primary={<StyleLink href='#'
                    underline='none'
                    onClick={() => console.log(i)} variant='body1'>
                    {i + 1}. {item.title}
                </StyleLink>} />
            </ListItem>
        ))
    }

    render() {
        return (
            <StyledAccordion defaultExpanded={true}>
                <StyledAccordionSummary
                    expandIcon={<ExpandMoreIcon />}
                    aria-controls="panel1a-content"
                    id="panel1a-header"
                >
                    <Typography variant='h6'>Notes</Typography>
                </StyledAccordionSummary>
                <StyledAccordionDetails>
                    <StyleList>
                        {this.renderListItems()}
                    </StyleList>
                </StyledAccordionDetails>
            </StyledAccordion>
        )
    }
}

const StyledAccordion = styled(Accordion)({
    boxShadow: 'none',
    marginTop: '10px'
})

const StyledAccordionSummary = styled(AccordionSummary)({
    padding: '0',
})

const StyledAccordionDetails = styled(AccordionDetails)({
    padding: '8px 0 16px',
})

const StyleList = styled(List)({
    width: '30%'
})

const StyleLink = styled(Link)({
    textTransform: 'capitalize'
})