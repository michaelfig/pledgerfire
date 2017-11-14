import React, { Component } from 'react'

import { enableUniqueIds } from 'react-html-id'

import Button from 'react-toolbox/lib/button/Button'
import Input from 'react-toolbox/lib/input/Input'

// Feature detection from developer.mozilla.org Using the Web Storage API
const storageAvailable = (type) => {
    return window[type] // FIXME
}
const lstorage = storageAvailable('localStorage')
const restore = (vname, deflt) => {
    let val = lstorage ? lstorage.getItem(vname) : null
    return (val !== null) ? val : (deflt === undefined) ? '' : deflt
}

const setstore = (vname, val) => {
    if (lstorage) {
	lstorage.setItem(vname, val)
    }
    return val
}


const DEFAULT_URL = 'https://YOURHOST.kronos.net/wfc/applications/wtk/html/ess/quick-ts.jsp'

export default class Kronos extends Component {
    constructor() {
	super()
	enableUniqueIds(this)
    }

    state = {
	stampURL: restore('KronosURL', DEFAULT_URL),
	username: restore('KronosUser'),
	password: restore('KronosPass'),
    }


    handleStamp = (e) => {
	const f = e.target.form
	const i = document.getElementById(this.getUniqueId('iframe'))
	if ('src' in i) {
	    i.style.visibility = 'visible'
	    f.target = i.name
	}
	f.submit()
    }

    handleReset = (e) => {
	// FIXME: Pop up a confirmation snackbar
	const f = e.target.form
	const i = document.getElementById(this.getUniqueId('iframe'))
	if ('src' in i) {
	    i.style.visibility = 'hidden'
	    f.target = '_blank'
	}
	this.handleURL(DEFAULT_URL, e)
	this.handleUser('')
	this.handlePass('')
    }

    handleURL = (value, e) => {
	const f = e.target.form
	f.action = value
	this.setState({stampURL: setstore('KronosURL', value)})
    }

    handleUser = (value) => {
	this.setState({username: setstore('KronosUser', value)})
    }

    handlePass = (value) => {
	this.setState({password: setstore('KronosPass', value)})
    }

    render() {
	const DetailNote = lstorage ? 'Details are saved only in local storage.': 'You have no local storage: details will not be saved!'
	return (
		<form method='POST' target='_blank' action={this.state.stampURL}>
		<p><i>Note: {DetailNote}</i></p>
		<Input type='text' label='Kronos Quick Time Stamp URL' onChange={this.handleURL} value={this.state.stampURL} />
		<Input type='text' label='Username' name='user' onChange={this.handleUser} value={this.state.username} />
		<Input type='password' label='Password' name='myword' onChange={this.handlePass} value={this.state.password} />
		<Button raised primary onClick={this.handleStamp} label='Update Stamp' />
		<Button raised icon='delete' onClick={this.handleReset} label='Reset Details...' />
		<iframe title='Kronos Stamp' id={this.getUniqueId('iframe')} name={this.getUniqueId('iframe')}
	            style={{leftMargin: '2.5%', visibility: 'hidden'}} width='100%' height='350px' src='blank.html?Submitting Kronos stamp...'>
		Your browser cannot display the Stamp results.</iframe>
		</form>
	)
    }
}
