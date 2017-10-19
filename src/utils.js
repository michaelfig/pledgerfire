export const stopPendingGroup = (state, group, now) => {
    let updates = {}
    for (const id in state) {
	if (id === 'last')
	    continue
	else if (state[id].group === group && state[id].timer)
	    updates[`pendings/${id}`] = {...state[id],
					 timer: null,
					 pending: state[id].pending + now - state[id].timer,
					 start: null}
    }
    return updates
}
