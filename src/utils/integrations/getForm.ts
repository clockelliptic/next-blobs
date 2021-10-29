import axios from 'axios';

export async function submitFormData(data) {
	return axios.post(process.env.REGISTRATION_GETFORM_URL, data)
}