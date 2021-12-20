import React = require("react")

/**
 * Base component for layers behind and in front of the webgl view.
 */
export function PSELayer({children}) {
    return <div style={{
        width: '100%',
        height: '100%',
        position: 'absolute',
        background: 'transparent',
        pointerEvents: 'none'
    }}>
        {children}
    </div>
}