import React = require("react");
import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, TextField } from "@material-ui/core";
import { setLineUpInput_dump, setLineUpInput_visibility } from "../Ducks/LineUpInputDuck";
import { connect, ConnectedProps } from "react-redux";

const mapDispatchToProps = dispatch => ({
    setLineUp_dump: dump => dispatch(setLineUpInput_dump(dump)),
    setLineUp_visibility: vis => dispatch(setLineUpInput_visibility(vis)),
})

const connector = connect(null, mapDispatchToProps);

type PropsFromRedux = ConnectedProps<typeof connector>

type Props = PropsFromRedux & {
    openDialog, setOpenDumpDialog
}

// const LineUpContext = connector(function ({ lineUpInput, currentAggregation, setCurrentAggregation, setLineUpInput_visibility, onFilter, activeStory, hoverUpdate, hoverState }: Props)
export const LineUpDumpDialog =  connector(function ({openDialog, setOpenDumpDialog, setLineUp_dump, setLineUp_visibility}:Props) {
    const [dump, setDump] = React.useState("");
    function handleChange(event) {
        setDump(event.target.value);
    }

    function handleClose(){
        setOpenDumpDialog(() => false);
        setLineUp_visibility(true);
        setLineUp_dump(dump);
    }


    return <Dialog maxWidth='lg' open={openDialog} onClose={handleClose}>
        <DialogTitle>Specify Modifiers</DialogTitle>
        <DialogContent>
            <DialogContentText>
                Insert Linup JSON dump
            </DialogContentText>
            <TextField
                autoFocus
                margin="dense"
                id="modifiers"
                label="Modifiers"
                value={dump}
                onChange={handleChange}
                fullWidth />
        </DialogContent>
        <DialogActions>
            <Button onClick={handleClose}>
                Cancel
            </Button>
            <Button onClick={handleClose}>
                Start
            </Button>
        </DialogActions>
    </Dialog>
});