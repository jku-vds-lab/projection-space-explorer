import { DistanceMetric } from "../../model/DistanceMetric";
import { FeatureType } from "../../model/FeatureType";

export function get_distance_fn(distanceMetric, e){
    switch(distanceMetric){
        case DistanceMetric.EUCLIDEAN:
            return euclidean;
        case DistanceMetric.JACCARD:
            return jaccard;
        case DistanceMetric.MANHATTAN:
            return manhattan;
        case DistanceMetric.COSINE:
            return cosine;
        case DistanceMetric.GOWER:
            return gower(e.data.featureTypes);
        default:
            return euclidean;
    }
}

// for mixed datatypes
// gower's distance is usually normalized by the range of values of this feature;  we never see all values at once --> normalize between 0 and 1 before delivers same result
export function gower(featureTypes: []){
    return function(x: number[], y: number[]){

        let result = 0;
        for (let i = 0; i < x.length; i++) {
            switch(featureTypes[i]){
                case FeatureType.Quantitative:
                    result += Math.abs(x[i] - y[i]);
                    break;
                case FeatureType.Binary:
                    result += x[i] === y[i] ? 0 : 1; // this is equivalent to the formular for quantititive features when having binary data
                    break;
                case FeatureType.Categorical:
                    result += x[i] === y[i] ? 0 : 1; // see binary
                    break;
                case FeatureType.Ordinal:
                    // TODO: handle ordinal data
                    break;
                default:
                    break;

            }

        }
        return result;
    }
}


// https://github.com/ecto/jaccard TODO: also for tsne and other projection methods
export function jaccard(x: number[], y: number[]){
    var jaccard_dist = require('jaccard');
    return jaccard_dist.distance(x, y);
  }

export function euclidean(x: number[], y: number[]) {
    let result = 0;
    for (let i = 0; i < x.length; i++) {
        result += (x[i] - y[i]) ** 2;
    }
    return Math.sqrt(result);
}

export function manhattan(x: number[], y: number[]) {
    let result = 0;
    for (let i = 0; i < x.length; i++) {
        result += Math.abs(x[i] - y[i]);
    }
    return result;
}

export function cosine(x: number[], y: number[]) {
    let result = 0.0;
    let normX = 0.0;
    let normY = 0.0;

    for (let i = 0; i < x.length; i++) {
        result += x[i] * y[i];
        normX += x[i] ** 2;
        normY += y[i] ** 2;
    }

    if (normX === 0 && normY === 0) {
        return 0;
    } else if (normX === 0 || normY === 0) {
        return 1.0;
    } else {
        return 1.0 - result / Math.sqrt(normX * normY);
    }
} 