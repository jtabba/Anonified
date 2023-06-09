import axios, { RawAxiosRequestHeaders, Method } from "axios";

const API_URL: string = process.env.API_URL!;
axios.defaults.baseURL = API_URL;

interface requestOptions {
	method?: Method;
	body?: string;
	headers?: RawAxiosRequestHeaders;
}

export const useAxios = () => {
	async function fetchData<T>(
		endpoint: string,
		options: requestOptions
	): Promise<T> {
		return axios({
			method: options.method ?? "POST",
			data: options.body,
			url: endpoint,
			headers: {
				...options.headers
			},
			timeout: 0
		});
	}

	return {
		fetchData
	};
};
