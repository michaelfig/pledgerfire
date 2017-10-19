import { createStore, combineReducers, compose } from 'redux'
import { reactReduxFirebase, firebaseStateReducer } from 'react-redux-firebase'
import firebase from 'firebase/app'
import 'firebase/database'
import 'firebase/auth'
import * as fbConfig from './firebase.json'

const localReducer = (state, action) => {
    switch (action.type) {
    case 'TICKER_SET_NOW':
	return {...state, now: action.now}

    case 'VISIBLE_GROUP_SET':
	return {...state, group: action.group}

    case 'LOCAL_AUTH_ACTIVE':
	return {...state, authActive: action.active}

    case 'LOCAL_TRACKER_EXPAND':
	const state2 = {...state, expanded: {...state.expanded}}
	if (state.expanded[action.id]) {
	    delete state2.expanded[action.id]
	}
	else {
	    state2.expanded[action.id] = true
	}
	return state2

    default:
	return state === undefined ?
	    {group: 0, now: Math.floor((new Date().getTime()) / 1000),
	     trackers: {}, auth: {}, authActive: false, expanded: {}} : state
    }
}

const rootReducer = combineReducers({
    firebase: firebaseStateReducer,
    local: localReducer,
})

const firebaseApp = firebase.initializeApp(fbConfig)
const rrfConfig = {
    enableEmptyAuthChanges: true,
    userProfile: 'users',
    updateProfileOnLogin: true,
    onAuthStateChanged: async (user, firebase, dispatch) => {
	if (!user) {
	    try {
		await firebase.auth().signInAnonymously()
	    }
	    catch (error) {
		console.log('Cannot sign in anonymously', error)
	    }
	}
	else {
	    await firebase.updateProfile({
	    	uid: user.uid,
		isAnonymous: user.isAnonymous ? true : false,
		email: user.email || null,
		phoneNumber: user.phoneNumber || null,
	    })
	}
    }
}
const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose
const createStoreWithFirebase = composeEnhancers(
    reactReduxFirebase(firebaseApp, rrfConfig)
)(createStore)


const initialState = {
    firebase
}

const store = createStoreWithFirebase(rootReducer, initialState)


export default store
