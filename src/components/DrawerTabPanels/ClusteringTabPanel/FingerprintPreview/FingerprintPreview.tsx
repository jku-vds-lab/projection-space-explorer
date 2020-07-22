import * as React from 'react'
import Cluster from "../../../util/Cluster";
import { RubikFingerprint } from '../../../legends/RubikFingerprint/RubikFingerprint';
import './FingerprintPreview.scss'
import { GenericFingerprint } from '../../../legends/Generic';
import { DatasetType } from '../../../util/datasetselector';

type ClusterOverviewProps = {
    type: DatasetType
    pointClusters?: Array<Cluster>
}

export var FingerprintPreview = function ({ pointClusters, type }: ClusterOverviewProps) {
    return <div className="FingerprintPreviewTriplet">
        {
            pointClusters?.slice(0, 3).map((cluster, index) => {
                return <div key={index}><GenericFingerprint
                    type={type}
                    vectors={cluster.vectors}
                    scale={0.75}
                ></GenericFingerprint></div>
            })
        }
    </div>
}