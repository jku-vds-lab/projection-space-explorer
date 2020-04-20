# first line: 260
def _hdbscan_boruvka_kdtree(X, min_samples=5, alpha=1.0,
                            metric='minkowski', p=2, leaf_size=40,
                            approx_min_span_tree=True,
                            gen_min_span_tree=False,
                            core_dist_n_jobs=4, **kwargs):
    if leaf_size < 3:
        leaf_size = 3

    if core_dist_n_jobs < 1:
        core_dist_n_jobs = max(cpu_count() + 1 + core_dist_n_jobs, 1)

    if X.dtype != np.float64:
        X = X.astype(np.float64)

    tree = KDTree(X, metric=metric, leaf_size=leaf_size, **kwargs)
    alg = KDTreeBoruvkaAlgorithm(tree, min_samples, metric=metric,
                                 leaf_size=leaf_size // 3,
                                 approx_min_span_tree=approx_min_span_tree,
                                 n_jobs=core_dist_n_jobs, **kwargs)
    min_spanning_tree = alg.spanning_tree()
    # Sort edges of the min_spanning_tree by weight
    row_order = np.argsort(min_spanning_tree.T[2])
    min_spanning_tree = min_spanning_tree[row_order, :]
    # Convert edge list into standard hierarchical clustering format
    single_linkage_tree = label(min_spanning_tree)

    if gen_min_span_tree:
        return single_linkage_tree, min_spanning_tree
    else:
        return single_linkage_tree, None
