export const auditLog = (firebase, auth, prior, next) => {
    // Find the differences.
    const stopped = {}
    const started = {}
    const remain = {}
    
    for (const cat in prior) {
	if (next && next[cat]) {
	    remain[cat] = true
	}
	else {
	    stopped[cat] = true
	}
    }
    if (next) {
	for (const cat in next) {
	    if (!remain[cat]) {
		started[cat] = true
	    }
	}
    }

    // Write the log records.
    const uid = auth.uid
    const auditRef = firebase.database().ref(`audit/${uid}`)
    const log = (data) => {
	for (const cat in stopped) {
	    const stopRec = {...data, cat, state: next ? 0 : -1}
	    //console.log(stopRec)
	    auditRef.push(stopRec)
	}
	for (const cat in started) {
	    const startRec = {...data, cat, state: 1}
	    //console.log(startRec)
	    auditRef.push(startRec)
	}
    }
    
    const data = {
	stamp: firebase.database.ServerValue.TIMESTAMP,
	user: uid,
    }
    if (typeof navigator !== 'undefined' && navigator.geolocation) {
	navigator.geolocation.getCurrentPosition((pos) => {
	    const crd = pos.coords
	    data.lat = crd.latitude
	    data.lon = crd.longitude
	    data.acc = crd.accuracy
	    log(data)
	}, (err) => {
	    console.warn(`GPS ERROR(${err.code}): ${err.message}`)
	    log(data)
	})
    }
    else {
	log(data)
    }
}


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
