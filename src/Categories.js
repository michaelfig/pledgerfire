import React, { Component } from 'react'
import PropTypes from 'prop-types'

import Chip from 'react-toolbox/lib/chip/Chip'
import FontIcon from 'react-toolbox/lib/font_icon'
import Dialog from 'react-toolbox/lib/dialog/Dialog'
import Input from 'react-toolbox/lib/input/Input'


class Categories extends Component {
    static propTypes = {
	cats: PropTypes.array.isRequired,
	editable: PropTypes.bool,
    }

    state = {
	active: false,
	category: null,
	newCategory: null,
    }

    handleDelete(cat) {
	this.props.onUpdate(cat, null)
    }

    handleEdit(cat) {
	this.setState({active: true, category: cat, newCategory: cat})
    }

    handleAdd() {
	this.setState({active: true, category: null, newCategory: ''})
    }

    updateCat(oldName, newName) {
	if (newName !== null) {
	    this.props.onUpdate(oldName, newName)
	}
	this.setState({active: false})
    }
    
    render() {
	const {cats, editable} = this.props
	const {active, category, newCategory} = this.state
	var Cats = editable ? [<FontIcon key={-1} onClick={this.handleAdd.bind(this)}>add_circle_outline</FontIcon>] : []
	
	for (const cat of cats) {
	    Cats.push(<Chip key={cat} deletable={editable}
		      onDeleteClick={editable ? this.handleDelete.bind(this, cat) : null}>
		      <span onClick={editable ? this.handleEdit.bind(this, cat) : null}>{cat}</span>
		      </Chip>)
	}
	Cats.push(<Dialog key='d' type='small' active={active}
		  actions={[{label: 'OK', primary: true, onClick: () => this.updateCat(category, newCategory)},
			    {label: 'Cancel', onClick: () => this.updateCat(category, null)}
			   ]}
		  title={category === null ? 'New category' : 'Edit category name'}
		  onOverlayClick={this.updateCat.bind(this, category, null)}
		  onEscKeyDown={this.updateCat.bind(this, category, null)}>
		  <Input title='Category Name' value={newCategory}
		  onKeyPress={(event) => event.charCode === 13 && this.updateCat(category, newCategory)}
		  onChange={(value) => this.setState({newCategory: value})} />
		  </Dialog>)
	return Cats
    }
}

export default Categories
