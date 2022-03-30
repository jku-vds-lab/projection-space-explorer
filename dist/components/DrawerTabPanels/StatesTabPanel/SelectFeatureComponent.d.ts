interface SelectFeatureComponentProps {
    label: string;
    default_val: string;
    categoryOptions: string[];
    onChange: (value: string) => void;
    column_info: any;
}
export declare function SelectFeatureComponent({ label, default_val, categoryOptions, onChange, column_info }: SelectFeatureComponentProps): JSX.Element;
export {};
