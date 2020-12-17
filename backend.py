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
import math
from sklearn.cluster import DBSCAN
from numpy.linalg import norm
DECIMAL_MAX_DIFF_FOR_EQUALITY = 0.0000001















_delta = 0.000000001

def set_max_delta_for_equality(delta):
    _delta = delta

class Vec2(object):
    def __init__(self, x, y):
        self.x = float(x)
        self.y = float(y)
        if x != 0.0:
            self.angle = math.degrees(math.atan(float(y) / x))
        elif y == 0.0:
            self.angle = 0
        elif y > 0.0:
            self.angle = 90
        elif y < 0.0:
            self.angle = -90
            
        if self.x < 0:
            self.angle += 180
        
    def dot_product_with(self, other_vector):
        return self.x * other_vector.x + self.y * other_vector.y
    
    def as_dict(self):
        return {'x': self.x, 'y': self.y}
    
    def multipled_by_matrix(self, x1, y1, x2, y2):
        new_x = self.x * x1 + self.y * x2
        new_y = self.x * y1 + self.y * y2
        return Vec2(new_x, new_y)
    
    def rotated(self, angle_in_degrees):
        cos_angle = math.cos(math.radians(angle_in_degrees))
        sin_angle = math.sin(math.radians(angle_in_degrees))
        return self.multipled_by_matrix(x1=cos_angle, y1=sin_angle, x2=-sin_angle, y2=cos_angle)
    
    def almost_equals(self, other):
        return abs(self.x - other.x) <= DECIMAL_MAX_DIFF_FOR_EQUALITY and \
            abs(self.y - other.y) <= DECIMAL_MAX_DIFF_FOR_EQUALITY
            
    def __eq__(self, other):
        return other != None and abs(self.x - other.x) < _delta and abs(self.y - other.y) < _delta
    
    def __ne__(self, other):
        return not self.__eq__(other)
    
    def __str__(self):
        return "x: " + str(self.x) + ". y: " + str(self.y)
    
def distance(diff_x, diff_y):
    return math.sqrt(diff_x * diff_x + diff_y * diff_y)

class Point(Vec2):
    def __init__(self, x, y):
        Vec2.__init__(self, x, y)
        
    def distance_to(self, other_point):
        diff_x = other_point.x - self.x
        diff_y = other_point.y - self.y
        return math.sqrt(math.pow(diff_x, 2) + math.pow(diff_y, 2))
    
    def distance_to_projection_on(self, line_segment):
        diff_x = self.x - line_segment.start.x
        diff_y = self.y - line_segment.start.y
        
        return abs(diff_x * line_segment.unit_vector.y - diff_y * line_segment.unit_vector.x)
        #return self.distance_from_point_to_projection_on_line_seg(self, line_segment)
    
    def rotated(self, angle_in_degrees):
        result = Vec2.rotated(self, angle_in_degrees)
        return Point(result.x, result.y)
        
class LineSegment(object):
    @staticmethod
    def from_tuples(start, end):
        return LineSegment(Point(start[0], start[1]), Point(end[0], end[1]))
    
    def __init__(self, start, end):
        self.start = start
        self.end = end
        self.length = start.distance_to(end)

        if self.length > 0.0:
            unit_x = (end.x - start.x) / self.length
            unit_y = (end.y - start.y) / self.length
            self.unit_vector = Point(unit_x, unit_y)
            
    def as_dict(self):
        return {'start': self.start.as_dict(), 'end': self.end.as_dict()}
        
    def sine_of_angle_with(self, other_line_segment):
        return self.unit_vector.x * other_line_segment.unit_vector.y - \
        self.unit_vector.y * other_line_segment.unit_vector.x
        
    def dist_from_start_to_projection_of(self, point):
        diff_x = self.start.x - point.x
        diff_y = self.start.y - point.y
        return abs(diff_x * self.unit_vector.x + diff_y * self.unit_vector.y)
    
    def dist_from_end_to_projection_of(self, point):
        diff_x = self.end.x - point.x
        diff_y = self.end.y - point.y
        return abs(diff_x * self.unit_vector.x + diff_y * self.unit_vector.y)
        
    def almost_equals(self, other):
        return (self.start.almost_equals(other.start) and self.end.almost_equals(other.end)) #or \
            #(self.end.almost_equals(other.start) and self.start.almost_equals(other.end))
            
    def __eq__(self, other):
        return other != None and (self.start == other.start and self.end == other.end) #or \
            #(self.end == other.start and self.start == other.end)
            
    def __ne__(self, other):
        return not self.__eq__(other)
    
    def __str__(self):
        return "start: " + str(self.start) + ". end: " + str(self.end)









def determine_longer_and_shorter_lines(line_a, line_b):
    if line_a.length < line_b.length:
        return (line_b, line_a)
    else:
        return (line_a, line_b)
    
    
def get_total_distance_function(perp_dist_func, angle_dist_func, parrallel_dist_func):
    def __dist_func(line_a, line_b, perp_func=perp_dist_func, angle_func=angle_dist_func, \
                    parr_func=parrallel_dist_func):
        return perp_func(line_a, line_b) + angle_func(line_a, line_b) + \
            parr_func(line_a, line_b)
    return __dist_func

def perpendicular_distance(line_a, line_b):
    longer_line, shorter_line = determine_longer_and_shorter_lines(line_a, line_b)
    dist_a = shorter_line.start.distance_to_projection_on(longer_line)
    dist_b = shorter_line.end.distance_to_projection_on(longer_line)
    
    if dist_a == 0.0 and dist_b == 0.0:
        return 0.0
    
    return (dist_a * dist_a + dist_b * dist_b) / (dist_a + dist_b)
    
def __perpendicular_distance(line_a, line_b):
    longer_line, shorter_line = determine_longer_and_shorter_lines(line_a, line_b)
    dist_a = longer_line.line.project(shorter_line.start).distance_to(shorter_line.start)
    dist_b = longer_line.line.project(shorter_line.end).distance_to(shorter_line.end)
    
    if dist_a == 0.0 and dist_b == 0.0:
        return 0.0
    else:
        return (math.pow(dist_a, 2) + math.pow(dist_b, 2)) / (dist_a + dist_b)

def angular_distance(line_a, line_b):
    longer_line, shorter_line = determine_longer_and_shorter_lines(line_a, line_b)
    sine_coefficient = shorter_line.sine_of_angle_with(longer_line)
    return abs(sine_coefficient * shorter_line.length)

#def __parrallel_distance(line_a, line_b):

def parrallel_distance(line_a, line_b):
    longer_line, shorter_line = determine_longer_and_shorter_lines(line_a, line_b)
    def __func(shorter_line_pt, longer_line_pt):
        return shorter_line_pt.distance_from_point_to_projection_on_line_seg(longer_line_pt, \
                                                                             longer_line)
    return min([longer_line.dist_from_start_to_projection_of(shorter_line.start), \
               longer_line.dist_from_start_to_projection_of(shorter_line.end), \
               longer_line.dist_from_end_to_projection_of(shorter_line.start), \
               longer_line.dist_from_end_to_projection_of(shorter_line.end)])
    
def dist_to_projection_point(line, proj):
    return min(proj.distance_to(line.start), proj.distance_to(line.end))










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












def measurePerpendicularDistance(a, b):
    p1 = np.array([ a[0], a[1] ])
    p2 = np.array([ a[2], a[3] ])
    p3 = np.array([ b[0], b[1] ])
    d = norm(np.cross(p2-p1, p1-p3)) / norm(p2-p1)
    return d





def angle_of_vectors(a, b):
    x1, y1 = a[2] - a[0], a[3] - a[1]
    x2, y2 = b[2] - b[0], b[3] - b[1]
    dot = x1 * x2 + y1 * y2
    det = x1 * y2 - y1 * x2
    return abs(math.atan2(det, dot))


def dist(a, b):
    s = math.sqrt((b[0] - a[0]) ** 2 + (b[1] - a[1]) ** 2)
    e = math.sqrt((b[2] - a[2]) ** 2 + (b[3] - a[3]) ** 2)
    return s / 2 + e / 2


def segmentDistance(a, b):

    sega = LineSegment.from_tuples([ a[0], a[1] ], [ a[2], a[3] ])
    segb = LineSegment.from_tuples([ b[0], b[1] ], [ b[2], b[3] ])

    segDist = 0
    if (a[4] != b[4]):
        segDist = 3
    #return #math.hypot(b[2] - a[2], b[3] - a[3]) + math.hypot(b[0] - a[0], b[1] - a[1]) +
    #return dist(a, b) + measurePerpendicularDistance(a, b) + angle_of_vectors(a, b) + segDist
    return dist(a, b)







@app.route('/segmentation', method=['OPTIONS', 'POST'])
def segmentation():
    #
    X = [
        [
            0, 0,     10, 10
        ],
        [
            1, 0,     10, 10
        ],
        [
            1.5, 0,     10, 10
        ],
        [
            0, 1,     10, 10
        ],
        [
            0, 0,     10, 10
        ],
        [
            0, 0.5,     10, 10
        ],
        [
            0.5, 0.5,     10, 10
        ],
        [
            0, 0,     10, 10
        ],
        [
            0, 0,     10, 10
        ],
        [
            0, 0,     10, 10
        ],
        [
            10,10, 20, 20
        ],
                [
            10,10, 20, 20
        ],
                [
            10,10, 20, 20
        ],
                [
            10,10, 20, 20
        ],
                [
            10,10, 20, 20
        ],
                [
            10,10, 20, 20
        ],
                [
            10,10, 20, 20
        ],
                [
            10,10, 20, 20
        ]
    ]
    X = np.array(json.load(request.body))
    print(X)
    clusterer = hdbscan.HDBSCAN(
        min_cluster_size=10,
        min_samples=5,
        prediction_data=True,
        metric=segmentDistance)
    
    #clusterer=DBSCAN(eps=1,min_samples=4,metric=segmentDistance)

    clusterer.fit_predict(X)

    print(clusterer.labels_)
    print(clusterer.probabilities_)

    return {
        'result': [ [ int(label), float(probability) ] for label, probability in zip(clusterer.labels_, clusterer.probabilities_) ]
    }





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

