import { createStore, combineReducers, compose } from 'redux'
import { reactReduxFirebase, firebaseStateReducer } from 'react-redux-firebase'
import firebase from 'firebase/app'
import 'firebase/database'
import 'firebase/auth'
import * as fbConfig from './firebase.json'

const nowReducer = (state, action) => {
    switch (action.type) {
    case 'TICKER_SET_NOW':
	return action.now

    default:
	return state === undefined ? null : state
    }
}

const visibleGroupReducer = (state, action) => {
    switch (action.type) {
    case 'VISIBLE_GROUP_SET':
	return action.group

    default:
	return state === undefined ? 0 : state
    }
}

const rootReducer = combineReducers({
    firebase: firebaseStateReducer,
    now: nowReducer,
    visibleGroup: visibleGroupReducer,
})

const firebaseApp = firebase.initializeApp(fbConfig)
const rrfConfig = {
    userProfile: 'users',
    enableEmptyAuthChanges: true,
    onAuthStateChanged: (user, firebase) => {
	if (!user) {
	    firebase.auth().signInAnonymously().catch(error => {
		console.log('Error signing in anonymously', error.message);
	    })
	}
    }
}
const createStoreWithFirebase = compose(
    reactReduxFirebase(firebaseApp, rrfConfig)
)(createStore)


const initialState = {
    firebase
}

export default createStoreWithFirebase(rootReducer, initialState)
