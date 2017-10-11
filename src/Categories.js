import React, { Component } from 'react'
import PropTypes from 'prop-types'

import Chip from 'react-toolbox/lib/chip/Chip'


class Categories extends Component {
    static propTypes = {
	cats: PropTypes.array.isRequired,
	onClick: PropTypes.func.isRequired,
	onDeleteClick: PropTypes.func.isRequired,
    }


    render() {
	const {cats, onDeleteClick, onClick} = this.props
	var Cats = []
	
	for (const cat of cats) {
	    let i = Cats.length
	    Cats.push(<Chip key={cat.id} deletable
		      onDeleteClick={() => onDeleteClick(i)}
		      onClick={() => onClick(i)}>
		      {cat.name}
		      </Chip>)
	}
	return Cats
    }
}

export default Categories
