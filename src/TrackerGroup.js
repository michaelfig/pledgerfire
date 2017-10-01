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
	    Trackers.push(<dd key={tracker.id}>
			  <Tracker {...tracker} />
			  </dd>)
	}
	return [
		<dt key="top" id={id}>{title}</dt>,
		...Trackers
	]
    }
}

export default TrackerGroup
