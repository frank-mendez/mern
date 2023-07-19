import mongoose, { Document, Schema, model } from 'mongoose'

export interface BlogDocument extends Document {
	title: string
	content: string
	date: Date
}

const blogSchema: Schema = new Schema<BlogDocument>({
	title: {
		type: String,
		required: true,
	},
	content: {
		type: String,
		required: true,
	},
	date: {
		type: Date,
		required: true,
	},
})

export const Blog = mongoose.model('Blog', blogSchema)

export default Blog
