export class EmbeddingController {
    worker: Worker
    stepper: any

    notifier: any

    terminate() {
        this.worker.terminate()
    }
}