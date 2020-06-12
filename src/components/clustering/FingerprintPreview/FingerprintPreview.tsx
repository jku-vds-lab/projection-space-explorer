import * as React from 'react'
import Cluster from "../../library/Cluster";
import { RubikFingerprint } from '../../legends/RubikFingerprint/RubikFingerprint';
import './FingerprintPreview.scss'

type ClusterOverviewProps = {
    type: String
    pointClusters?: Array<Cluster>
}

export var FingerprintPreview = function ({ pointClusters, type }: ClusterOverviewProps) {
    return <div className="FingerprintPreviewTriplet">
        {
            pointClusters?.slice(0, 3).map(cluster => {
                return <div><RubikFingerprint
                    type={type}
                    vectors={cluster.vectors}
                    aggregate={true}
                ></RubikFingerprint></div>
            })
        }
    </div>
}