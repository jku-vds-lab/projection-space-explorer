interface CellExpanderFormatterProps {
    isCellSelected: boolean;
    expanded: boolean;
    onCellExpand: () => void;
}
export declare function CellExpanderFormatter({ isCellSelected, expanded, onCellExpand }: CellExpanderFormatterProps): JSX.Element;
export {};
