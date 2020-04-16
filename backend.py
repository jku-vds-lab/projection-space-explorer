import bottle
from bottle import route, run, template, response, request
import json
import hdbscan
import csv
from sklearn.datasets import make_blobs
import matplotlib.pyplot as plt
import numpy as np
from joblib import Memory
from json import dumps
from sklearn import metrics


# Filter that allows cors request, needed for javascript to work
class EnableCors(object):
    name = 'enable_cors'
    api = 2

    def apply(self, fn, context):
        def _enable_cors(*args, **kwargs):
            # set CORS headers
            response.headers['Access-Control-Allow-Origin'] = '*'
            response.headers['Access-Control-Allow-Methods'] = 'GET, POST, PUT, OPTIONS'
            response.headers['Access-Control-Allow-Headers'] = 'Origin, Accept, Content-Type, X-Requested-With, X-CSRF-Token'

            if bottle.request.method != 'OPTIONS':
                # actual request; reply with the actual response
                return fn(*args, **kwargs)

        return _enable_cors

app = bottle.app()



# Endpoint that performs the clustering algorithm
@app.route('/hdbscan', method=['OPTIONS', 'POST'])
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

app.install(EnableCors())

app.run(port=8090)

run(host='localhost', port=8090)

