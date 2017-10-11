import React, { Component } from 'react'
import PropTypes from 'prop-types'
import logo from './logo.svg'
import './App.css';
import TrackingGroupList from './TrackingGroupList'
import { connect, Provider } from 'react-redux'
import { firebaseConnect, isLoaded, isEmpty } from 'react-redux-firebase'
import './react-toolbox/theme.css'
import theme from './react-toolbox/theme'
import ThemeProvider from 'react-toolbox/lib/ThemeProvider'

import store from './store'
import Ticker from './Ticker'

const BIRTHDAY = new Date(1975, 8, 16, 6, 12, 0)
const WORK_START = new Date()
WORK_START.setHours(9,0,0,0)

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
			{id: 0, title:'Ungrouped',
			 trackers:[
			     {id: 2,
			      title: 'Work',
			      pendings: [
				  {id: 2, unit:'s', pending:WORK_START, base:0, goal:0}
			      ],
			      categories: [
				  {id: 3, name: 'self/work'},
			      ]
			     },
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
	      <div className='App-body'><TrackingGroupList groups={groups} /></div>
				       
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
	<ThemeProvider theme={theme}>
	<Ticker>
	<ConnectedApp />
	</Ticker>
	</ThemeProvider>
	</Provider>
)
