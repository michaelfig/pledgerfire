import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Switch, Route } from 'react-router'
import { HashRouter } from 'react-router-dom'

import TrackingGroupList from './TrackingGroupList'
import TimeSheet from './TimeSheet'
import { connect, Provider } from 'react-redux'
import { firebaseConnect } from 'react-redux-firebase'

import './react-toolbox/theme.css'
import theme from './react-toolbox/theme'
import ThemeProvider from 'react-toolbox/lib/ThemeProvider'

import Layout from 'react-toolbox/lib/layout/Layout'
import NavDrawer from 'react-toolbox/lib/layout/NavDrawer'
import Navigation from 'react-toolbox/lib/navigation/Navigation'
import Link from 'react-toolbox/lib/link/Link'
import Panel from 'react-toolbox/lib/layout/Panel'

import store from './store'
import TickerAppBar from './TickerAppBar'

import AuthDialog from './AuthDialog'

class App extends Component {
    static propTypes = {
	auth: PropTypes.object
    }

    state = {
	navActive: false,
    }

    openAuth = () => {
	this.props.dispatch({type: 'LOCAL_AUTH_ACTIVE', active: true})
    }

    toggleNav = () => {
	this.setState({navActive: !this.state.navActive})
	return true
    }

    render() {
	const { auth } = this.props
	let MainPanel
	if (auth === null) {
	    MainPanel = 'Logging in...'
	}
	else {
	    MainPanel = (
		<HashRouter>
		    <Switch>
		    <Route exact path='/' render={(props) => (
			<TrackingGroupList {...props} auth={auth} />
		    )} />
		    <Route path='/tracker' render={(props) => (
			<TrackingGroupList {...props} auth={auth} />
		    )} />
		    <Route path='/timesheet' render={(props) => (
			<TimeSheet {...props} auth={auth} />
		    )} />
		    <Route path='/' render={(props) => (
			    <div>Unrecognized path {props.location.pathname}</div>
		    )} />
		    </Switch>
		</HashRouter>
	    )
	}
	return (
		<Layout>
		<NavDrawer active={this.state.navActive} onOverlayClick={this.toggleNav}>
		<Navigation type='vertical'>
		<Link label='Trackers' icon='alarm_on' href='#/tracker' onClick={this.toggleNav} />
		<Link label='Timesheet' icon='event_note' href='#/timesheet' onClick={this.toggleNav} />
		</Navigation>
		</NavDrawer>
		<Panel>
		<TickerAppBar openMenu={this.toggleNav} openAuth={this.openAuth} />
		{MainPanel}
	        </Panel>
		</Layout>
	)
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
