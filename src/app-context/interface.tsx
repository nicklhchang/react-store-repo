import React from "react"

export interface Props {
    // children?: React.ReactNode
    // providers: Array<JSX.Element>
    children?: React.ReactNode
    providers: Array<React.ReactNode>
}

export interface Dispatch {
    type: string
    payload: any
}