export {};
/**self.importScripts('test.js')


self.addEventListener('message', function (e) {

    var sab = e.data
    const vectorArray = new Float32Array(sab)

    var nVec = vectorArray.length / 2


    // Allocate some space in the heap for the data (making sure to use the appropriate memory size of the elements)
    var buffer = Module._malloc(vectorArray.length * vectorArray.BYTES_PER_ELEMENT)

    // Output buffer for labels
    var outLabel = Module._malloc(nVec * 4)

    // Output buffer for probabilities
    var outProbs = Module._malloc(nVec * 4)

    // Assign the data to the heap - Keep in mind bytes per element
    Module.HEAPF32.set(vectorArray, buffer >> 2)

    // Finally, call the function with "number" parameter type for the array (the pointer), and an extra length parameter
    var js_wrapped_fib = Module.cwrap("cluster", "number", ["number", "number", "number", "number", "number", "number"]);
    console.log("STARTING")
    js_wrapped_fib(buffer, vectorArray.length, outLabel, nVec, outProbs, nVec)

    var labels = Module.HEAP32.subarray(outLabel / 4, outLabel / 4 + nVec)
    var probabilities = Module.HEAPF32.subarray(outProbs / 4, outProbs / 4 + nVec)

    self.postMessage({
        labels: labels,
        probabilities: probabilities
    })
})**/
