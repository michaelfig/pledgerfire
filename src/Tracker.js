import React, { Component } from 'react'
import PropTypes from 'prop-types'
import Pending from './Pending'
import Categories from './Categories'

import Card from 'react-toolbox/lib/card/Card'
import CardTitle from 'react-toolbox/lib/card/CardTitle'
import CardText from 'react-toolbox/lib/card/CardText'

class Tracker extends Component {
    static propTypes = {
	id: PropTypes.number.isRequired,
	title: PropTypes.string.isRequired,
	pendings: PropTypes.array.isRequired,
	categories: PropTypes.array.isRequired
    }

    render() {
	const {id, title, pendings, categories} = this.props
	var Pendings = []
	
	for (const pending of pendings) {
	    Pendings.push(<Pending key={pending.id} {...pending} />)
	}
	return (
		<Card>
		<CardTitle title={title}/>
		<CardText>{Pendings}<br />
		<Categories cats={categories} /></CardText>
		</Card>
	)
    }
}

export default Tracker
