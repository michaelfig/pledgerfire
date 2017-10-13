import React, { Component } from 'react'
import PropTypes from 'prop-types'
import {connect} from 'react-redux'

import TrackerGroup from './TrackerGroup'
import Tab from 'react-toolbox/lib/tabs/Tab'
import Tabs from 'react-toolbox/lib/tabs/Tabs'


class TrackingGroupList extends Component {
    static propTypes = {
	groups: PropTypes.object.isRequired
    }

    render() {
	const {groups, visibleGroup, dispatch,
	       trackers, pendings} = this.props
	var Groups = []
	for (const id in groups) {
	    if (id === 'last')
		continue;
	    const group = {...groups[id],
			   trackers: groups[id].trackers.map(
			       id =>
				   ({...trackers[id],
				     pendings: trackers[id].pendings.map(
					 id => pendings[id]),
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

export default connect(({local: {group}, trackers, pendings}) =>
		       ({visibleGroup:group,trackers,pendings}))(TrackingGroupList)
