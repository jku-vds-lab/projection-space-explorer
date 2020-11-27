import * as React from 'react'
import { Card, CardContent, Typography } from '@material-ui/core'
import { GenericLegend } from '../../Legends/Generic'
import './SelectionClusters.scss'
import { connect } from 'react-redux'
import AdjustIcon from '@material-ui/icons/Adjust';
import { Vect } from '../../Utility/Data/Vect'




const SelectionClustersFull = function ({
    dataset,
    currentAggregation,
    hoverState
}) {
    if (!dataset) {
        return null
    }

    return <div className="Parent">
        <div className="Cluster">


            {hoverState && hoverState instanceof Vect && <Card style={{ pointerEvents: 'auto' }}>
                <CardContent style={{ padding: '8px' }}>
                    <Typography align="center" gutterBottom variant="body1">Hover State</Typography>
                    <GenericLegend aggregate={false} type={dataset.type} vectors={[hoverState]}></GenericLegend>

                </CardContent>
            </Card>}

        </div>
        <div className="Cluster">
            {currentAggregation && currentAggregation.length > 0 && <Card style={{ position: 'relative', pointerEvents: 'auto' }}>
                {currentAggregation.length > 0 && <div style={{ position: 'absolute', right: '0px', top: '0px' }} draggable onDragStart={(event) => {
                    event.persist()
                }}><AdjustIcon></AdjustIcon></div>}

                <CardContent style={{ padding: '8px' }}>
                    <Typography align="center" gutterBottom variant="body1">{`Fingerprint (${currentAggregation.length})`}</Typography>

                    <GenericLegend aggregate={true} type={dataset.type} vectors={currentAggregation}></GenericLegend>
                </CardContent>
            </Card>}
        </div>
    </div>
}


const mapStateToProps = state => ({
    currentAggregation: state.currentAggregation,
    hoverState: state.hoverState,
    dataset: state.dataset
})


export const SelectionClusters = connect(mapStateToProps)(SelectionClustersFull)