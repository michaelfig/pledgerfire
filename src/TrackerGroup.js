import React, { Component } from 'react'
import PropTypes from 'prop-types'
import Tracker from './Tracker'
import Categories from './Categories'
import {connect} from 'react-redux'

import Button from 'react-toolbox/lib/button/Button'
import Input from 'react-toolbox/lib/input/Input'


class AddTrackerButton extends Component {
    onClick() {
	return this.props.onClick(this.props.now)
    }

    render() {
	return (<Button icon='alarm_add' label='Add Tracker' accent
	 onClick={this.onClick.bind(this)} />)
    }
}
const ConnectedAdd = connect(({local: {now}}) => ({now}))(AddTrackerButton)

class TrackerGroup extends Component {
    static propTypes = {
	id: PropTypes.number.isRequired,
	title: PropTypes.string.isRequired,
	trackers: PropTypes.array.isRequired,
    }

    state = {
	title: ''
    }

    componentDidMount() {
	this.setState({title: this.props.title})
    }
	
    
    quickChange(value) {
	this.props.onTitle(value)
	this.setState({title: value})
    }

    render() {
	const {trackers, required, onDelete, onRequired, onAddTracker,
	       onDeleteTracker} = this.props
	var Trackers = []

	for (const tracker of trackers) {
	    Trackers.push(<Tracker key={tracker.id} {...tracker} onDelete={(event) => onDeleteTracker(tracker.id, event)} />)
	}
	return (<section>
		<Input label='Group Title' maxLength={20} value={this.state.title} onChange={this.quickChange.bind(this)}/>
		<span>Toggle Categories: <Categories editable={true} onUpdate={onRequired} cats={required} /></span><br />
		<ConnectedAdd onClick={onAddTracker} />
		<Button icon='delete_forever' label='Delete Group...' onClick={onDelete}/>
		{Trackers}
		</section>)
    }
}

export default TrackerGroup
