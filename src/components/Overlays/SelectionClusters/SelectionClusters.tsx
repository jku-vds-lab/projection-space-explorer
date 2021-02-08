import * as React from 'react'
import { Card } from '@material-ui/core'
import { GenericLegend } from '../../Legends/Generic'
import './SelectionClusters.scss'
import { connect } from 'react-redux'
import { Vect } from '../../Utility/Data/Vect'
import ReactDOM = require('react-dom')
import { setHoverWindowMode, WindowMode } from '../../Ducks/HoverSettingsDuck'

function copyStyles(sourceDoc, targetDoc) {

    Array.from(sourceDoc.styleSheets).forEach(styleSheet => {
        // @ts-ignore
        if (styleSheet.href) {
            const newLinkEl = sourceDoc.createElement('link');

            newLinkEl.rel = 'stylesheet';
            // @ts-ignore
            newLinkEl.href = styleSheet.href;
            targetDoc.head.appendChild(newLinkEl);
            // @ts-ignore
        } else if (styleSheet.cssRules && styleSheet.cssRules.length > 0) {
            const newStyleEl = sourceDoc.createElement('style');
            // @ts-ignore
            Array.from(styleSheet.cssRules).forEach(cssRule => {
                // @ts-ignore
                newStyleEl.appendChild(sourceDoc.createTextNode(cssRule.cssText));
            });

            targetDoc.head.appendChild(newStyleEl);
        }
    });
}


function HoverItemPortal(props) {
    return ReactDOM.createPortal(props.children, document.getElementById("HoverItemDiv"))
}


class MyWindowPortal extends React.PureComponent<any> {
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

        // STEP 2: append props.children to the container <div> that isn't mounted anywhere yet
        return ReactDOM.createPortal(this.props.children, this.containerEl);
    }

    componentDidMount() {
        // STEP 3: open a new browser window and store a reference to it
        this.externalWindow = window.open('', '', 'width=300,height=600,left=0,top=0');

        copyStyles(document, this.externalWindow.document);

        this.externalWindow.addEventListener("beforeunload", () => {
            this.props.onClose()
        })

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
    hoverSettings,
    hoverUpdate,
    setHoverWindowMode
}) {
    if (!dataset) {
        return null
    }
    return <div className={"Parent"}>

        {hoverState && hoverState.data && hoverState.data instanceof Vect && <HoverItemPortal>
            <Card elevation={24} style={{
                width: 350,
                maxHeight: '50vh',
                minHeight: 350, //360 interferes with lineup
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
            }}>
                <GenericLegend aggregate={false} type={dataset.type} vectors={[hoverState.data]} columns={dataset.columns} hoverUpdate={hoverUpdate}></GenericLegend>
            </Card>
        </HoverItemPortal>}


        {
            hoverSettings.windowMode == WindowMode.Extern ?
                <MyWindowPortal onClose={() => {
                    setHoverWindowMode(WindowMode.Embedded)
                }}>
                    <GenericLegend aggregate={true} type={dataset.type} vectors={currentAggregation} columns={dataset.columns} hoverUpdate={hoverUpdate}></GenericLegend>
                </MyWindowPortal>
                :
                <div className={"Cluster"}>
                    {currentAggregation && currentAggregation.length > 0 && <div>

                        <GenericLegend aggregate={true} type={dataset.type} vectors={currentAggregation} columns={dataset.columns} hoverUpdate={hoverUpdate}></GenericLegend>
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
    hoverSettings: state.hoverSettings,
})
const mapDispatchToProps = dispatch => ({
    setHoverWindowMode: value => dispatch(setHoverWindowMode(value)),
})

const connector = connect(mapStateToProps, mapDispatchToProps);

export const SelectionClusters = connector(SelectionClustersFull)

