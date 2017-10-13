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
    state = {
	notes: '',
	title: '',
	expanded: false
    }
    
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
	    value = !localTrackers[id].expanded
	}
	dispatch({type: 'LOCAL_TRACKER_SET', id, field, value})
    }

    render() {
	const {id, pendings, title, notes, categories, localTrackers} = this.props
	const expanded = localTrackers[id].expanded
	var Pendings = []

	const Icon = (expanded ? 'expand_less' : 'expand_more')
	const Title = (expanded ?
		       <Input label='Title' value={title} onChange={this.handleChange.bind(this, 'title')}/> :
		       [])


	const Notes = (expanded ?
		       <Input label='Notes' value={notes} multiline onChange={this.handleChange.bind(this, 'notes')} /> :
		       [])
	const Actions = (expanded ?
			 <CardActions>
			 <Button icon='add' label='Commit' raised primary />
			 <Button icon='delete_forever' label='Delete...' raised />
			 </CardActions> : [])
       

	for (const pending of pendings) {
	    Pendings.push(<Pending key={pending.id} {...pending} />)
	}
	return (
		<Card>
		<CardTitle title={<span><FontIcon onClick={this.handleChange.bind(this, 'expanded')}>{Icon}</FontIcon>{title}</span>} />
		<CardText>
		{Title}
		{Pendings}
	    {Notes}
		<Categories editable={expanded} cats={categories} />
		</CardText>
		{Actions}
		</Card>
	)
    }
}

export default connect(({local:{trackers}}) => ({localTrackers: trackers}))(Tracker)
