import PropTypes from 'prop-types'
import TimeCounter from './TimeCounter'


class TimeGoal extends TimeCounter {
    static propTypes = {
	pending: PropTypes.number.isRequired,
	base: PropTypes.number.isRequired,
	goal: PropTypes.number.isRequired,
    }

    render() {
	const {pending, base, goal} = this.props
	const elapsed = goal - (base + pending)
	return `[${this.getElapsed(elapsed)}]`
    }
}

export default TimeGoal
