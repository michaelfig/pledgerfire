import React, { Component } from 'react'
import PropTypes from 'prop-types'
import Tracker from './Tracker'
import Categories from './Categories'

import Button from 'react-toolbox/lib/button/Button'

class TrackerGroup extends Component {
    static propTypes = {
	id: PropTypes.number.isRequired,
	title: PropTypes.string.isRequired,
	trackers: PropTypes.array.isRequired,
    }

    render() {
	const {trackers, required} = this.props
	const Required = (required.length === 0 ?  '' :
			  <span>Required: <Categories
			  cats={required} /></span>)

	var Trackers = []

	for (const tracker of trackers) {
	    Trackers.push(<Tracker key={tracker.id} {...tracker} />)
	}
	return (<section>
		{Required}
		{Trackers}
		<Button icon='alarm_add' floating accent />
		</section>)
    }
}

export default TrackerGroup
