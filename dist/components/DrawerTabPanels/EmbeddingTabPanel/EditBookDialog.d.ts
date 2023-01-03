import { EntityId } from '@reduxjs/toolkit';
import type { IBook } from '../../../model';
export declare function EditBookDialog({ book, onClose, onSave, onDelete, }: {
    book: IBook;
    onClose: () => void;
    onSave: (id: EntityId, changes: any) => void;
    onDelete: (id: EntityId) => void;
}): JSX.Element;
//# sourceMappingURL=EditBookDialog.d.ts.map