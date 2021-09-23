import * as React from 'react'
import { Box, Card, Typography } from '@material-ui/core'
import { GenericLegend } from '../../legends/Generic'
import './SelectionClusters.scss'
import { connect, ConnectedProps } from 'react-redux'
import { IVect } from '../../Utility/Data/Vect'
import ReactDOM = require('react-dom')
import { setHoverWindowMode, WindowMode } from '../../Ducks/HoverSettingsDuck'

import { MyWindowPortal } from '../WindowPortal/WindowPortal'
import { isVector } from '../../Utility/Data/Cluster'
import { RootState } from '../../Store/Store'


function HoverItemPortal(props) {
    return ReactDOM.createPortal(props.children, document.getElementById("HoverItemDiv"))
}


const mapStateToProps = (state: RootState) => ({
    currentAggregation: state.currentAggregation,
    hoverState: state.hoverState,
    dataset: state.dataset,
    hoverSettings: state.hoverSettings,
})

const mapDispatchToProps = dispatch => ({
    setHoverWindowMode: value => dispatch(setHoverWindowMode(value)),
})

const connector = connect(mapStateToProps, mapDispatchToProps);

type PropsFromRedux = ConnectedProps<typeof connector>

type Props = PropsFromRedux & {
    hoverUpdate: any
}


const SelectionClustersFull = function ({
    dataset,
    currentAggregation,
    hoverState,
    hoverSettings,
    hoverUpdate,
    setHoverWindowMode
}: Props) {
    if (!dataset) {
        return null
    }

    const genericAggregateLegend = currentAggregation.aggregation && currentAggregation.aggregation.length > 0 ? 
                <GenericLegend aggregate={true} type={dataset.type} vectors={currentAggregation.aggregation.map(i => dataset.vectors[i])} hoverUpdate={hoverUpdate}></GenericLegend> : 
                <Box paddingLeft={2}>
                    <Typography color={"textSecondary"}>
                        Select Points in the Embedding Space to show a Summary Visualization.
                    </Typography>
                </Box>

    return <div className={"Parent"}>

        {hoverState && hoverState.data && isVector(hoverState.data) && <HoverItemPortal>
            <Card elevation={24} style={{
                width: 300,
                maxHeight: '50vh',
                minHeight: 300, //360 interferes with lineup
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
            }}>
                <GenericLegend aggregate={false} type={dataset.type} vectors={[hoverState.data]} hoverUpdate={hoverUpdate}></GenericLegend>
            </Card>
        </HoverItemPortal>}


        {
            hoverSettings.windowMode == WindowMode.Extern ?
                <MyWindowPortal onClose={() => {
                    setHoverWindowMode(WindowMode.Embedded)
                }}>
                    <div className={"portalSummary"} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%', height: '100%' }}>
                        {genericAggregateLegend}
                    </div>
                </MyWindowPortal>
                :
                <div className={"Cluster"}>
                    {genericAggregateLegend}
                </div>
        }
    </div>
}



export const SelectionClusters = connector(SelectionClustersFull)

