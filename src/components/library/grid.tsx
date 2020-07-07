import * as React from 'react'

type FlexParentProps = {
    children: any
    flexDirection?: any
    justifyContent?: string
    alignItems?: string
    margin?: any
}

export function FlexParent({ children, flexDirection, justifyContent, alignItems, margin }: FlexParentProps) {
    return <div
        style={{
            display : 'flex',
            flexDirection : flexDirection,
            justifyContent : justifyContent,
            alignItems : alignItems,
            margin : margin
        }}

    >{children}</div>
}