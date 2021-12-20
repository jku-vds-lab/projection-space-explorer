"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Helper for fetching a resource asynchronous.
 */
class DownloadJob {
    constructor(entry) {
        this.entry = entry;
        this.terminated = false;
    }
    sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
    download(response, callback, onProgress) {
        return __awaiter(this, void 0, void 0, function* () {
            const reader = response.body.getReader();
            let chunks = [];
            let receivedLength = 0;
            while (true) {
                const { done, value } = yield reader.read();
                if (done || this.terminated) {
                    break;
                }
                chunks.push(value);
                // Update progress
                receivedLength += value.length;
                onProgress(receivedLength);
                // This sleep is necessary to have a fluid animated UI, else it would stutter since everything is on the same thread
                yield this.sleep(10);
            }
            if (this.terminated) {
                return;
            }
            // Combine all small chunks to one big chunk
            let chunksAll = new Uint8Array(receivedLength);
            let position = 0;
            for (let chunk of chunks) {
                chunksAll.set(chunk, position);
                position += chunk.length;
            }
            // Encode result as string
            let result = new TextDecoder("utf-8").decode(chunksAll);
            // call finish
            callback(result);
        });
    }
    start(callback, onProgress) {
        fetch(this.entry.path).then(response => {
            this.download(response, callback, onProgress);
        });
    }
    /**
     * Terminates this job
     */
    terminate() {
        this.terminated = true;
    }
}
exports.DownloadJob = DownloadJob;
