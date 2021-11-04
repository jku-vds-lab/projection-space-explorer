"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const React = require("react");
const material_1 = require("@mui/material");
const PlayArrow_1 = require("@mui/icons-material/PlayArrow");
const Stop_1 = require("@mui/icons-material/Stop");
const Close_1 = require("@mui/icons-material/Close");
const react_redux_1 = require("react-redux");
const styles_1 = require("@mui/styles");
/**
 * Styles for the projection card that allows to stop/resume projection steps.
 */
const useStylesMedia = styles_1.makeStyles(theme => ({
    root: {
        display: 'flex',
        margin: '8px 0',
        pointerEvents: 'auto'
    },
    details: {
        display: 'flex',
        flexDirection: 'column',
        width: '100%'
    },
    content: {
        flex: '1 0 auto',
    },
    cover: {
        width: 151,
    },
    controls: {
        display: 'flex',
        alignItems: 'center',
        flexDirection: 'column',
        //paddingLeft: theme.spacing(1),
        //paddingBottom: theme.spacing(1),
        width: '100%'
    },
    playIcon: {
        height: 38,
        width: 38,
    },
}));
const mapStateToProps = (state) => ({
    projectionParams: state.projectionParams,
    worker: state.projectionWorker
});
const mapDispatch = dispatch => ({});
const connector = react_redux_1.connect(mapStateToProps, mapDispatch);
/**
 * Projection card that allows to start/stop the projection and shows the current steps.
 */
exports.ProjectionControlCard = connector(({ onComputingChanged, projectionParams, controller, onClose }) => {
    if (controller == null)
        return null;
    const classes = useStylesMedia();
    const [step, setStep] = React.useState(0);
    const ref = React.useRef(step);
    if (step == 0) {
        console.time('time elapsed to project the file ' + localStorage.getItem("unique_filename"));
    }
    if (step / projectionParams.iterations >= 1) {
        console.timeEnd('time elapsed to project the file ' + localStorage.getItem("unique_filename"));
    }
    const [computing, setComputing] = React.useState(true);
    controller.notifier = () => {
        updateState(ref.current + 1);
    };
    React.useEffect(() => {
        if (step < projectionParams.iterations && computing) {
            controller.step();
        }
    }, [step, computing]);
    function updateState(newState) {
        ref.current = newState;
        setStep(newState);
    }
    const titles = {
        forceatlas2: 'ForceAtlas2',
        umap: 'UMAP',
        tsne: 't-SNE'
    };
    const genlabel = (step) => {
        if (step == 0) {
            return React.createElement("div", null, "Initializing Projection ...");
        }
        const percent = Math.min((step / projectionParams.iterations) * 100, 100).toFixed(1);
        return React.createElement("div", null,
            React.createElement("div", null, `${Math.min(step, projectionParams.iterations)}/${projectionParams.iterations}`),
            React.createElement("div", null, `${percent}%`));
    };
    return (React.createElement(material_1.Card, { className: classes.root },
        React.createElement("div", { className: classes.details },
            React.createElement(material_1.CardHeader, { avatar: React.createElement("div", null), action: React.createElement(material_1.IconButton, { "aria-label": "settings", onClick: (e) => {
                        onClose();
                    } },
                    React.createElement(Close_1.default, null)), title: titles[projectionParams.method], subheader: genlabel(step) }),
            React.createElement("div", { className: classes.controls },
                React.createElement(material_1.IconButton, { "aria-label": "play/pause", onClick: (e) => {
                        var newVal = !computing;
                        setComputing(newVal);
                        onComputingChanged(null, newVal);
                    } }, computing ? React.createElement(Stop_1.default, { className: classes.playIcon }) :
                    React.createElement(PlayArrow_1.default, { className: classes.playIcon }))))));
});
