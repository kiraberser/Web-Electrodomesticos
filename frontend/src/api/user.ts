import axios from 'axios';
import { CreateUserType, LoginUserType, UpdateUserProfileInput } from '@/types/user';
import { cookies } from 'next/headers';

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

export const getUser = async () => {
    try {
        const cookieStore = await cookies()
        const token = cookieStore.get('access_cookie')?.value
        const response = await axios.get(`${url}/user/user-profile/`, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        });
        return response.data.usuario;
    } catch (error: unknown) {
        console.error("Error en getUser:", getErrorLogMessage(error));
        throw error;
    }
};

export const updateUserProfile = async (data: UpdateUserProfileInput) => {
    try {
        const cookieStore = await cookies()
        const token = cookieStore.get('access_cookie')?.value
        
        // Si hay un archivo avatar, usar FormData, sino JSON normal
        const isFormData = data.avatar instanceof File;
        const formData = isFormData ? new FormData() : null;
        
        if (isFormData && formData) {
            Object.keys(data).forEach(key => {
                const value = data[key as keyof UpdateUserProfileInput];
                if (value !== undefined && value !== null) {
                    if (key === 'avatar' && value instanceof File) {
                        formData.append('avatar', value);
                    } else {
                        formData.append(key, String(value));
                    }
                }
            });
        }
        
        const response = await axios.patch(
            `${url}/user/user-profile/update/`,
            isFormData ? formData : data,
            {
                headers: {
                    'Content-Type': isFormData ? 'multipart/form-data' : 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            }
        );
        return response.data;
    } catch (error: unknown) {
        console.error("Error en updateUserProfile:", getErrorLogMessage(error));
        throw error;
    }
};
