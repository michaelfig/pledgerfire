import React, { Component } from 'react'
import PropTypes from 'prop-types'
import TimePending from './TimePending'

class Pending extends Component {
    static propTypes = {
	id: PropTypes.number.isRequired,
	unit: PropTypes.string.isRequired,
	base: PropTypes.number.isRequired,
	goal: PropTypes.number.isRequired,
	pending: PropTypes.number.isRequired,
    }

    render() {
	const { unit } = this.props
	if (unit === 's') {
	    const timer = this.props.start === null ? this.props.timer :
		  Math.floor(this.props.start.getTime() / 1000)
	    return <TimePending {...{...this.props, timer}} />
	}
	else {
	    throw new Error(`Unrecognized unit ${unit}`)
	}
    }
}

export default Pending
