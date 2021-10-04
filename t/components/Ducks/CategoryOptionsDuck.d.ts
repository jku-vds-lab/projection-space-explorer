import { CategoryOptions } from "../WebGLView/CategoryOptions";
declare const categoryOptions: (state: CategoryOptions, action: any) => CategoryOptions;
export default categoryOptions;
export declare const setCategoryOptions: (categoryOptions: CategoryOptions) => {
    type: string;
    categoryOptions: CategoryOptions;
};
