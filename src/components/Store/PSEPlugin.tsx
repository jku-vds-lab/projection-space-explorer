import { IVector } from "../../model/Vector";



export abstract class PSEPlugin {
    type: string;

    hasFileLayout(header: string[]) {
        return false;
    }


    abstract createFingerprint(vectors: IVector[], scale: number, aggregate: boolean): JSX.Element;

    // Checks if the header has all the required columns
    hasLayout(header: string[], columns: string[]) {
        for (let key in columns) {
            let val = columns[key];

            if (!header.includes(val)) {
                return false;
            }
        }

        return true;
    };
}
