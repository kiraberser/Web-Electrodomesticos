export type CreatePostType = {
    title: string
    description: string
    image: string | undefined
    resume: string
    autor: number
    tags: FormDataEntryValue | null
    category: string
    slug: string
}