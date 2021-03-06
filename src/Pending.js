import React, { Component } from 'react'
import PropTypes from 'prop-types'
import {connect} from 'react-redux'

import TimePending from './TimePending'

class Pending extends Component {
    static propTypes = {
	id: PropTypes.number.isRequired,
	unit: PropTypes.string.isRequired,
	base: PropTypes.number.isRequired,
	goal: PropTypes.number.isRequired,
	pending: PropTypes.number.isRequired,
	onToggle: PropTypes.func.isRequired,
    }

    render() {
	const { unit, groups, group, pendings } = this.props
	if (unit === 's') {
	    const timer = this.props.start ?
		  Math.floor(this.props.start.getTime() / 1000) :
		  this.props.timer
	    const stopGroup = groups[group].toggle ? group : null
	    return <TimePending {...{...this.props, group, pendings, stopGroup, timer}} />
	}
	else {
	    throw new Error(`Unrecognized unit ${unit}`)
	}
    }
}

export default connect(({firebase: {profile: {groups, pendings}}}) =>
		       ({groups, pendings}))(Pending)
