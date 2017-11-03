import React, { Component } from 'react'

import { connect } from 'react-redux'
import { firebaseConnect, isLoaded } from 'react-redux-firebase'

import Dialog from 'react-toolbox/lib/dialog/Dialog'

import firebase from 'firebase/app'
import firebaseui from 'firebaseui'
import 'firebaseui/dist/firebaseui.css'

class AuthDialog extends Component {
    authConfig = {
	callbacks: {
	    // Don't redirect.
	    'signInSuccess': (user, credential, redirectUrl) => false,
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
	const { profile, active } = this.props
	let Status
	if (!isLoaded(profile))
	    Status = (<div>Logging in...</div>)
	else if (profile.isAnonymous)
	    Status = (<div>Signed in anonymously ({profile.uid})</div>)
	else
	    Status = (<div>Signed in as {profile.email || profile.phoneNumber}</div>)
	return (<Dialog
		actions={[{label: 'Dismiss', primary:true, onClick: this.closeAuth.bind(this)},
			  {label: 'Sign Out', onClick: this.signOut.bind(this)}]}
		active={active} title='Sign In'
		onEscKeyDown={this.closeAuth.bind(this)}
		onOverlayClick={this.closeAuth.bind(this)}>
		{Status}
		<div id='auth-ui' ref={this.refAuth.bind(this)}></div>
		</Dialog>)
    }
}

export default firebaseConnect()(connect(
    ({firebase: {profile}, local: {authActive}}) =>
	({profile, active: authActive})
)(AuthDialog))
