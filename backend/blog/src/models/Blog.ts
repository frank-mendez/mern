import mongoose, { Document, Schema, Types, model } from 'mongoose'
import { UserDocument } from './User'
import { CommentDocument } from './Comment'

export interface BlogDocument extends Document {
	title: string
	content: string
	date: Date
	user: UserDocument
	comments: Types.DocumentArray<CommentDocument>
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
	user: {
		type: Schema.Types.ObjectId,
		ref: 'User',
	},
	comments: [{ type: Schema.Types.ObjectId, ref: 'Comment' }],
})

export const Blog = mongoose.model('Blog', blogSchema)

export default Blog
