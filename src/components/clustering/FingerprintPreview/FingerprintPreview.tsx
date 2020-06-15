import * as React from 'react'
import Cluster from "../../library/Cluster";
import { RubikFingerprint } from '../../legends/RubikFingerprint/RubikFingerprint';
import './FingerprintPreview.scss'
import { GenericFingerprint } from '../../legends/Generic';

type ClusterOverviewProps = {
    type: String
    pointClusters?: Array<Cluster>
}

export var FingerprintPreview = function ({ pointClusters, type }: ClusterOverviewProps) {
    return <div className="FingerprintPreviewTriplet">
        {
            pointClusters?.slice(0, 3).map(cluster => {
                return <div><GenericFingerprint
                    type={type}
                    vectors={cluster.vectors}
                    scale={1}
                ></GenericFingerprint></div>
            })
        }
    </div>
}