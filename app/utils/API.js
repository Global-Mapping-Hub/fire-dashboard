import axios from 'axios';

const api = axios.create({
	baseURL: 'https://maps.greenpeace.org/api/fdb',
})

export default api;