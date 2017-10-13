import React, { Component } from 'react'
import PropTypes from 'prop-types'

import TrackingGroupList from './TrackingGroupList'
import { connect, Provider } from 'react-redux'
import { firebaseConnect, isLoaded, isEmpty } from 'react-redux-firebase'

import './react-toolbox/theme.css'
import theme from './react-toolbox/theme'
import ThemeProvider from 'react-toolbox/lib/ThemeProvider'
import AppBar from 'react-toolbox/lib/app_bar/AppBar'

import store from './store'
import Ticker from './Ticker'

class App extends Component {
    static propTypes = {
	auth: PropTypes.object,
	groups: PropTypes.object,
    }

    render() {
	const { auth, groups, now } = this.props
	const stamp = new Date(now * 1000)
	const title = `Pledger - ${stamp.toLocaleString()}`
	const GroupList = (!isLoaded(auth) || isEmpty(auth)) ?
	      <p key='c'>Logging in...</p> :
	      <TrackingGroupList key='b' groups={groups} />
				       
	      return [<AppBar key='a' leftIcon='menu' title={title} rightIcon='account_circle'>
		 </AppBar>, GroupList]
    }
}

const ConnectedApp = firebaseConnect()(connect(
    ({firebase: {auth}, groups, local: {now}}) => ({auth: typeof auth === 'function' ? null : auth, groups, now})
)(App))

export default () => (
	<Provider store={store}>
	<ThemeProvider theme={theme}>
	<Ticker>
	<ConnectedApp />
	</Ticker>
	</ThemeProvider>
	</Provider>
)
