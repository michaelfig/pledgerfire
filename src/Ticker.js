import { Component, Children } from 'react'
import { connect } from 'react-redux'
import { firebaseConnect } from 'react-redux-firebase'
import PropTypes from 'prop-types'

const GLOBAL_TICKER_INTERVAL_MS = 200

var globalRefs = 0
var globalNow = null
var globalTicker = null
var globalOffset = 0

class Ticker extends Component {
    static propTypes = {
	children: PropTypes.element.isRequired,
	dispatch: PropTypes.func.isRequired,
	firebase: PropTypes.object.isRequired,
    }

    tick() {
	const now = Math.floor((new Date().getTime() + globalOffset) / 1000)
	if (now !== globalNow) {
	    globalNow = now
	    this.props.dispatch({type: 'TICKER_SET_NOW', now})
	}
    }

    componentWillUnmount() {
	if (-- globalRefs === 0)
	    clearInterval(globalTicker)
    }

    componentDidMount() {
	if (globalRefs ++ === 0) {
	    const offsetRef = this.props.firebase.ref('.info/serverTimeOffset')
	    offsetRef.on('value', (snap) => {
		globalOffset = snap.val()
		//console.log('set globalOffset to ', globalOffset)
	    })
	    this.tick()
	    globalTicker = setInterval(this.tick.bind(this),
				       GLOBAL_TICKER_INTERVAL_MS)
	}
    }

    render() {
	return Children.only(this.props.children)
    }
}

const ConnectedTicker = firebaseConnect()(connect()(Ticker))
export default ConnectedTicker
