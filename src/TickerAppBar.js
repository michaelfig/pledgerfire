import React from 'react'
import AppBar from 'react-toolbox/lib/app_bar/AppBar'
import { connect } from 'react-redux'

import Ticker from './Ticker'

const TickerAppBar = ({now, openAuth}) => {
    const stamp = new Date(now * 1000)
    const title = `Pledger - ${stamp.toLocaleString()}`

    return (<Ticker>
	    <AppBar leftIcon='menu' title={title} rightIcon='account_circle'
            onRightIconClick={openAuth}>
	    </AppBar>
	    </Ticker>)
}

const ConnectedTickerAppBar = connect(
    ({local: {now}}) => ({now})
)(TickerAppBar)

export default ConnectedTickerAppBar
