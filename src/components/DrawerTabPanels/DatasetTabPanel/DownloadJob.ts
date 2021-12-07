import { DatasetType } from "../../../model/DatasetType"

/**
 * Helper for fetching a resource asynchronous.
 */
export class DownloadJob {

    // The entry to fetch with this job
    entry: { path: string, type: DatasetType }

    // If this job terminated from outside?
    terminated: boolean

    constructor(entry: { path: string, type: DatasetType }) {
        this.entry = entry
        this.terminated = false
    }

    sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    async download(response: Response, callback: (string) => void, onProgress: (number) => void) {
        const reader = response.body.getReader()
        let chunks = []
        let receivedLength = 0

        while (true) {
            const { done, value } = await reader.read()

            if (done || this.terminated) {
                break
            }

            chunks.push(value)
            
            // Update progress
            receivedLength += value.length
            onProgress(receivedLength)

            // This sleep is necessary to have a fluid animated UI, else it would stutter since everything is on the same thread
            await this.sleep(0)
        }

        if (this.terminated) {
            return;
        }

        // Combine all small chunks to one big chunk
        let chunksAll = new Uint8Array(receivedLength)
        let position = 0
        for (let chunk of chunks) {
            chunksAll.set(chunk, position)
            position += chunk.length
        }

        // Encode result as string
        let result = new TextDecoder("utf-8").decode(chunksAll)

        // call finish
        callback(result)
    }

    start(callback: (string) => void, onProgress: (number) => void) {
        fetch(this.entry.path).then(response => {
            this.download(response, callback, onProgress)
        }).catch((reason) => {
        })
    }

    /**
     * Terminates this job
     */
    terminate() {
        this.terminated = true
    }
}