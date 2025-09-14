'use server'

import { cookies } from "next/headers"
import { loginUser, createUser } from "@/api/user"
import { redirect } from "next/navigation"

import { LoginUserType, CreateUserType } from "@/types/user"

export const actionLoginUser = async (formData: LoginUserType) => {
    const response = await loginUser(formData)
    console.log(response)
    const cookieStore = await cookies()
    
    cookieStore.set({
        name: 'username',
        value: response['usuario'],
        path: '/',
        maxAge: 60 * 60 * 24 * 7,
        secure: true,
        sameSite: 'lax'
    })
    cookieStore.set({
        name: 'access_cookie',
        value: response['access'],
        httpOnly: true,
        path: '/',
        secure: true,
        sameSite: 'lax',
        maxAge: 60 * 15
    })
    cookieStore.set({
        name: 'refresh_cookie',
        value: response['refresh'],
        httpOnly: true,
        path: '/',
        secure: true,
        sameSite: 'lax',
        maxAge: 60 * 60 * 24 * 7
    })

    return { success: true }
}

export const actionCreateUser = async (formData: CreateUserType) => {
    await createUser(formData)
    return { success: true }
}

export const actionLogOutUser = async () => {
    const cookieStore = await cookies()
    cookieStore.delete('access_cookie')
    cookieStore.delete('refresh_cookie')
    cookieStore.delete('username')
    redirect('/')
}