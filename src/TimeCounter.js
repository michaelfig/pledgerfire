import { Component } from 'react'
import PropTypes from 'prop-types'

class TimeCounter extends Component {
    static propTypes = {
	pending: PropTypes.number.isRequired,
    }

    getElapsed(sofar) {
	const s = Math.abs(sofar)
	const m = Math.floor(s / 60)
	const h = Math.floor(m / 60)
	const neg = sofar < 0 ? '-' : '';
	const ss = ('0' + s%60).slice(-2)
	const mm = ('0' + m%60).slice(-2)
	return `${neg}${h}:${mm}:${ss}`
    }
    
    render() {
	const {pending} = this.props
	return this.getElapsed(pending)
    }
}

export default TimeCounter
