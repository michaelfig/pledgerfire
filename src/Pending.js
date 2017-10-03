import React, { Component } from 'react'
import PropTypes from 'prop-types'
import TimePending from './TimePending'

class Pending extends Component {
    static propTypes = {
	unit: PropTypes.string.isRequired,
	base: PropTypes.number.isRequired,
	goal: PropTypes.number.isRequired
    }

    render() {
	const {id, unit, pending, base, goal} = this.props
	if (unit === 's') {
	    const childProps = {id,
				start: pending ? Math.floor(pending.getTime() / 1000) : null,
				base, goal}
	    return <TimePending {...childProps} />
	}
	else {
	    throw new Error(`Unrecognized unit ${unit}`)
	}
    }
}

export default Pending
