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
	const { auth, groups } = this.props
	const GroupList = (!isLoaded(auth) || isEmpty(auth)) ?
	      <p>Logging in...</p> :
	      <TrackingGroupList groups={groups} />
				       
	return [<AppBar leftIcon='menu' title='Pledger' rightIcon='account_circle'>
		 </AppBar>, GroupList]
    }
}

const ConnectedApp = firebaseConnect()(connect(
    ({firebase: {auth}, groups}) => ({auth: typeof auth === 'function' ? null : auth, groups})
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
