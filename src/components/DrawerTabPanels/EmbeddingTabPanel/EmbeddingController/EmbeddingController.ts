export class EmbeddingController {
    worker: Worker

    terminate() {
        this.worker.terminate()
    }
}