import React, { Component } from 'react'
import PropTypes from 'prop-types'
import Tracker from './Tracker'

class TrackerGroup extends Component {
    static propTypes = {
	id: PropTypes.number.isRequired,
	title: PropTypes.string.isRequired,
	trackers: PropTypes.array.isRequired,
    }

    render() {
	const {id, title, trackers} = this.props
	var Trackers = []
	
	for (const tracker of trackers) {
	    Trackers.push(<Tracker key={tracker.id} {...tracker} />)
	}
	return Trackers
    }
}

export default TrackerGroup
