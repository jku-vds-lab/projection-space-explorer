import * as React from 'react'
import { Card, CardContent, Typography } from '@material-ui/core'
import { GenericLegend } from '../../legends/Generic'
import './SelectionClusters.scss'
import { connect } from 'react-redux'

const mapStateToProps = state => ({
    currentAggregation: state.currentAggregation
})

export var SelectionClusters = connect(mapStateToProps)(function ({
    selectionState,
    selectionAggregation,
    vectors,
    datasetType,
    currentAggregation
}) {

    return <div className="Parent">
        <div className="Cluster">

            <Card style={{ pointerEvents: 'auto' }}>
                <CardContent style={{ padding: '8px' }}>
                    <Typography align="center" gutterBottom variant="body1">Hover State</Typography>
                    <GenericLegend aggregate={false} type={datasetType} vectors={selectionState}></GenericLegend>

                </CardContent>
            </Card>

        </div>
        <div className="Cluster">
            <Card style={{ pointerEvents: 'auto' }}>
                <CardContent style={{ padding: '8px' }}>
                    <Typography align="center" gutterBottom variant="body1">{`Fingerprint (${currentAggregation.length})`}</Typography>

                    <GenericLegend aggregate={true} type={datasetType} vectors={currentAggregation}></GenericLegend>
                </CardContent>
            </Card>
        </div>
    </div>
})