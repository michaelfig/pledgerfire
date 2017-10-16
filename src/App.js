import React, { Component } from 'react'
import PropTypes from 'prop-types'

import TrackingGroupList from './TrackingGroupList'
import { connect, Provider } from 'react-redux'

import './react-toolbox/theme.css'
import theme from './react-toolbox/theme'
import ThemeProvider from 'react-toolbox/lib/ThemeProvider'
import AppBar from 'react-toolbox/lib/app_bar/AppBar'

import store from './store'
import Ticker from './Ticker'

import AuthDialog from './AuthDialog'

class App extends Component {
    static propTypes = {
	groups: PropTypes.object,
    }

    openAuth() {
	this.props.dispatch({type: 'LOCAL_AUTH_ACTIVE', active: true})
    }

    render() {
	const { groups, now } = this.props
	const stamp = new Date(now * 1000)
	const title = `Pledger - ${stamp.toLocaleString()}`
	return [<AppBar key='a' leftIcon='menu' title={title} rightIcon='account_circle'
		onRightIconClick={this.openAuth.bind(this)}>
		</AppBar>,
		<TrackingGroupList key='b' groups={groups} />
	       ]
    }
}

const ConnectedApp = connect(
    ({groups, local: {now}}) => ({groups, now})
)(App)


export default () => (
	<Provider store={store}>
	<ThemeProvider theme={theme}>
	<div>
	<Ticker>
	<ConnectedApp />
	</Ticker>
	<AuthDialog />
	</div>
	</ThemeProvider>
	</Provider>
)
