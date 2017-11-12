import React, { Component } from 'react'
import PropTypes from 'prop-types'
import {connect} from 'react-redux'
import {firebaseConnect} from 'react-redux-firebase'
import TimeGoal from './TimeGoal'
import TimeCounter from './TimeCounter'
import Ticker from './Ticker'

import Avatar from 'react-toolbox/lib/avatar/Avatar'
import Chip from 'react-toolbox/lib/chip/Chip'

import {stopPendingGroup} from './utils'

class TimePending extends Component {
    static propTypes = {
	id: PropTypes.number.isRequired,
	start: PropTypes.instanceOf(Date),
	timer: PropTypes.number,
	pending: PropTypes.number.isRequired,
	now: PropTypes.number.isRequired,
	base: PropTypes.number.isRequired,
	goal: PropTypes.number.isRequired,
    }


    state = {
	active: false,
    }

    toggleRunning() {
	const {firebase, timer, id, stopGroup, now, pending, pendings} = this.props
	if (!timer) {
	    let updates
	    if (stopGroup)
		updates = stopPendingGroup(pendings, stopGroup, now)
	    else
		updates = {}
	    firebase.updateProfile({...updates,
				    [`pendings/${id}/start`]: null,
				    [`pendings/${id}/timer`]: now,
				   })
	}
	else {
	    firebase.updateProfile({[`pendings/${id}/pending`]: (now - timer) + pending,
				    [`pendings/${id}/start`]: null,
				    [`pendings/${id}/timer`]: null,
				   })
	}
    }

    render() {
	const {id, now, pending, timer, base, goal} = this.props
	const sofar = (timer ? now - timer : 0) + pending
	const goalProps = {pending:sofar, base, goal}
	const icon = (timer ? 'alarm_off' : 'alarm_on')
	const bgcolor = (timer ? 'green' : 'red')
	return <Chip key={id} style={{paddingRight: 0}}>
	    <Avatar onClick={this.toggleRunning.bind(this)} style={{backgroundColor: bgcolor}} icon={icon} />
	    <Ticker>
	    <TimeCounter pending={sofar} />
	    <TimeGoal {...goalProps} />
	    </Ticker>
	    <Avatar icon='restore' style={{marginLeft:'8px', marginRight: 0}}
	    onClick={() => this.props.dispatch({type: 'LOCAL_PENDING_RESET', id})} />
	    </Chip>
    }
}

const ConnectedTimePending = firebaseConnect()(connect(({local: {now}}) => ({now}))(TimePending))
export default ConnectedTimePending
