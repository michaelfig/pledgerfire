import React, { Component } from 'react'
import PropTypes from 'prop-types'

import TrackingGroupList from './TrackingGroupList'
import { connect, Provider } from 'react-redux'
import { firebaseConnect } from 'react-redux-firebase'

import './react-toolbox/theme.css'
import theme from './react-toolbox/theme'
import ThemeProvider from 'react-toolbox/lib/ThemeProvider'

import store from './store'
import TickerAppBar from './TickerAppBar'

import AuthDialog from './AuthDialog'

class App extends Component {
    static propTypes = {
	auth: PropTypes.object
    }

    openAuth() {
	this.props.dispatch({type: 'LOCAL_AUTH_ACTIVE', active: true})
    }

    render() {
	const { auth } = this.props
	return [<TickerAppBar key='a' openAuth={this.openAuth.bind(this)} />,
		(auth === null ? 'Logging in...' :
		 <TrackingGroupList key='b' auth={auth} />)
	       ]
    }
}

const ConnectedApp = firebaseConnect()(connect(
    ({firebase: {auth}}) =>
	({auth: typeof auth === 'function' ? null : auth})
)(App))


export default () => (
	<Provider store={store}>
	<ThemeProvider theme={theme}>
	<div>
	<ConnectedApp />
	<AuthDialog />
	</div>
	</ThemeProvider>
	</Provider>
)
