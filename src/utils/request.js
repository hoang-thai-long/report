import axios from 'axios';
import Configs from './config';

const instance = axios.create({
    baseURL: Configs.BaseUrl
});

instance.interceptors.request.use((config)=>config,(error)=> Promise.reject(error))

instance.interceptors.response.use((res)=> res,(err)=> Promise.reject(err));

export default instance;
