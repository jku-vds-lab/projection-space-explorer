import { RubikLegend } from "./rubik";
import { NeuralLegend } from "./neural";
import { ChessLegend } from "./chess";
import { StoryLegend } from "./story";
import { GoLegend } from "./go";

import Typography from '@material-ui/core/Typography';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableRow from '@material-ui/core/TableRow';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';


export var GenericLegend = ({ type, vectors, aggregate }) => {
    if (type == 'story') {
        return <StoryLegend selection={vectors}></StoryLegend>
    } else if (type == 'rubik') {
        return <RubikLegend selection={vectors}></RubikLegend>
    } else if (type == 'neural') {
        return <NeuralLegend selection={vectors} aggregate={aggregate}></NeuralLegend>
    } else if (type == 'chess') {
        return <ChessLegend selection={vectors}></ChessLegend>
    } else if (type == 'go') {
        return <GoLegend selection={vectors} aggregate={aggregate}></GoLegend>
    } else {
        return <div></div>
    }
}


















export function GenericClusterLegend({ cluster, type }) {
    console.log(cluster)
    console.log(type)
    return <div>
        <Typography variant='subtitle2'>Cluster Information</Typography>
        <TableContainer>
            <Table aria-label="simple table">
                <TableBody>
                    <TableRow>
                        <TableCell>Probability</TableCell>
                        <TableCell align="right">{cluster.getProbability().toFixed(2)}</TableCell>
                    </TableRow>
                    <TableRow>
                        <TableCell>STD</TableCell>
                        <TableCell align="right">{cluster.getSTD().toFixed(2)}</TableCell>
                    </TableRow>
                    <TableRow>
                        <TableCell>Score</TableCell>
                        <TableCell align="right">{cluster.meanScore().toFixed(2)}</TableCell>
                    </TableRow>
                    <TableRow>
                        <TableCell>Count</TableCell>
                        <TableCell align="right">{cluster.vectors.length.toFixed(2)}</TableCell>
                    </TableRow>
                </TableBody>
            </Table>

            <GenericLegend
            aggregate={true}
            vectors={cluster.vectors}
            type={type}
            ></GenericLegend>
        </TableContainer>
        <div className="speech-bubble-ds-arrow"></div>
    </div>
}