import React, { Component } from 'react'
import PropTypes from 'prop-types'
import {connect} from 'react-redux'
import {firebaseConnect} from 'react-redux-firebase'
import Pending from './Pending'

import Chip from 'react-toolbox/lib/chip/Chip'
import Button from 'react-toolbox/lib/button/Button'
import Card from 'react-toolbox/lib/card/Card'
import CardTitle from 'react-toolbox/lib/card/CardTitle'
import CardText from 'react-toolbox/lib/card/CardText'
import CardActions from 'react-toolbox/lib/card/CardActions'
import Input from 'react-toolbox/lib/input/Input'
import FontIcon from 'react-toolbox/lib/font_icon'
import Snackbar from 'react-toolbox/lib/snackbar/Snackbar'
import Autocomplete from 'react-toolbox/lib/autocomplete/Autocomplete'

class Tracker extends Component {
    static propTypes = {
	id: PropTypes.number.isRequired,
	title: PropTypes.string.isRequired,
	pendings: PropTypes.array.isRequired,
	categories: PropTypes.array.isRequired,
	notes: PropTypes.string.isRequired,
    }

    state = {
	active: false,
    }


    handleChange(field, value) {
	const {dispatch, id} = this.props
	if (field === 'expanded') {
	    dispatch({type: 'LOCAL_TRACKER_EXPAND', id})
	    return
	}
	if (this.state[field + '.timer']) {
	    clearTimeout(this.state[field + '.timer'])
	}
	this.setState({
		       [field]: value,
		       [field + '.timer']: setTimeout(this.pushTracker.bind(this, field), 1000)
		      })
    }

    pushTracker(field) {
	const {firebase, id} = this.props
	const value = this.state[field]
	firebase.updateProfile({[`editTrackers/${id}/${field}`]: value})
	this.setState({[field]: null, [field+'.timer']: null})
    }

    deleteTracker() {
	this.setState({active: true})
    }

    confirmDelete() {
	const {firebase, id} = this.props
	firebase.updateProfile({[`editTrackers/${id}`]: null})
	this.props.onDelete()
    }

    updateCategories(value) {
	const {firebase, id, allCategories} = this.props
	const cats = {}
	for (const cat of allCategories) {
	    cats[cat] = true
	}
	for (const cat of value) {
	    cats[cat] = true
	}
	
	firebase.updateProfile({[`editTrackers/${id}/categories`]: value,
				allCategories: Object.keys(cats).sort(),
			       })
    }


    render() {
	const {id, expanded, pendings, editTrackers, allCategories} = this.props
	const attrs = {expanded: !!expanded[id]}
	for (const attr of ['categories', 'title', 'notes']) {
	    if (attr in this.state && this.state[attr] !== null) {
		attrs[attr] = this.state[attr]
	    }
	    else if (id in editTrackers && attr in editTrackers[id]) {
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

	const Categories = (attrs.expanded ?
			    <Autocomplete label="Choose categories"
			    allowCreate={true}
			    onChange={this.updateCategories.bind(this)}
			    value={attrs.categories}
			    source={allCategories}/> :
			    attrs.categories.map((cat) => <Chip key={cat}>{cat}</Chip>))

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
	    {Categories}
	    {Notes}
		</CardText>
		{Actions}
		<Snackbar key='confirm' active={this.state.active} action='Yes, delete' label='Are you sure you wish to permanently delete the tracker?'
	    onClick={this.confirmDelete.bind(this)}
	    type='accept'/>
		</Card>
	)
    }
}

export default firebaseConnect()(connect(
    ({firebase: {profile: {allCategories, editTrackers}}, local: {expanded}}) =>
	({allCategories: allCategories || [],
	  editTrackers: editTrackers || {},
	  expanded})
)(Tracker))
