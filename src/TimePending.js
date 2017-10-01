import React, { Component } from 'react'
import PropTypes from 'prop-types'
import TimeGoal from './TimeGoal'
import TimeCounter from './TimeCounter'

class TimePending extends Component {
    static propTypes = {
	id: PropTypes.number.isRequired,
	start: PropTypes.instanceOf(Date),
	base: PropTypes.number.isRequired,
	goal: PropTypes.number.isRequired
    }

    render() {
	const {id, start, base, goal} = this.props
	const pending = start === null ? 0 :
	      Math.floor((new Date().getTime() - start.getTime()) / 1000)
	const goalProps = {pending, base, goal}
	return [<TimeCounter key={id} pending={pending} />,
		<TimeGoal key={'g'+id} {...goalProps} />]
    }
}

export default TimePending
