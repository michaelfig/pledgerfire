import React, { Component } from 'react'
import PropTypes from 'prop-types'
import logo from './logo.svg'
import './App.css';
import TrackingGroupList from './TrackingGroupList'
import { connect, Provider } from 'react-redux'
import { firebaseConnect, isLoaded, isEmpty } from 'react-redux-firebase'

import store from './store'

const BIRTHDAY = new Date('1975-09-16 06:12 MST-0700')

class App extends Component {
    static propTypes = {
	auth: PropTypes.object
    }

    render() {
	const { auth } = this.props
	const groups = [{id: 1, title:'LAI',
			 trackers:[
			     {id: 1,
			      title: 'B-45767 - Perl Taint',
			      pendings: [
				  {id: 1, unit:'s', pending:null, base:0, goal:0}
			      ],
			      categories: [
				  {id: 1, name: 'v1/B-45767'},
				  {id: 2, name: 'tes/security'},
			      ]
			     }
			 ]
			},
			{id: 2, title:'Personal',
			 trackers:[
			     {id: 2,
			      title: 'Work',
			      pendings: [
				  {id: 2, unit:'s', pending:(new Date(122)), base:0, goal:0}
			      ],
			      categories: [
				  {id: 3, name: 'self/work'},
			      ]
			     }
			 ]
			},
			{id: 3, title:'Life',
			 trackers:[
			     {id: 3,
			      title: 'Since birth',
			      pendings: [
				  {id: 3, unit:'s', pending:BIRTHDAY, base:0, goal:0}
			      ],
			      categories: [
				  {id: 4, name: 'life'}
			      ]
			     }
			 ]
			},
		       ]
	const GroupList = (!isLoaded(auth) || isEmpty(auth)) ?
	      <p>Logging in...</p> :
	      <TrackingGroupList groups={groups} />
				       
	return (
      <div className="App">
        <div className="App-header">
          <img src={logo} className="App-logo" alt="logo"/>
          <h2>Welcome to Pledger</h2>
        </div>
        <p className="App-intro">
          Making an account of your life, socially.
        </p>
		{GroupList}
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
