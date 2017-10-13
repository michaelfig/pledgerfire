import React, { Component } from 'react'
import PropTypes from 'prop-types'

import Chip from 'react-toolbox/lib/chip/Chip'
import FontIcon from 'react-toolbox/lib/font_icon'


class Categories extends Component {
    static propTypes = {
	cats: PropTypes.array.isRequired,
	editable: PropTypes.bool,
    }

    handleDelete(cat) {
	this.props.onUpdate(cat, null)
    }

    handleEdit(cat) {
	alert(`FIXME: raise a category ${cat} edit dialog`)
	const name = 'edited'
	this.props.onUpdate(cat, name)
    }

    handleAdd() {
	const name = 'new'
	alert('FIXME: raise a category input dialog')
	this.props.onUpdate(null, name)
    }
    
    render() {
	const {cats, editable} = this.props
	var Cats = editable ? [<FontIcon key={-1} onClick={this.handleAdd.bind(this)}>add_circle_outline</FontIcon>] : []
	
	for (const cat of cats) {
	    Cats.push(<Chip key={cat} deletable={editable}
		      onDeleteClick={editable ? this.handleDelete.bind(this, cat) : null}>
		      <span onClick={editable ? this.handleEdit.bind(this, cat) : null}>{cat}</span>
		      </Chip>)
	}
	return Cats
    }
}

export default Categories
