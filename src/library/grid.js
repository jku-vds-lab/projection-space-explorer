



export function FlexParent({ children, flexDirection, justifyContent, alignItems, margin }) {
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