import { DatasetType } from '../../../model/DatasetType';
/**
 * Helper for fetching a resource asynchronous.
 */
export declare class DownloadJob {
    entry: {
        path: string;
        type: DatasetType;
    };
    terminated: boolean;
    constructor(entry: {
        path: string;
        type: DatasetType;
    });
    sleep(ms: any): Promise<unknown>;
    download(response: Response, callback: (string: any) => void, onProgress: (number: any) => void): Promise<string>;
    start(callback: (string: any) => void, onProgress: (number: any) => void): void;
    /**
     * Terminates this job
     */
    terminate(): void;
}
//# sourceMappingURL=DownloadJob.d.ts.map