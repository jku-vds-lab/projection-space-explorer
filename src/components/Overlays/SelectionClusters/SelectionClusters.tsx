import * as React from 'react'
import { Card } from '@material-ui/core'
import { GenericLegend } from '../../Legends/Generic'
import './SelectionClusters.scss'
import { connect } from 'react-redux'
import { Vect } from '../../Utility/Data/Vect'
import ReactDOM = require('react-dom')
import { setHoverWindowMode, WindowMode } from '../../Ducks/HoverSettingsDuck'

import { MyWindowPortal } from '../WindowPortal/WindowPortal'


function HoverItemPortal(props) {
    return ReactDOM.createPortal(props.children, document.getElementById("HoverItemDiv"))
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
                    <div className={"portalSummary"} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%', height: '100%' }}>
                        <GenericLegend aggregate={true} type={dataset.type} vectors={currentAggregation} columns={dataset.columns} hoverUpdate={hoverUpdate}></GenericLegend>
                    </div>
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

