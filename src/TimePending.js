import React, { Component } from 'react'
import PropTypes from 'prop-types'
import {connect} from 'react-redux'
import TimeGoal from './TimeGoal'
import TimeCounter from './TimeCounter'

import FontIcon from 'react-toolbox/lib/font_icon'

class TimePending extends Component {
    static propTypes = {
	id: PropTypes.number.isRequired,
	start: PropTypes.number,
	pending: PropTypes.number.isRequired,
	now: PropTypes.number.isRequired,
	base: PropTypes.number.isRequired,
	goal: PropTypes.number.isRequired,
    }

    toggleRunning() {
	const {start, id, now, pending, dispatch} = this.props
	if (start === null) {
	    dispatch({type:'TIME_PENDING_START', id, timer:now})
	}
	else {
	    dispatch({type:'TIME_PENDING_PAUSE', id, pending: now - start + pending})
	}
    }

    render() {
	const {now, pending, start, base, goal} = this.props
	const sofar = (start === null ? 0 : now - start) + pending
	const goalProps = {pending:sofar, base, goal}
	const icon = (start === null ? 'alarm_on' : 'alarm_off')
	return <div><FontIcon onClick={this.toggleRunning.bind(this)}>{icon}</FontIcon>
	    <TimeCounter pending={sofar} />
	    <TimeGoal {...goalProps} /></div>
    }
}

const ConnectedTimePending = connect(({local: {now}}) => ({now}))(TimePending)
export default ConnectedTimePending
