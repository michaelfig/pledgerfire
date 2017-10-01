import React, { Component } from 'react'
import PropTypes from 'prop-types'
import Pending from './Pending'
import Categories from './Categories'


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
		<div id={id}>
		{Pendings} {title}<br />
		<Categories cats={categories} />
	        </div>
	)
    }
}

export default Tracker
