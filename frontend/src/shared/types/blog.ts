export type CreatePostType = {
    title: string
    description: string
    image: string | undefined
    resume: string
    tags: string[]
    category: string
    slug: string
    status: 'draft' | 'published'
    meta_title?: string
    meta_description?: string
    focus_keyword?: string
    robots?: string
}
