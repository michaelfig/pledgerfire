import React, { Component } from 'react'
import {connect} from 'react-redux'
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

    addTracker() {
	const {dispatch, id, gpendings, gtrackers, required, now} = this.props
	dispatch({type: 'TIME_PENDING_ADD', timer: now, group: id})
	dispatch({type: 'TRACKER_ADD', pendings: [gpendings.last + 1],
		  categories: required})
	dispatch({type: 'GROUP_TRACKER_ADD', id, tracker: gtrackers.last + 1})
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
		<Button style={{position: 'fixed', bottom: '10px', left: '90%'}}
		icon='alarm_add' floating accent mini
		onClick={this.addTracker.bind(this)} />
		</section>)
    }
}

export default connect(({pendings, trackers, local: {now}}) =>
		       ({gpendings: pendings,
			 gtrackers: trackers, now}))(TrackerGroup)
