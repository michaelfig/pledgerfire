import React, { Component } from 'react'
import PropTypes from 'prop-types'
import {connect} from 'react-redux'
import Pending from './Pending'
import Categories from './Categories'

import Button from 'react-toolbox/lib/button/Button'
import Card from 'react-toolbox/lib/card/Card'
import CardTitle from 'react-toolbox/lib/card/CardTitle'
import CardText from 'react-toolbox/lib/card/CardText'
import CardActions from 'react-toolbox/lib/card/CardActions'
import Input from 'react-toolbox/lib/input/Input'
import FontIcon from 'react-toolbox/lib/font_icon'

class Tracker extends Component {
    static propTypes = {
	id: PropTypes.number.isRequired,
	title: PropTypes.string.isRequired,
	pendings: PropTypes.array.isRequired,
	categories: PropTypes.array.isRequired,
	notes: PropTypes.string.isRequired,
    }

    handleChange(field, value) {
	const {dispatch, id, localTrackers} = this.props
	if (field === 'expanded') {
	    value = !((id in localTrackers) && localTrackers[id].expanded)
	}
	dispatch({type: 'LOCAL_TRACKER_SET', id, field, value})
    }

    updateCategory(oldName, newName) {
	const {dispatch, id, localTrackers} = this.props
	const attrs = {}
	for (const attr of ['categories']) {
	    if (id in localTrackers && localTrackers[id][attr] !== undefined) {
		attrs[attr] = localTrackers[id][attr]
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
	dispatch({type: 'LOCAL_TRACKER_SET', id, field:'categories', value})
    }

    render() {
	const {id, pendings, localTrackers} = this.props
	const attrs = {}
	for (const attr of ['expanded', 'title', 'notes', 'categories']) {
	    if (id in localTrackers && localTrackers[id][attr] !== undefined) {
		attrs[attr] = localTrackers[id][attr]
	    }
	    else {
		attrs[attr] = this.props[attr]
	    }
	}

	var Pendings = []

	const Icon = (attrs.expanded ? 'expand_less' : 'expand_more')
	const Title = (attrs.expanded ?
		       <Input label='Title' value={attrs.title} onChange={this.handleChange.bind(this, 'title')}/> :
		       [])


	const Notes = (attrs.expanded ?
		       <Input label='Notes' value={attrs.notes} multiline onChange={this.handleChange.bind(this, 'notes')} /> :
		       [])

	const CategoriesLabel = (attrs.expanded ? <small style={{color:'#ccc'}}>Categories<br /></small> : [])
	const Actions = (attrs.expanded ?
			 <CardActions>
			 <Button icon='add' label='Commit' raised primary />
			 <Button icon='delete_forever' label='Delete...' raised />
			 </CardActions> : [])
       
	for (const pending of pendings) {
	    Pendings.push(<Pending key={pending.id} {...pending} />)
	}
	return (
		<Card>
		<CardTitle title={<span><FontIcon onClick={this.handleChange.bind(this, 'expanded')}>{Icon}</FontIcon>{attrs.title === '' ? <i>Untitled</i> : attrs.title}</span>} />
		<CardText>
		{Title}
		{Pendings}
	    {Notes}
	    {CategoriesLabel}
		<Categories editable={attrs.expanded}
	    onUpdate={this.updateCategory.bind(this)} cats={attrs.categories} />
		</CardText>
		{Actions}
		</Card>
	)
    }
}

export default connect(({local:{trackers}}) => ({localTrackers: trackers}))(Tracker)
