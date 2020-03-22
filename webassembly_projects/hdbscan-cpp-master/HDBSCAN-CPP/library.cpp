#include<emscripten.h>
#include"./Hdbscan/hdbscan.hpp"

extern "C" EMSCRIPTEN_KEEPALIVE int cluster(float *buffer, int bufferSize, int *labels, int labelsSize, float *probabilities, int probabilitiesSize) {
    vector<vector<double>> dataset;
    for (int i = 0; i < bufferSize; i += 2) {
        vector<double> row;
        row.push_back(buffer[i]);
        row.push_back(buffer[i + 1]);
        dataset.push_back(row);
    }
    
    Hdbscan hdbscan("");
    hdbscan.setDataset(dataset);
    hdbscan.execute(5, 19, "Euclidean");
    hdbscan.displayResult();

    return 1234;
}

/**
 * 
emcc main.bc -o test.wasm -s EXPORTED_FUNCTIONS="['_cluster']" -s "EXTRA_EXPORTED_RUNTIME_METHODS=['cwrap']" -s INITIAL_MEMORY=1073741824 -s WASM=1 -s NO_EXIT_RUNTIME=1 -O1

 * */
