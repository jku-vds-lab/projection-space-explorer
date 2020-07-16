import React = require("react")
import { FlexParent } from "../../../util/FlexParent"

type SequenceLineItemProps = {
    content: any
    onClick: any
    image: string
    selected: boolean
}


export function SequenceLineItem({ content, onClick, image, selected }: SequenceLineItemProps) {

    return <div style={{
        display: 'flex',
        flexDirection: 'row',
        cursor: 'pointer'
    }}
        onClick={onClick}>
        <div
            style={{
                flexDirection: 'column',
                height: 32
            }}
        >
            <div style={{
                marginLeft: 5,
                marginTop: -1,
                height: 11,
                width: '2px',
                backgroundColor: selected ? '#1976d2' : '#bdbdbd'
            }}></div>
            <div style={{
                border: selected ? '3px solid #1976d2' : '3px solid #bdbdbd',
                borderRadius: '25px',
                width: 6,
                height: 6,
                backgroundColor: selected ? '#1976d2' : '#bdbdbd'
            }}></div>
            <div style={{
                marginLeft: 5,
                marginBottom: -1,
                height: 11,
                width: '2px',
                backgroundColor: selected ? '#1976d2' : '#bdbdbd'
            }}></div>
        </div>
        <FlexParent
            flexDirection='row'
            alignItems='center'>
            <img src={image} style={{
                marginLeft: 16,
                marginRight: 16,
                width: "1rem",
                height: "1rem"
            }} />
            <span>{content}</span>
        </FlexParent>

    </div>
}