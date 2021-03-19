import React = require("react");
import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, TextField } from "@material-ui/core";


export function SDFModifierDialog({openSDFDialog, handleClose}) {
    const [modifiers, setModifiers] = React.useState("");
    function handleModifierChange(event) {
        setModifiers(event.target.value);
    }

    return <Dialog maxWidth='lg' open={openSDFDialog} onClose={() => handleClose(null)}>
        <DialogTitle>Specify Modifiers</DialogTitle>
        <DialogContent>
            <DialogContentText>
                Manually specify modifiers separated by semicolons e.g. "pred;fp;latent". <br/>
                You can also leave this field empty, if the modifiers are included by default. <br/>
                The following modifiers are included by default: "pred", "predicted", "measured", "fingerprint", "rep".
            </DialogContentText>
            <TextField
                autoFocus
                margin="dense"
                id="modifiers"
                label="Modifiers"
                value={modifiers}
                onChange={handleModifierChange}
                fullWidth={true} />
        </DialogContent>
        <DialogActions>
            <Button onClick={() => handleClose(null) }>
                Cancel
            </Button>
            <Button onClick={() => handleClose(modifiers) }>
                Start
            </Button>
        </DialogActions>
    </Dialog>
}