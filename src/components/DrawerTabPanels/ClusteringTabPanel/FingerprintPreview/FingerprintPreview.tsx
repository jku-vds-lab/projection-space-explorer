import * as React from 'react'
import Cluster from "../../../Utility/Data/Cluster";
import './FingerprintPreview.scss'
import { GenericFingerprint } from '../../../Legends/Generic';
import { DatasetType } from "../../../Utility/Data/DatasetType";

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