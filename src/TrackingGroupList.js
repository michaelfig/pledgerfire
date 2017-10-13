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
	const {groups, visibleGroup, dispatch,
	       trackers, categories, pendings} = this.props
	var Groups = []
	for (const id in groups) {
	    const group = {...groups[id],
			   required: groups[id].required.map(id => categories[id]),
			   trackers: groups[id].trackers.map(
			       id =>
				   ({...trackers[id],
				     pendings: trackers[id].pendings.map(
					 id => pendings[id]),
				     categories: trackers[id].categories.map(
					 id => categories[id]),
				    }))
			  }
	    Groups.push(<Tab key={id} label={group.title}>
			<TrackerGroup {...group} /></Tab>
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

export default connect(({local: {group}, trackers, categories, pendings}) =>
		       ({visibleGroup:group,trackers,categories,pendings}))(TrackingGroupList)
