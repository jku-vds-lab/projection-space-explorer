from flask import Blueprint, request
import numpy as np
import hdbscan
import json
from sklearn import metrics


pse_api = Blueprint('projection-space-explorer', __name__)


@pse_api.route('/segmentation', methods=['OPTIONS', 'POST'])
def segmentation():
    if request.method == 'POST':
        #clusterVal = request.forms.get("clusterVal")
        min_cluster_size_arg = request.forms.get("min_cluster_size")
        min_cluster_samples_arg = request.forms.get("min_cluster_samples")
        allow_single_cluster_arg = request.forms.get("allow_single_cluster")
        X = np.array(request.forms.get("X").split(","), dtype=np.float64)[
            :, np.newaxis].reshape((-1, 2))

        # many small clusters
        min_cluster_size = 5
        min_cluster_samples = 1
        allow_single_cluster = False

        if min_cluster_size_arg:
            min_cluster_size = int(min_cluster_size_arg)
        if min_cluster_samples_arg:
            min_cluster_samples = int(min_cluster_samples_arg)
        if allow_single_cluster_arg == "true":
            allow_single_cluster = bool(allow_single_cluster_arg)

        clusterer = hdbscan.HDBSCAN(
            min_cluster_size=min_cluster_size,
            min_samples=min_cluster_samples,
            # prediction_data=True, # needed for soft clustering, or if we want to add points to the clustering afterwards
            allow_single_cluster=allow_single_cluster  # maybe disable again
        )

        clusterer.fit_predict(X)

        # print(clusterer.labels_)
        #clusterer.probabilities_ = np.array(len(X))

        return {
            'result': [int(label) for label in clusterer.labels_]
        }

    else:
        return {}


# TODO: @moritz, remove hdbscan route and worker_cluster.tsx
# Endpoint that performs the clustering algorithm
@pse_api.route('/hdbscan', methods=['OPTIONS', 'POST'])
def lvambience():
    features = np.array(json.load(request.body))
    
    bestProbabilities = None
    bestLabels = None
    bestScore = 1000000
    bestI = 0
    clusterer = hdbscan.HDBSCAN(min_cluster_size=16, min_samples=5, prediction_data=True)
    clusterSize = 13
    score = 0
    while clusterSize < 20:
        minSamples = 5
        while minSamples < 15:
            clusterer.set_params(min_cluster_size=clusterSize, min_samples=minSamples)
            cluster_labels = clusterer.fit_predict(features)
            
            # Score function to minimize
            score = len(np.where(clusterer.outlier_scores_ > 0.2)[0])
            #score = metrics.davies_bouldin_score(features, cluster_labels)

            if score < bestScore:
                bestScore = score
                bestProbabilities = clusterer.probabilities_
                bestLabels = clusterer.labels_
                bestI = clusterSize
                        
            minSamples = minSamples + 1

        clusterSize = clusterSize + 2
    
    # metrics2
    indices = np.where(bestLabels != -1)
    realLabels = bestLabels[indices]
    realFeatures = features[indices]
    clusterScore = metrics.silhouette_samples(realFeatures, realLabels, metric='euclidean')
    
    finalScores = np.zeros(len(features))
    lookup = np.arange(len(realLabels))

    finalScores[indices] = clusterScore[lookup]

    return {
        'result': [ [ int(label), float(probability), float(score) ] for label, probability, score in zip(bestLabels, bestProbabilities, finalScores) ]
    }