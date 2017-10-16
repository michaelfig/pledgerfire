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

    case 'LOCAL_AUTH_STATUS':
	let status = {...action}
	delete status.type
	return {...state, auth: status}

    case 'LOCAL_AUTH_ACTIVE':
	return {...state, authActive: action.active}

    case 'LOCAL_TRACKER_SET':
	const tracker = state.trackers[action.id] || {}
	const newState = {...state, trackers:
			  {...state.trackers, [action.id]:
			   {...tracker, [action.field]:action.value}}}
	return newState
	
    default:
	return state === undefined ?
	    {group: 0, now: Math.floor((new Date().getTime()) / 1000),
	     trackers: {}, auth: {}, authActive: false} : state
    }
}

const groupsReducer = (state, action) => {
    switch (action.type) {
    case 'GROUP_TRACKER_ADD':
	return {...state,
		[action.id]: {...state[action.id],
			      trackers:[...state[action.id].trackers,
					action.tracker]}}

    default:
	return state === undefined ?
	    {1: {id:1, title:'Work',
		 trackers:[1], required:['v1','tes'],
		},
	     0: {id:0, title:'Ungrouped',
		 trackers:[2,3], required:[],
		},
	     last: 1,
	    }
	: state
    }
}

const BIRTHDAY = new Date(1975, 8, 16, 6, 12, 0)
const WORK_START = new Date()
WORK_START.setHours(9,0,0,0)

const pendingsReducer = (state, action) => {
    const stopGroup = (group, now) => {
	let state2 = {}
	for (const id in state) {
	    if (id === 'last')
		state2[id] = state[id]
	    else if (group !== 0 && state[id].group === group)
		state2[id] = {...state[id],
			      timer: null,
			      pending: state[id].timer === null ?
			      state[id].pending :
			      state[id].pending + now - state[id].timer,
			      start: null}
	    else
		state2[id] = state[id]
	}
	console.log(state2)
	return state2
    }

    switch (action.type) {
    case 'TIME_PENDING_ADD':
	const id = state.last + 1
	return {...stopGroup(action.group, action.timer),
		[id]: {id, unit:'s', pending:0,
		       start: null,
		       timer: action.timer,
		       base:0, goal:0,
		       group: action.group},
		last: id,
	       }
	
    case 'TIME_PENDING_START':
	return {...stopGroup(state[action.id].group, action.timer),
		[action.id]: {...state[action.id],
			      start: null,
			      timer: action.timer}}

    case 'TIME_PENDING_PAUSE':
	return {...state,
		[action.id]:
		{...state[action.id],
		 pending: action.pending,
		 start: null,
		 timer: null}}
	
    default:
	return state === undefined ?
	    {1:
	     {id:1, unit:'s', pending:0, start:null, timer:null, base:0, goal:0, group:1},
	     2:
	     {id:2, unit:'s', pending:0, start:WORK_START, timer:null, base:0, goal:0, group:0},
	     3:
	     {id:3, unit:'s', pending:0, start:BIRTHDAY, timer:null, base:0, goal:0, group:0},
	     last: 3,
	    }
	: state
    }
}

const trackersReducer = (state, action) => {
    switch (action.type) {
    case 'TRACKER_ADD':
	const id = state.last + 1
	return {...state,
		[id]: {id, title: '', notes: '',
		       pendings: action.pendings,
		       categories: action.categories},
		last: id,
	       }
	
    default:
	return state === undefined ?
	    {1:
	     {id:1,
	      title: 'Perl Taint', notes:'Security is difficult',
	      pendings: [1],
	      categories: ['v1/B-45767','tes/security'],
	     },
	     2:
	     {id:2,
	      title: 'Work', notes:'Burning the midnight oil',
	      pendings: [2],
	      categories: ['self/work'],
	     },
	     3:
	     {id:3,
	      title: 'Since birth', notes:'Hello, world!',
	      pendings: [3],
	      categories: ['life'],
	     },
	     last: 3,
	    }
	: state
    }
}

const rootReducer = combineReducers({
    firebase: firebaseStateReducer,
    local: localReducer,
    trackers: trackersReducer,
    groups: groupsReducer,
    pendings: pendingsReducer,
})

const firebaseApp = firebase.initializeApp(fbConfig)
var onAuthStateChanged
const rrfConfig = {
    userProfile: 'users',
    enableEmptyAuthChanges: true,
    onAuthStateChanged: (user, firebase) => onAuthStateChanged(user, firebase),
}
const createStoreWithFirebase = compose(
    reactReduxFirebase(firebaseApp, rrfConfig)
)(createStore)


const initialState = {
    firebase
}

const store = createStoreWithFirebase(rootReducer, initialState)

onAuthStateChanged = async (user, firebase) => {
    if (!user) {
	try {
	    await firebase.auth().signInAnonymously()
	    store.dispatch({type: 'LOCAL_AUTH_STATUS', uid: user.uid, anonymous: true})
	} catch (error) {
	    store.dispatch({type: 'LOCAL_AUTH_STATUS', error: error.message})
	}
    }
    else {
	const accessToken = await user.getIdToken()
	store.dispatch({type: 'LOCAL_AUTH_STATUS',
			uid: user.uid,
			email: user.email,
			phoneNumber: user.phoneNumber,
			accessToken})
    }
}

export default store
