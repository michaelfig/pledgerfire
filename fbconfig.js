const fbcli = require('firebase-tools')
const fs = require('fs')

fbcli.setup.web().then(config => {
    fs.writeFileSync(
	'src/firebase.json',
	JSON.stringify(config)
    )
})
