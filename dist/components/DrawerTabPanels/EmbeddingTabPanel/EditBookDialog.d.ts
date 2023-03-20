import { EntityId } from '@reduxjs/toolkit';
import { IBook } from '../../../model';
export declare function EditBookDialog({ storyBookLabel, book, onClose, onSave, onDelete, }: {
    storyBookLabel: string;
    book: IBook;
    onClose: () => void;
    onSave: (id: EntityId, changes: any) => void;
    onDelete: (id: EntityId) => void;
}): JSX.Element;
//# sourceMappingURL=EditBookDialog.d.ts.map