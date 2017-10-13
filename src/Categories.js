import React, { Component } from 'react'
import PropTypes from 'prop-types'

import Chip from 'react-toolbox/lib/chip/Chip'
import FontIcon from 'react-toolbox/lib/font_icon'


class Categories extends Component {
    static propTypes = {
	cats: PropTypes.array.isRequired,
	onClick: PropTypes.func.isRequired,
	onDeleteClick: PropTypes.func.isRequired,
	editable: PropTypes.bool,
    }


    render() {
	const {cats, onDeleteClick, onClick, editable} = this.props
	var Cats = editable ? [<FontIcon key={-1}>add_circle_outline</FontIcon>] : []
	
	for (const i in cats) {
	    const cat = cats[i]
	    Cats.push(<Chip key={cat.id} deletable={editable}
		      onDeleteClick={() => onDeleteClick(i)}
		      onClick={() => onClick(i)}>
		      {cat.name}
		      </Chip>)
	}
	return Cats
    }
}

export default Categories
