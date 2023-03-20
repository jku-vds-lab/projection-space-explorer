export declare class EmbeddingController {
    worker: Worker;
    supportsPause(): boolean;
    stepper: (Y: any) => void;
    notifier: () => void;
    error: (error: ErrorEvent) => void;
    step(): void;
    terminate(): void;
}
//# sourceMappingURL=EmbeddingController.d.ts.map