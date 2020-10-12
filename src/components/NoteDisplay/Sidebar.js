import React, { Component } from 'react'
import { Button, Link } from '@material-ui/core'
import { Link as RouterLink } from 'react-router-dom'
import { TreeItem, TreeView } from '@material-ui/lab'
import { ExpandMore, ChevronRight } from '@material-ui/icons'
import { routes } from '../../routes'
import TreeEl from './TreeEl'

function get_expand_arr(route) {
    if (route.length === 0) {
        return []
    }
    if (route.length === 1) {
        return [route]
    }

    let split_arr = route.split('-')
    let str_route = split_arr[0]
    const expand_route = [str_route]

    for (let index = 1; index < split_arr.length; index++) {
        str_route = `${str_route}-${split_arr[index]}`
        expand_route.push(str_route)
    }

    return expand_route
}

export class Sidebar extends Component {

    renderTree(notes, route = '', deep = 0) {
        return notes.map((item, i) => {
            let route_l = "";
            if (deep === 0) {
                route_l = `${i}`;
            } else {
                route_l = `${route}-${i}`;
            }
            return (
                <TreeEl key={`${item._id}-${i}`} item={item} route_l={route_l}>
                    <TreeItem nodeId={route_l} label={item.title}>
                        {item.hasOwnProperty("children") && item.children.length > 0 ? this.renderTree(item.children, route_l, deep + 1) : null}
                    </TreeItem>
                </TreeEl>

            )
        })
    }

    render() {
        return (
            <div className="sidebar">
                <TreeView
                    //expanded={get_expand_arr(this.props.currentMenu)}
                    defaultCollapseIcon={<ExpandMore />}
                    defaultExpandIcon={<ChevronRight />}
                    onNodeSelect={(e, value) => this.props.change_current_note(value)}
                    data-testid='tree'
                >
                    {this.renderTree(this.props.notes)}
                </TreeView>
                <Button>
                    <Link color='textPrimary' component={RouterLink} to={routes.create}>
                        + Create Note
                    </Link>
                </Button>
            </div>
        );

    }
}

