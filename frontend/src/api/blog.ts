import axios from 'axios'
import { cookies } from 'next/headers'
const URL = process.env.NEXT_PUBLIC_BASE_URL_API


export const postBlog = async (newPost) => {
    const cookieStore = await cookies()
    const token = cookieStore.get('access_cookie')?.value
    console.log(token)
    try {
        await axios.post(`${URL}/blog/posts/`, newPost, {
            headers: {
                'Content-Type': 'multipart/form-data',
                'Authorization': `Bearer ${token}`
            }
        })
    } catch (error) {
        return new Error('Error al crear el post')
    }
}

export default postBlog