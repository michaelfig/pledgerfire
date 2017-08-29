import React, { Component } from 'react';
import PropTypes from 'prop-types'
import logo from './logo.svg';
import './App.css';
import { connect, Provider } from 'react-redux'
import { firebaseConnect, isLoaded, isEmpty } from 'react-redux-firebase'

import store from './store'

class App extends Component {
    static propTypes = {
	auth: PropTypes.object
    }
    
    render() {
	const { auth } = this.props
	const LoginState = (!isLoaded(auth) || isEmpty(auth)) ?
	      <p>Logging in...</p> :
	      auth.isAnonymous ? <p>You are logged in anonymously.</p> :
	      <p>You are logged in.</p>
				       
	return (
      <div className="App">
        <div className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h2>Welcome to Pledger</h2>
        </div>
        <p className="App-intro">
          Making an account of your life, socially.
        </p>
		{LoginState}
	</div>
    );
    }
}

const ConnectedApp = firebaseConnect()(connect(
    ({firebase: {auth}}) => ({auth: typeof auth === 'function' ? null : auth})
)(App))

export default () => (
	<Provider store={store}>
	<ConnectedApp />
	</Provider>
)
