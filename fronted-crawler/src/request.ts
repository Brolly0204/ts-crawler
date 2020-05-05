import axios, { AxiosInstance, AxiosResponse } from 'axios'

const request: AxiosInstance = axios.create({
  baseURL: '/'
})

interface ResponseData {
  data: boolean
  success: boolean
  errMsg?: string
}

request.interceptors.response.use((response: AxiosResponse): AxiosResponse<ResponseData> => {
  return response.data
})

export default request
