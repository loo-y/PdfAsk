import React from 'react'
import { State } from './Model'
import Ctrl from './Controller'
import Body from './component/Body'
export type ViewProps = {
    state: State,
    ctrl: Ctrl
}

export default function View({ state, ctrl }: ViewProps) {
    return (
        <div>
            <Body />
        </div>
    )
}