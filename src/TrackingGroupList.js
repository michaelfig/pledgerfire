import React, { Component } from 'react'
import PropTypes from 'prop-types'
import './TrackingGroupList.css'
import TrackerGroup from './TrackerGroup'


class TrackingGroupList extends Component {
    static propTypes = {
	groups: PropTypes.array.isRequired
    }

    render() {
	const {groups} = this.props
	var Groups = []
	for (const group of groups) {
	    Groups.push(<TrackerGroup key={group.id} id={group.id}
			title={group.title} trackers={group.trackers} />)
	}

	return (
		<dl className="TrackingGroupList">
		{Groups}
		</dl>
	)
    }
}

export default TrackingGroupList
