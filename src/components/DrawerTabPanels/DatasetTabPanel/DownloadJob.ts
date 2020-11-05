import SelectInput from "@material-ui/core/Select/SelectInput"
import { threadId } from "worker_threads"

export class DownloadJob {
    entry
    terminated: boolean

    constructor(entry) {
        this.entry = entry
        this.terminated = false
    }

    sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    async download(response: Response, callback, onProgress) {
        const reader = response.body.getReader()
        let chunks = []
        let receivedLength = 0
        while (true) {
            const { done, value } = await reader.read()

            if (done || this.terminated) {
                break
            }

            chunks.push(value)
            receivedLength += value.length

            onProgress(receivedLength)

            await this.sleep(50)
        }

        if (this.terminated) {
            return;
        }

        let chunksAll = new Uint8Array(receivedLength)
        let position = 0
        for (let chunk of chunks) {
            chunksAll.set(chunk, position)
            position += chunk.length
        }

        let result = new TextDecoder("utf-8").decode(chunksAll)
        callback(result)
    }

    start(callback, onProgress) {
        fetch(this.entry.path).then(response => {
            this.download(response, callback, onProgress)
        })
    }

    terminate() {
        this.terminated = true
    }
}