import React from 'react'
import { State } from './Model'
import Ctrl from './Controller'
export type ViewProps = {
    state: State,
    ctrl: Ctrl
}

export default function View({ state, ctrl }: ViewProps) {
    return (
        <>
        </>
    )
}