export class EmbeddingController {
  worker: Worker;

  stepper: (Y) => void;

  notifier: () => void;

  error: (error: ErrorEvent) => void;

  terminate() {
    this.worker.terminate();
  }
}
