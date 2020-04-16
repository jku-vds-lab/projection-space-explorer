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
import numpy as np
from sklearn.cluster import KMeans
from sklearn import metrics
import time

t0 = time.time()

X = [ [0, 0], [1, 1], [1.5, 1.5], [1.2, 1.5], [0.5, 0.5], [7, 7], [10, 10], [9, 9], [8, 8], [8.5, 8.5] ]


kmeans_model = KMeans(n_clusters=2, random_state=1).fit(X)
labels = kmeans_model.labels_
print(labels)
res = metrics.silhouette_samples(X, labels, metric='euclidean')
print(res)

t1 = time.time()

print(t1-t0)