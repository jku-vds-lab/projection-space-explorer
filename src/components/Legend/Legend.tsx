import * as React from 'react'
import { makeStyles, Checkbox, FormControlLabel, Typography } from '@material-ui/core';

const useStyles = makeStyles({
    root: {
        '&:hover': {
            backgroundColor: 'transparent',
        },
        padding: '3px 9px'
    },
    icon: {
        borderRadius: 3,
        width: 16,
        height: 16,
        boxShadow: 'inset 0 0 0 1px rgba(16,22,26,.2), inset 0 -1px 0 rgba(16,22,26,.1)',
        backgroundColor: '#f5f8fa',
        backgroundImage: 'linear-gradient(180deg,hsla(0,0%,100%,.8),hsla(0,0%,100%,0))',
        '$root.Mui-focusVisible &': {
            outline: '2px auto rgba(19,124,189,.6)',
            outlineOffset: 2,
        },
        'input:hover ~ &': {
            backgroundColor: '#ebf1f5',
        },
        'input:disabled ~ &': {
            boxShadow: 'none',
            background: 'rgba(206,217,224,.5)',
        },
    },
    checkedIcon: {
        backgroundColor: '#137cbd',
        backgroundImage: 'linear-gradient(180deg,hsla(0,0%,100%,.1),hsla(0,0%,100%,0))',
        '&:before': {
            display: 'block',
            width: 16,
            height: 16,
            backgroundImage:
                "url(\"data:image/svg+xml;charset=utf-8,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16'%3E%3Cpath" +
                " fill-rule='evenodd' clip-rule='evenodd' d='M12 5c-.28 0-.53.11-.71.29L7 9.59l-2.29-2.3a1.003 " +
                "1.003 0 00-1.42 1.42l3 3c.18.18.43.29.71.29s.53-.11.71-.29l5-5A1.003 1.003 0 0012 5z' fill='%23fff'/%3E%3C/svg%3E\")",
            content: '""',
        },
        'input:hover ~ &': {
            backgroundColor: '#106ba3',
        },
    },
});



export var Checky = ({ checked, onChange, id, name, comp }) => {
    const classes = useStyles();


    return <FormControlLabel

        style={{ margin: '0px', padding: '0px', userSelect: 'none' }}

        control={<Checkbox
            className={classes.root}
            color="primary"
            style={{ padding: '3px 9px' }}
            disableRipple
            checked={checked} onChange={onChange} id={id}></Checkbox>}
        label={<Typography style={{ color: `rgb(${comp.r}, ${comp.g}, ${comp.b})` }}>{name}</Typography>}
    ></FormControlLabel>
}

export class Legend extends React.Component {
    constructor(props) {
        super(props)

        this.state = {}
        this.onCheckbox = this.onCheckbox.bind(this)
    }

    load(type, lineColorScheme, algorithms) {

        this.lineColorScheme = lineColorScheme
        this.type = type


        var lineChecks = algorithms.map(entry => {
            return {
                color: this.lineColorScheme.map(entry.algo),
                name: entry.algo,
                checked: true,
                algo: entry.algo
            }
        })

        this.setState({ lineChecks: lineChecks })
    }

    onCheckbox(event) {
        var newState = {
            lineChecks: this.state.lineChecks
        }
        var col = newState.lineChecks.filter(c => c.algo == event.target.id)[0]
        col.checked = event.target.checked

        this.setState(newState)

        this.props.onLineSelect(col.algo, event.target.checked)
    }

    render() {
        if (this.state.lineChecks == undefined) return <div id="legend"></div>

        var colorLegend = null
        if (this.type == 'neural') {
            colorLegend = this.state.lineChecks.map(line => {
                var comp = line.color.rgb
                return <div key={line.algo} class="d-flex" style={{ width: "100%", height: "1rem" }}>
                    <small class="small flex-shrink-0" style={{ width: '2.5rem' }}>{line.name == "undefined" ? '-' : line.name}</small>
                    <div class="flex-grow-1" style={{ "background-image": `linear-gradient(to right, rgba(${comp.r}, ${comp.g}, ${comp.b}, 0.2), rgba(${comp.r}, ${comp.g}, ${comp.b},1))` }}></div>
                </div>
            })
        } else {
            colorLegend = this.state.lineChecks.map(line => {
                var comp = line.color.rgb
                return <div key={line.algo} style={{ width: "100%", height: "1rem", "background-image": `linear-gradient(to right, rgba(${comp.r}, ${comp.g}, ${comp.b}, 0.2), rgba(${comp.r}, ${comp.g}, ${comp.b},1))` }}>
                </div>
            })
        }

        return <div id="legend" style={{ width: "100%" }}>
            {this.state.lineChecks.map(line => {

                var comp = line.color.rgb

                return <Checky
                    key={line.algo}
                    checked={line.checked} onChange={this.onCheckbox} id={line.algo} comp={comp} name={line.name}
                ></Checky>
            })}


        </div>
    }
}