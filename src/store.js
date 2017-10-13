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

    case 'LOCAL_TRACKER_SET':
	return {...state, trackers:
		{...state.trackers, [action.id]:
		 {...state.trackers[action.id], [action.field]:action.value}}}

    default:
	return state === undefined ?
	    {group: 0, now: null, trackers: {}} : state
    }
}

const groupsReducer = (state, action) => {
    switch (action.type) {
    default:
	return state === undefined ?
	    {1: {id:1, title:'Work',
		 trackers:[1], required:[5,6],
		},
	     0: {id:0, title:'Ungrouped',
		 trackers:[2,3], required:[],
		},
	    }
	: state
    }
}

const categoriesReducer = (state, action) => {
    switch (action.type) {
    default:
	return state === undefined ?
	    {1: 'v1/B-45767',
	     2: 'tes/security',
	     3: 'self/work',
	     4: 'life',
	     5: 'v1',
	     6: 'tes',
	    }
	: state
    }
}

const BIRTHDAY = new Date(1975, 8, 16, 6, 12, 0)
const WORK_START = new Date()
WORK_START.setHours(9,0,0,0)

const pendingsReducer = (state, action) => {
    switch (action.type) {
    case 'TIME_PENDING_START':
	return {...state, [action.id]: {...state[action.id],
					timer: new Date(action.timer)}}

    case 'TIME_PENDING_PAUSE':
	return {...state, [action.id]: {...state[action.id],
					pending: action.pending,
					timer: null}}
	
    default:
	return state === undefined ?
	    {1:
	     {id:1, unit:'s', pending:0, timer:null, base:0, goal:0},
	     2:
	     {id:2, unit:'s', pending:0, timer:WORK_START, base:0, goal:0},
	     3:
	     {id:3, unit:'s', pending:0, timer:BIRTHDAY, base:0, goal:0},
	    }
	: state
    }
}

const trackersReducer = (state, action) => {
    switch (action.type) {
    default:
	return state === undefined ?
	    {1:
	     {id:1,
	      title: 'Perl Taint', notes:'Security is difficult',
		 pendings: [1],
		 categories: [1,2],
	     },
	     2:
	     {id:2,
	      title: 'Work', notes:'Burning the midnight oil',
		 pendings: [2],
		 categories: [3],
	     },
	     3:
	     {id:3,
	      title: 'Since birth', notes:'Hello, world!',
		 pendings: [3],
		 categories: [4],
	     }
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
    categories: categoriesReducer,
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
