import axios from 'axios';
import { CreateUserType, LoginUserType } from '@/types/user';

const url = process.env.NEXT_PUBLIC_BASE_URL_API;

// Helper function to safely extract error message for logging
function getErrorLogMessage(error: unknown): string {
    if (error && typeof error === 'object') {
        // Check for axios error response
        if ('response' in error && error.response && typeof error.response === 'object' && 'data' in error.response) {
            return String(error.response.data);
        }
        // Check for error message
        if ('message' in error && typeof error.message === 'string') {
            return error.message;
        }
    }
    return 'Error desconocido';
}

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
        console.error("Error en createUser:", getErrorLogMessage(error));
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
        console.error("Error en loginUser:", getErrorLogMessage(error));
        throw error;
    }
};

