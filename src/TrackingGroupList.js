import React, { Component } from 'react'
import PropTypes from 'prop-types'
import {connect} from 'react-redux'
import {firebaseConnect} from 'react-redux-firebase'

import TrackerGroup from './TrackerGroup'
import Tab from 'react-toolbox/lib/tabs/Tab'
import Tabs from 'react-toolbox/lib/tabs/Tabs'
import Snackbar from 'react-toolbox/lib/snackbar/Snackbar'

class TrackingGroupList extends Component {
    static propTypes = {
	auth: PropTypes.object.isRequired
    }

    addGroup(event) {
	const {firebase, groups} = this.props
	event.preventDefault()
	const id = groups.last + 1
	firebase.updateProfile({
	    [`groups/${id}`]: {
		id,
		title:`Group ${id}`,
		toggle:true,
	    },
	    'groups/last': id,
	})
    }

    deleteId = null
    state = {
	active: false,
    }

    deleteGroup(id) {
	this.deleteId = id
	this.setState({active: true})
    }

    confirmDelete() {
	const {firebase, groups, trackers} = this.props
	const id = this.deleteId
	const updates = {}
	for (const tid of groups[id].trackers || []) {
	    updates[`trackers/${tid}`] = null
	    for (const pid of trackers[tid].pendings || []) {
		updates[`pendings/${pid}`] = null
	    }
	}
	updates[`groups/${id}`] = null
	firebase.updateProfile(updates)
	this.setState({active: false})
    }

    newTitles = {}
    updateTitle(id, title) {
	if (this.newTitles[id]) {
	    clearTimeout(this.newTitles[id].timeout)
	}
	this.newTitles[id] = {timeout: setTimeout(this.pushTitle.bind(this, id), 1000),
			      title}
    }

    pushTitle(id) {
	const {firebase} = this.props
	const {title} = this.newTitles[id]
	delete this.newTitles[id]
	firebase.updateProfile({[`groups/${id}/title`]: title})
    }


    addTracker(id, now) {
	const {firebase, groups, pendings, trackers} = this.props
	const pid = pendings.last + 1

	let update = {}
	update['pendings/last'] = pid
	update[`pendings/${pid}`] = {id:pid, unit:'s', pending:0,
				     start: null,
				     timer: null,
				     base: 0, goal: 0,
				     group: id}

	const tid = trackers.last + 1
	const gtrackers = [...(groups[id].trackers || []), tid]
	firebase.updateProfile({
		...update,
	    [`groups/${id}/trackers`]: gtrackers,
	    [`trackers/${tid}`]: {id:tid, title: '', notes: '',
				  pendings: [pid]},
	    'trackers/last': tid,
	})
    }

    deleteTracker(gid) {
	const {firebase, groups, trackers, trackerDelete} = this.props
	const tid = trackerDelete
	const gtrackers = (groups[gid].trackers || []).filter((tid2) => tid2 !== tid)
	const update = {}
	for (const pid of trackers[tid].pendings || []) {
	    update[`pendings/${pid}`] = null
	}
	firebase.updateProfile({
		...update,
	    [`groups/${gid}/trackers`]: gtrackers,
	    [`trackers/${tid}`]: null,
	})
	this.props.dispatch({type: 'LOCAL_TRACKER_DELETE', id: null})
    }

    confirmReset() {
	const {firebase, pendingReset} = this.props
	const id = pendingReset
	firebase.updateProfile({[`pendings/${id}/start`]: null,
				[`pendings/${id}/timer`]: null,
				[`pendings/${id}/pending`]: 0,
				[`pendings/${id}/base`]: 0,
			       })
	this.props.dispatch({type: 'LOCAL_PENDING_RESET', id: null})
    }

    render() {
	const {groups, visibleGroup, dispatch,
	       trackers, pendings} = this.props
	const Groups = []
	for (const id in groups) {
	    if (id === 'last')
		continue
	    const group = {...groups[id],
			   trackers: (groups[id].trackers||[]).map(
			       id =>
				   ({...trackers[id],
				     categories: (trackers[id].categories||[]),
				     pendings: (trackers[id].pendings||[]).map(
					 id => pendings[id]),
				    })),
			  }
	    Groups.push(<Tab key={id} label={group.title}>
			<TrackerGroup {...group}
			onDelete={this.deleteGroup.bind(this, id)}
			onTitle={this.updateTitle.bind(this, id)}
			onAddTracker={this.addTracker.bind(this, id)}
			onDeleteTracker={() => this.props.dispatch({type: 'LOCAL_TRACKER_DELETE', id})} /></Tab>
		       )
	}

	return [
		<Tabs key='tabs' index={visibleGroup}
	    onChange={(index) => dispatch({type: 'VISIBLE_GROUP_SET', group: index })}>
		{Groups}
	        <Tab key='add' icon='add_circle_outline' onClick={this.addGroup.bind(this)}>
		Add a tracker group, or sign in to your account...
		</Tab>
		</Tabs>,
		<Snackbar key='confirm' active={this.state.active} timeout={5000}
	         onTimeout={() => this.setState({active: false})}
	         action='Yes, delete' label='Are you sure you wish to permanently delete the tracker group?'
	         onClick={this.confirmDelete.bind(this)}
	    type='accept'/>,
		<Snackbar key='confirm_tracker' active={this.props.trackerDelete ? true : false} timeout={5000}
	         onTimeout={() => this.props.dispatch({type: 'LOCAL_TRACKER_DELETE', id: null})}
	         action='Yes, delete' label='Are you sure you wish to permanently delete the tracker?'
	         onClick={this.deleteTracker.bind(this)}
	    type='accept'/>,
		<Snackbar key='confirm_reset' active={this.props.pendingReset ? true : false} timeout={5000}
	    onTimeout={() => this.props.dispatch({type: 'LOCAL_PENDING_RESET', id: null})}
	         action='Yes, reset' label='Are you sure you wish to reset the timer?'
	         onClick={this.confirmReset.bind(this)}
	         type='accept'/>
	]
    }
}

export default firebaseConnect()(connect(
    ({firebase: {profile}, local: {group, pendingReset, trackerDelete}}) =>
	({visibleGroup:group,
	  groups: profile.groups || {last:0},
	  trackers: profile.trackers || {last:0},
	  pendings: profile.pendings || {last:0},
	  pendingReset,
	  trackerDelete,
	 })
)(TrackingGroupList))
