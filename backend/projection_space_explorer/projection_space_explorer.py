from flask import Blueprint, request
import numpy as np
import hdbscan


pse_api = Blueprint('projection-space-explorer', __name__)


@pse_api.route('/segmentation', methods=['OPTIONS', 'POST'])
def segmentation():
    if request.method == 'POST':
        min_cluster_size_arg = request.form.get("min_cluster_size")
        min_cluster_samples_arg = request.form.get("min_cluster_samples")
        allow_single_cluster_arg = request.form.get("allow_single_cluster")
        X = np.array(request.form.get("X").split(","), dtype=np.float64)[
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