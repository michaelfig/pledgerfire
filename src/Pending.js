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
	    const childProps = {
		...this.props,
		start: this.props.timer !== null ? Math.floor(this.props.timer.getTime() / 1000) : null,
	    }
	    return <TimePending {...childProps} />
	}
	else {
	    throw new Error(`Unrecognized unit ${unit}`)
	}
    }
}

export default Pending
