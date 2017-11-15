import React, { Component } from 'react'

import { enableUniqueIds } from 'react-html-id'

import Button from 'react-toolbox/lib/button/Button'
import Input from 'react-toolbox/lib/input/Input'

const DEFAULT_URL = 'https://YOURHOST.kronos.net/wfc/applications/wtk/html/ess/quick-ts-record.jsp?LOGON_LOCALE_POLICY=1'
const KRONOS_TAB = '_blank'

// Feature detection from developer.mozilla.org Using the Web Storage API
const storageAvailable = (type) => {
    try {
	var storage = window[type],
	      x = '__storage_test__'
	storage.setItem(x, x)
	storage.removeItem(x)
	return storage
    }
    catch(e) {
	return e instanceof DOMException && (
	    // everything except Firefox
	    e.code === 22 ||
		// Firefox
		e.code === 1014 ||
		// test name field too, because code might not be present
		// everything except Firefox
		e.name === 'QuotaExceededError' ||
		// Firefox
		e.name === 'NS_ERROR_DOM_QUOTA_REACHED') &&
	    // acknowledge QuotaExceededError only if there's something already stored
	    storage.length !== 0
    }
}

const lstorage = storageAvailable('localStorage') ? window.localStorage : null
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


export default class Kronos extends Component {
    constructor() {
	super()
	enableUniqueIds(this)
    }

    state = {
	details: false,
	stampURL: restore('KronosURL', DEFAULT_URL),
	username: restore('KronosUser'),
	password: restore('KronosPass'),
    }


    handleAction = (action, e) => {
	const f = e.target.form
	const q = document.getElementById(this.getUniqueId('action'))
	q.value = action
	if (action === 'Home') {
	    f.target = KRONOS_TAB
	}
	else {
	    const i = document.getElementById(this.getUniqueId('iframe'))
	    if ('src' in i) {
		i.style.visibility = 'visible'
		f.target = i.name
	    }
	}

	this.prepareSubmit(f)
	f.submit()
    }

    handleReset = (e) => {
	// FIXME: Pop up a confirmation snackbar
	const f = e.target.form
	const i = document.getElementById(this.getUniqueId('iframe'))
	if ('src' in i) {
	    i.style.visibility = 'hidden'
	    f.target = KRONOS_TAB
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

    prepareSubmit = (f) => {
	const c = document.getElementById(this.getUniqueId('clock'))
	const d = new Date()
	const zp = (val) => ('0' + val).substr(-2) // Zero-pad.
	c.value = d.getUTCFullYear() + ',' +
	    zp(d.getUTCMonth()) + ',' +
	    zp(d.getUTCDate()) + ',' +
	    zp(d.getUTCHours()) + ',' +
	    zp(d.getUTCMinutes()) + ',' +
	    zp(d.getUTCSeconds())
	return true
    }

    render() {
	const hide = (val) => (this.state.details ? val : 'hidden')
	const DetailNote = this.state.details ? lstorage ? <i>Note: Details are saved only in local storage.</i> :
	      <i>Note: You have no local storage: details will not be saved!</i> : ''
	return (
		<form method='POST' target={KRONOS_TAB} action={this.state.stampURL}>
		<input type='hidden' name='LOGON_LOCALE_POLICY' value='1' />
		<input type='hidden' name='StartIndex' value='0' />
		<input type='hidden' id={this.getUniqueId('action')} name='qtsAction' />
		<input type='hidden' id={this.getUniqueId('clock')} name='RunningClock' />
		<p>{DetailNote}</p>
		<Input type={hide('text')} label='Kronos Quick Time Stamp Record URL' onChange={this.handleURL} value={this.state.stampURL} />
		<Input type={hide('text')} label='Username' name='username' onChange={this.handleUser} value={this.state.username} />
		<Input type={hide('password')} label='Password' name='password' onChange={this.handlePass} value={this.state.password} />
		<Button raised style={{display: this.state.details ? 'none' : 'inline'}} primary onClick={(e) => this.handleAction('Timestamp', e)} label='Update Stamp' />
		<Button raised style={{display: this.state.details ? 'none' : 'inline'}} onClick={(e) => this.handleAction('Home', e)} label='Login...' />
		<Button raised style={{display: this.state.details ? 'none' : 'inline'}} icon='mode_edit' onClick={() => this.setState({details: true})} label='Details' />
		<Button raised style={{display: this.state.details ? 'inline' : 'none'}} primary icon='save' onClick={() => this.setState({details: false})} label='Done' />
		<Button raised style={{display: this.state.details ? 'inline' : 'none'}} icon='delete' onClick={this.handleReset} label='Reset Details...' />
		<iframe title='Kronos Stamp' id={this.getUniqueId('iframe')} name={this.getUniqueId('iframe')}
	            style={{leftMargin: '2.5%', visibility: 'hidden'}} width='100%' height='350px' src='blank.html?Submitting Kronos stamp...'>
		Your browser cannot display the Stamp results.</iframe>
		</form>
	)
    }
}
