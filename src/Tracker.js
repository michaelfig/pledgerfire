import React, { Component } from 'react'
import PropTypes from 'prop-types'
import {connect} from 'react-redux'
import {firebaseConnect} from 'react-redux-firebase'
import Pending from './Pending'
import {auditLog} from './utils'

import Chip from 'react-toolbox/lib/chip/Chip'
import Button from 'react-toolbox/lib/button/Button'
import Card from 'react-toolbox/lib/card/Card'
import CardTitle from 'react-toolbox/lib/card/CardTitle'
import CardText from 'react-toolbox/lib/card/CardText'
import CardActions from 'react-toolbox/lib/card/CardActions'
import Input from 'react-toolbox/lib/input/Input'
import FontIcon from 'react-toolbox/lib/font_icon'
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
    isRunning = false


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
	firebase.updateProfile({[`trackers/${id}/${field}`]: value})
	this.setState({[field]: null, [field+'.timer']: null})
    }

    prefixRe = /^([^\/]+)/ // eslint-disable-line
	
    updateCategories(value) {
	const {firebase, auth, id, allCategories, categories} = this.props
	const cats = {}
	for (const cat of allCategories) {
	    cats[cat] = true
	}

	const priorCats = {}
	for (const cat of categories) {
	    priorCats[cat] = true
	}

	const prefix = {}
	const upCats = {}
	const newCats = {}
	for (const cat of value) {
	    if (cat in priorCats) {
		// Remove conflicting categories.
		const match  = cat.match(this.prefixRe)
		const pfx = match ? match[1] : cat
		if (pfx in prefix) {
		    delete upCats[prefix[pfx]]
		}
		prefix[pfx] = cat
		upCats[cat] = true
	    }
	    else {
		newCats[cat] = true
	    }
	}

	// Let the new categories override the old ones.
	for (const cat in newCats) {
	    const match  = cat.match(this.prefixRe)
	    const pfx = match ? match[1] : cat
	    if (pfx in prefix) {
		delete upCats[prefix[pfx]]
	    }
	    prefix[pfx] = cat
	    upCats[cat] = true
	}

	if (this.isRunning) {
	    auditLog(firebase, auth, priorCats, upCats)
	}

	firebase.updateProfile({[`trackers/${id}/categories`]: Object.keys(upCats).sort(),
				allCategories: Object.keys(cats).sort(),
			       })
    }


    onToggle(started) {
	const {firebase, auth, categories} = this.props
	const cats = {}
	for (const cat of categories) {
	    cats[cat] = true
	}
	if (started) {
	    auditLog(firebase, auth, {}, cats)
	}
	else {
	    auditLog(firebase, auth, cats)
	}
    }


    render() {
	const {id, expanded, pendings, allCategories, onDelete} = this.props
	const attrs = {expanded: !!expanded[id]}
	for (const attr of ['categories', 'title', 'notes']) {
	    if (attr in this.state && this.state[attr] !== null) {
		attrs[attr] = this.state[attr]
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
			 <Button icon='delete_forever' label='Delete...' onClick={onDelete} raised />
			 </CardActions> : [])
       
	this.isRunning = false
	for (const pending of pendings) {
	    Pendings.push(<Pending key={pending.id} onToggle={this.onToggle.bind(this)} {...pending} />)
	    if (pending.timer) {
		this.isRunning = true
	    }
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
		</Card>
	)
    }
}

export default firebaseConnect()(connect(
    ({firebase: {profile: {allCategories}, auth}, local: {expanded}}) =>
	({allCategories: allCategories || [],
	  auth,
	  expanded})
)(Tracker))
