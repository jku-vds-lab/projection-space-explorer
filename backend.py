import bottle
from bottle import route, run, template, response, request
import json
import hdbscan
import csv
from sklearn.datasets import make_blobs
import matplotlib.pyplot as plt
import numpy as np
from json import dumps



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

print("TESTWISE")

@app.route('/hdbscan', method=['OPTIONS', 'POST'])
def lvambience():
    print(request.body)
    features = json.load(request.body)
    print(features[0])
    
    bestProbabilities = None
    bestLabels = None
    bestScore = 1000000
    bestI = 0
    
    clusterSize = 13
    while clusterSize < 20:
        minSamples = 5
        while minSamples < 15:
            clusterer = hdbscan.HDBSCAN(min_cluster_size=clusterSize, min_samples=minSamples, prediction_data=True)
            cluster_labels = clusterer.fit_predict(features)
            
            for f in clusterer.outlier_scores_:
                print(f)
            
            score = len(np.where(clusterer.outlier_scores_ > 0.2)[0])
            #score = np.sum(clusterer.outlier_scores_)
            #print(score)
            if score < bestScore:
                bestScore = score
                bestProbabilities = clusterer.probabilities_
                bestLabels = clusterer.labels_
                bestI = clusterSize
                        
            minSamples = minSamples + 1

        clusterSize = clusterSize + 2
    
    print("best score is...")
    print(bestScore)
    print(bestI)

    
    return {
        'result': [ [ int(label), float(probability) ] for label, probability in zip(bestLabels, bestProbabilities) ]
    }

app.install(EnableCors())

app.run(port=8090)

run(host='localhost', port=8090)

