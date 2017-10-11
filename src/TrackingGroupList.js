import React, { Component } from 'react'
import PropTypes from 'prop-types'
import {connect} from 'react-redux'

import TrackerGroup from './TrackerGroup'
import Tab from 'react-toolbox/lib/tabs/Tab'
import Tabs from 'react-toolbox/lib/tabs/Tabs'


class TrackingGroupList extends Component {
    static propTypes = {
	groups: PropTypes.array.isRequired
    }

    render() {
	const {groups, visibleGroup, dispatch} = this.props
	var Groups = []
	for (const group of groups) {
	    Groups.push(<Tab key={group.id} label={group.title}><TrackerGroup
			trackers={group.trackers} /></Tab>
		       )
	}

	return (
		<Tabs index={visibleGroup}
	    onChange={(index) => dispatch({type: 'VISIBLE_GROUP_SET', group: index })}>
		{Groups}
		</Tabs>
	)
    }
}

export default connect(({visibleGroup}) => ({visibleGroup}))(TrackingGroupList)
