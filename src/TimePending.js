import React, { Component } from 'react'
import PropTypes from 'prop-types'
import {connect} from 'react-redux'
import TimeGoal from './TimeGoal'
import TimeCounter from './TimeCounter'

import Avatar from 'react-toolbox/lib/avatar/Avatar'
import Chip from 'react-toolbox/lib/chip/Chip'

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

    toggleRunning() {
	const {timer, id, now, pending, dispatch} = this.props
	if (timer === null) {
	    dispatch({type:'TIME_PENDING_START', id, timer: now})
	}
	else {
	    dispatch({type:'TIME_PENDING_PAUSE', id, pending: (now - timer) + pending})
	}
    }

    render() {
	const {now, pending, timer, base, goal} = this.props
	const sofar = (timer === null ? 0 : now - timer) + pending
	const goalProps = {pending:sofar, base, goal}
	const icon = (timer === null ? 'alarm_on' : 'alarm_off')
	const bgcolor = (timer == null ? 'red' : 'green')
	return <Chip>
	    <Avatar onClick={this.toggleRunning.bind(this)} style={{backgroundColor: bgcolor}} icon={icon} />
	    <TimeCounter pending={sofar} />
	    <TimeGoal {...goalProps} />
	    </Chip>
    }
}

const ConnectedTimePending = connect(({local: {now}}) => ({now}))(TimePending)
export default ConnectedTimePending
