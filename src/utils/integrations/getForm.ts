const axios = require('axios')

module.exports = {
	submitFormData
}

async function submitFormData(data) {
	return axios.post(process.env.REGISTRATION_GETFORM_URL, data)
}