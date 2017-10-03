import React, { Component } from 'react'
import PropTypes from 'prop-types'
import {connect} from 'react-redux'
import TimeGoal from './TimeGoal'
import TimeCounter from './TimeCounter'

class TimePending extends Component {
    static propTypes = {
	id: PropTypes.number.isRequired,
	start: PropTypes.number,
	now: PropTypes.number.isRequired,
	base: PropTypes.number.isRequired,
	goal: PropTypes.number.isRequired
    }

    render() {
	const {id, start, now, base, goal} = this.props
	const pending = (start === null ? 0 : now - start)
	const goalProps = {pending, base, goal}
	return [<TimeCounter key={id} pending={pending} />,
		<TimeGoal key={'g'+id} {...goalProps} />]
    }
}

const ConnectedTimePending = connect(({now}) => ({now: now}))(TimePending)
export default ConnectedTimePending
