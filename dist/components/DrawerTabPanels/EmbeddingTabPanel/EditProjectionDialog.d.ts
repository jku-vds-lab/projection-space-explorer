import { EntityId } from '@reduxjs/toolkit';
import type { IProjection } from '../../../model';
export declare function EditProjectionDialog({ projection, onClose, onSave, onDelete, }: {
    projection: IProjection;
    onClose: () => void;
    onSave: (id: EntityId, changes: any) => void;
    onDelete: (id: EntityId) => void;
}): JSX.Element;
//# sourceMappingURL=EditProjectionDialog.d.ts.map