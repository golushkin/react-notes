import React, { Component } from 'react'
import {
    Accordion,
    AccordionSummary,
    AccordionDetails,
    Typography, Card,
    CardMedia, CardHeader,
    CardContent, Link
} from '@material-ui/core'
import { styled } from '@material-ui/styles'
import ExpandMoreIcon from '@material-ui/icons/ExpandMore'

export class DisplayLinks extends Component {

    get_domain(link){
        return link.match(/\/\w+/)[0].slice(1)
    }

    renderLeft(item){
        const imgExsist = item.img.length > 0
        if (imgExsist) {
            return <LeftImg image={item.img} />
        }
        return <Left><Typography variant='h6'>{this.get_domain(item.link)}</Typography></Left>
    }

    renderCards() {
        return this.props.links.map((item, i) => (
            <StyledCard key={i}>
                {this.renderLeft(item)}
                <Right>
                    <StyledHeader title={(
                        <Link href={item.link} underline='none'>
                            {item.title}
                        </Link>
                    )} />
                    <StyledContent>
                        <Typography variant='body2'>
                            {item.desc}
                        </Typography>
                    </StyledContent>
                </Right>
            </StyledCard>
        ))
    }

    render() {
        return (
            <StyledAccordion defaultExpanded={true}>
                <StyledAccordionSummary
                    expandIcon={<ExpandMoreIcon />}
                    aria-controls="panel1a-content"
                    id="panel2a-header"
                >
                    <Typography variant='h6'>Links</Typography>
                </StyledAccordionSummary>
                <StyledAccordionDetails>
                    {this.renderCards()}
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

const StyledCard = styled(Card)({
    display: 'flex',
    width: '99%'
})

const Left = styled(CardContent)({
    flexBasis: '20%',
    padding: '5px',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center'
})

const LeftImg = styled(CardMedia)({
    height: '100%',
    flexBasis: '15%',
})

const Right = styled(CardContent)({
    flexGrow: '1',
    padding: '5px !important',
})

const StyledHeader = styled(CardHeader)({
    padding: 0
})

const StyledContent = styled(CardContent)({
    padding: '5px 0 0 0 !important'
})

