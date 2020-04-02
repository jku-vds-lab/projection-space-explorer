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
    print(request.body)
    features = np.array(json.load(request.body))
    print(features[0])
    
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

            if score < bestScore:
                bestScore = score
                bestProbabilities = clusterer.probabilities_
                bestLabels = clusterer.labels_
                bestI = clusterSize
                        
            minSamples = minSamples + 1

        clusterSize = clusterSize + 2
    
    return {
        'result': [ [ int(label), float(probability) ] for label, probability in zip(bestLabels, bestProbabilities) ]
    }

app.install(EnableCors())

app.run(port=8090)

run(host='localhost', port=8090)

