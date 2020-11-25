import * as LineUpJs from 'lineupjs'
import { LineUp } from "lineupjsx"
import React = require("react")
import { connect, ConnectedProps } from "react-redux"
import { setAggregationAction } from '../Ducks/AggregationDuck'
import { RootState } from "../Store/Store"
import './LineUpContext.scss'


/**
 * Declares a function which maps application state to component properties (by name)
 * 
 * @param state The whole state of the application (contains a field for each duck!)
 */
const mapStateToProps = (state: RootState) => ({
    lineUpInput: state.lineUpInput
})




/**
 * Declares a function which maps dispatch events to component properties (by name)
 * 
 * @param dispatch The generic dispatch function declared in redux
 */
const mapDispatchToProps = dispatch => ({
    setCurrentAggregation: samples => dispatch(setAggregationAction(samples))
})


/**
 * Factory method which is declared here so we can get a static type in 'ConnectedProps'
 */
const connector = connect(mapStateToProps, mapDispatchToProps);


/**
 * Type that holds the props we declared above in mapStateToProps and mapDispatchToProps
 */
type PropsFromRedux = ConnectedProps<typeof connector>




/**
 * Type that holds every property that is relevant to our component, that is the props declared above + our OWN component props
 */
type Props = PropsFromRedux & {
    // My own property 1
    // My own property 2
}




/**
 * Our component definition, by declaring our props with 'Props' we have static types for each of our property
 */
export const LineUpContext = connector(function ({ lineUpInput, setCurrentAggregation }: Props) {
    // In case we have no input, dont render at all
    if (!lineUpInput) {
        return null;
    }

    let ref = React.useRef()

    React.useEffect(() => {
        ref.current.adapter.instance.data.getFirstRanking().on('orderChanged.custom', (previous, current, previousGroups, currentGroups, dirtyReason) => {
            if (dirtyReason.indexOf('filter') === -1) {
                return;
            }

            const onRankingChanged = (current) => {
                let agg = []

                current.forEach(index => {
                    agg.push(lineUpInput[index])
                })

                setCurrentAggregation(agg)
            }

            onRankingChanged(current)

        })
    }, [lineUpInput])


    return <div className="LineUpParent">
        <LineUp ref={ref} data={lineUpInput}></LineUp>
    </div>
})