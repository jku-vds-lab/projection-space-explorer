export class EmbeddingController {
  worker: Worker;

  supportsPause() {
    return true;
  }

  stepper: (Y) => void;

  notifier: () => void;

  error: (error: ErrorEvent) => void;

  step() {}

  terminate() {
    this.worker.terminate();
  }
}
