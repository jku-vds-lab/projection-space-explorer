export declare enum RootActionTypes {
    RESET = "root/RESET",
    HYDRATE = "root/HYDRATE"
}
export declare const RootActions: {
    reset: () => {
        type: RootActionTypes;
    };
    hydrate: (dump: any) => {
        type: RootActionTypes;
        dump: any;
    };
};
