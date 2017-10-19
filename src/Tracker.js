import React, { Component } from 'react'
import PropTypes from 'prop-types'
import {connect} from 'react-redux'
import {firebaseConnect} from 'react-redux-firebase'
import Pending from './Pending'
import Categories from './Categories'

import Button from 'react-toolbox/lib/button/Button'
import Card from 'react-toolbox/lib/card/Card'
import CardTitle from 'react-toolbox/lib/card/CardTitle'
import CardText from 'react-toolbox/lib/card/CardText'
import CardActions from 'react-toolbox/lib/card/CardActions'
import Input from 'react-toolbox/lib/input/Input'
import FontIcon from 'react-toolbox/lib/font_icon'
import Snackbar from 'react-toolbox/lib/snackbar/Snackbar'

class Tracker extends Component {
    static propTypes = {
	id: PropTypes.number.isRequired,
	title: PropTypes.string.isRequired,
	pendings: PropTypes.array.isRequired,
	categories: PropTypes.array.isRequired,
	notes: PropTypes.string.isRequired,
    }

    newTrackers = {}

    state = {
	active: false,
	title: '',
	notes: '',
    }


    handleChange(field, value) {
	const {firebase, id, editTrackers} = this.props
	if (field === 'expanded') {
	    value = !((id in editTrackers) && editTrackers[id].expanded)
	    firebase.updateProfile({[`editTrackers/${id}/expanded`]: value})
	    return
	}
	this.setState({...this.state, [field]: value})
	if (this.newTrackers[field]) {
	    clearTimeout(this.newTrackers[field])
	}
	this.newTrackers[field] = setTimeout(this.pushTracker.bind(this, field, value), 1000)
    }

    pushTracker(field, value) {
	const {firebase, id} = this.props
	delete this.newTrackers[field]
	firebase.updateProfile({[`editTrackers/${id}/${field}`]: value})
    }

    deleteTracker() {
	this.setState({...this.state, active: true})
    }

    confirmDelete() {
	const {firebase, id} = this.props
	firebase.updateProfile({[`editTrackers/${id}`]: null})
	this.props.onDelete()
    }

    updateCategory(oldName, newName) {
	const {firebase, id, editTrackers} = this.props
	const attrs = {}
	for (const attr of ['categories']) {
	    if (id in editTrackers && editTrackers[id][attr] !== undefined) {
		attrs[attr] = editTrackers[id][attr]
	    }
	    else {
		attrs[attr] = this.props[attr]
	    }
	}

	let value
	if (newName === null) {
	    value = attrs.categories.filter(cat => (cat !== oldName))
	}
	else if (oldName === null) {
	    value = attrs.categories.filter(cat => (cat !== newName))
	    value.push(newName)
	}
	else {
	    value = attrs.categories.map(cat => (cat === oldName ? newName : cat))
	}
	value.sort()
	firebase.updateProfile({[`editTrackers/${id}/categories`]: value})
    }


    componentDidMount() {
	const {id, editTrackers} = this.props
	const state = {...this.state}
	for (const attr of ['title', 'notes']) {
	    if (id in editTrackers && editTrackers[id][attr] !== undefined) {
		state[attr] = editTrackers[id][attr]
	    }
	    else {
		state[attr] = this.props[attr]
	    }
	}
	this.setState(state)
    }

    render() {
	const {id, pendings, editTrackers} = this.props
	const attrs = {...this.state}
	for (const attr of ['categories', 'expanded']) {
	    if (id in editTrackers && editTrackers[id][attr] !== undefined) {
		attrs[attr] = editTrackers[id][attr]
	    }
	    else {
		attrs[attr] = this.props[attr]
	    }
	}

	var Pendings = []

	const Icon = (attrs.expanded ? 'expand_less' : 'expand_more')
	const Title = (attrs.expanded ?
		       <Input label='Tracker Title' value={attrs.title} onChange={this.handleChange.bind(this, 'title')}/> :
		       [])


	const Notes = (attrs.expanded ?
		       <Input label='Notes' value={attrs.notes} multiline onChange={this.handleChange.bind(this, 'notes')} /> :
		       [])

	const CategoriesLabel = (attrs.expanded ? <small style={{color:'#ccc'}}>Categories<br /></small> : [])
	const Actions = (attrs.expanded ?
			 <CardActions>
			 <Button icon='add' label='Commit' onClick={this.props.onCommit} raised primary />
			 <Button icon='delete_forever' label='Delete...' onClick={this.deleteTracker.bind(this)} raised />
			 </CardActions> : [])
       
	for (const pending of pendings) {
	    Pendings.push(<Pending key={pending.id} {...pending} />)
	}
	return (
		<Card>
		<CardTitle title={<span onClick={this.handleChange.bind(this, 'expanded')}><FontIcon>{Icon}</FontIcon>{attrs.title === '' ? <i>Untitled</i> : attrs.title}</span>} />
		<CardText>
		{Title}
		{Pendings}
	    {Notes}
	    {CategoriesLabel}
		<Categories editable={attrs.expanded}
	    onUpdate={this.updateCategory.bind(this)} cats={attrs.categories} />
		</CardText>
		{Actions}
		<Snackbar key='confirm' active={this.state.active} action='Yes, delete' label='Are you sure you wish to permanently delete the tracker?'
	    onClick={this.confirmDelete.bind(this)}
	    type='accept'/>
		</Card>
	)
    }
}

export default firebaseConnect()(connect(({firebase: {profile: {editTrackers}}}) => ({editTrackers: editTrackers || {}}))(Tracker))
