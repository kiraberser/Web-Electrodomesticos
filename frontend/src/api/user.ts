import axios from 'axios';
import { CreateUserType, LoginUserType } from '@/types/user';

const url = process.env.NEXT_PUBLIC_BASE_URL_API;

export const createUser = async (data: CreateUserType) => {
    try {
        const response = await axios.post(`${url}/user/registro/`, {
            username: data.name,
            phone: data.phone,
            email: data.email,
            password: data.password,
        });
        return response.data;
    } catch (error: unknown) {
        console.error("Error en createUser:", error.response?.data || error.message);
        throw error;
    }
};

export const loginUser = async (data: LoginUserType) => {
    try {
        const response = await axios.post(`${url}/user/login/`, {
            email: data.email,
            password: data.password,
        });
        return response.data;
    } catch (error: unknown) {
        console.error("Error en loginUser:", error.response?.data || error.message);
        throw error;
    }
};

