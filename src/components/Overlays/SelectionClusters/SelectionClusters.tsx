import * as React from 'react'
import { Button, Card, CardContent, Typography } from '@material-ui/core'
import { GenericLegend } from '../../Legends/Generic'
import './SelectionClusters.scss'
import { connect } from 'react-redux'
import AdjustIcon from '@material-ui/icons/Adjust';
import { Vect } from '../../Utility/Data/Vect'
import { DatasetType } from '../../Utility/Data/DatasetType'
import ReactDOM = require('react-dom')
import { WindowMode } from '../../Ducks/HoverSettingsDuck'

function copyStyles(sourceDoc, targetDoc) {
    Array.from(sourceDoc.styleSheets).forEach(styleSheet => {
        if (styleSheet.href) {
            const newLinkEl = sourceDoc.createElement('link');

            newLinkEl.rel = 'stylesheet';
            newLinkEl.href = styleSheet.href;
            targetDoc.head.appendChild(newLinkEl);
        } else if (styleSheet.cssRules && styleSheet.cssRules.length > 0) {
            const newStyleEl = sourceDoc.createElement('style');

            Array.from(styleSheet.cssRules).forEach(cssRule => {
                newStyleEl.appendChild(sourceDoc.createTextNode(cssRule.cssText));
            });

            targetDoc.head.appendChild(newStyleEl);
        }
    });
}


function HoverItemPortal(props) {
    return ReactDOM.createPortal(props.children, document.getElementById("HoverItemDiv"))
}


class MyWindowPortal extends React.PureComponent {
    externalWindow: any
    containerEl: any

    constructor(props) {
        super(props);
        // STEP 1: create a container <div>
        this.containerEl = document.createElement('div');
        this.externalWindow = null;
    }



    render() {
        if (this.externalWindow?.document) {
            copyStyles(document, this.externalWindow.document);
        }

        console.log("rendering selection")

        // STEP 2: append props.children to the container <div> that isn't mounted anywhere yet
        return ReactDOM.createPortal(this.props.children, this.containerEl);
    }

    componentDidMount() {
        // STEP 3: open a new browser window and store a reference to it
        this.externalWindow = window.open('', '', 'width=600,height=400,left=200,top=200');

        // STEP 4: append the container <div> (that has props.children appended to it) to the body of the new window
        this.externalWindow.document.body.appendChild(this.containerEl);

        this.externalWindow.document.title = 'Selection Summary';

    }

    componentWillUnmount() {
        // STEP 5: This will fire when this.state.showWindowPortal in the parent component becomes false
        // So we tidy up by closing the window
        this.externalWindow.close();
    }
}

const SelectionClustersFull = function ({
    dataset,
    currentAggregation,
    hoverState,
    hoverSettings
}) {
    if (!dataset) {
        return null
    }

    return <div className={dataset.type == DatasetType.Chem ? "Parent ChemParent" : "Parent"}>

        {hoverState && hoverState instanceof Vect && <HoverItemPortal>
            <GenericLegend aggregate={false} type={dataset.type} vectors={[hoverState]} columns={dataset.columns}></GenericLegend>
        </HoverItemPortal>}


        {
            hoverSettings.windowMode == WindowMode.Extern ?
                <MyWindowPortal>
                    <GenericLegend aggregate={true} type={dataset.type} vectors={currentAggregation} columns={dataset.columns}></GenericLegend>
                </MyWindowPortal>
                :
                <div className={dataset.type == DatasetType.Chem ? "Cluster ChemClusterMultiple" : "Cluster"}>
                    {currentAggregation && currentAggregation.length > 0 && <div>
                        
                        <GenericLegend aggregate={true} type={dataset.type} vectors={currentAggregation} columns={dataset.columns}></GenericLegend>
                    </div>
                    }
                </div>
        }



    </div>
}


const mapStateToProps = state => ({
    currentAggregation: state.currentAggregation,
    hoverState: state.hoverState,
    dataset: state.dataset,
    show: !state.lineUpInput.show, // TODO: probably we need an extra property that specifies, if the legends should be shown,
    hoverSettings: state.hoverSettings
})


export const SelectionClusters = connect(mapStateToProps)(SelectionClustersFull)