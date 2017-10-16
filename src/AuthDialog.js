import React, { Component } from 'react'

import { connect } from 'react-redux'
import { firebaseConnect, isLoaded, isEmpty } from 'react-redux-firebase'

import Dialog from 'react-toolbox/lib/dialog/Dialog'

import firebase from 'firebase/app'
import firebaseui from 'firebaseui'
import 'firebaseui/dist/firebaseui.css'

class AuthDialog extends Component {
    authConfig = {
	callbacks: {
	    signInSuccess: (currentUser, credential, redirectUrl) => {
		// FIXME: Maybe merge the account.
		return true;
	    },
	},
	signInOptions: [
	    firebase.auth.GoogleAuthProvider.PROVIDER_ID,
	    //firebase.auth.FacebookAuthProvider.PROVIDER_ID,
	    //firebase.auth.TwitterAuthProvider.PROVIDER_ID,
	    //firebase.auth.GithubAuthProvider.PROVIDER_ID,
	    firebase.auth.EmailAuthProvider.PROVIDER_ID,
	    firebase.auth.PhoneAuthProvider.PROVIDER_ID,
	],
	signInFlow: 'popup',
    }

    ui = new firebaseui.auth.AuthUI(firebase.auth(), this.authConfig)

    closeAuth() {
	this.props.dispatch({type: 'LOCAL_AUTH_ACTIVE', active: false})
    }

    signOut() {
	//this.closeAuth()
	firebase.auth().signOut()
    }

    refAuth(ref) {
	if (ref == null) {
	    this.ui.reset()
	}
	else {
	    this.ui.start('#auth-ui', this.authConfig)
	}
    }

    render() {
	const { lauth, auth, active } = this.props
	return (<Dialog
		actions={[{label: 'OK', onClick: this.closeAuth.bind(this)},
			  {label: 'Sign Out', onClick: this.signOut.bind(this)}]}
		active={active} title='Sign In'
		onEscKeyDown={this.closeAuth.bind(this)}
		onOverlayClick={this.closeAuth.bind(this)}>
		{lauth.error ? <div>Error logging in: {lauth.error}</div> : []}
		{auth && auth.isAnonymous ? <div>Signed in anonymously ({auth.uid})</div> : (!isLoaded(auth) || isEmpty(auth)) ? <div>Logging in...</div> : <div>Signed in as {lauth.email || lauth.phoneNumber}</div>}
		<div id='auth-ui' ref={this.refAuth.bind(this)}></div>
		</Dialog>)
    }
}

export default firebaseConnect()(connect(
    ({firebase: {auth}, local: {auth: lauth, authActive}}) =>
	({auth: typeof auth === 'function' ? null : auth, lauth, active: authActive})
)(AuthDialog))
