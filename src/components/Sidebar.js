import React, { Component } from 'react'
import { TreeItem, TreeView } from '@material-ui/lab'
import { ExpandMore, ChevronRight } from '@material-ui/icons'

export class Sidebar extends Component {
    render() {
        return (
            <TreeView
                defaultCollapseIcon={<ExpandMore />}
                defaultExpandIcon={<ChevronRight />}
                onNodeSelect={(e, value) =>console.log(value)}
            >
                <TreeItem nodeId="0" label="Applications">
                    <TreeItem nodeId="0-1" label="Calendar" />
                    <TreeItem nodeId="0-2" label="Chrome" />
                    <TreeItem nodeId="0-3" label="Webstorm"/>
                </TreeItem>
                <TreeItem nodeId="5" label="Documents">
                    <TreeItem nodeId="10" label="OSS" />
                    <TreeItem nodeId="6" label="Material-UI">
                        <TreeItem nodeId="7" label="src">
                            <TreeItem nodeId="8" label="index.js" />
                            <TreeItem nodeId="9" label="tree-view.js" />
                        </TreeItem>
                    </TreeItem>
                </TreeItem>
            </TreeView>
        );

    }
}
