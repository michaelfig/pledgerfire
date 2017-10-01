import React, { Component } from 'react'
import './Category.css'
import PropTypes from 'prop-types'


class Categories extends Component {
    static propTypes = {
	cats: PropTypes.array.isRequired
    }

    render() {
	const {cats} = this.props
	var Cats = []
	
	for (const cat of cats) {
	    Cats.push(<span className='Category' key={cat.id}>{cat.name}</span>)
	    Cats.push(' ')
	}
	return Cats
    }
}

export default Categories
