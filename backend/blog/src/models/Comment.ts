import mongoose, { Schema, model } from 'mongoose'
import { BlogDocument } from './Blog'
import { UserDocument } from './User'

export interface CommentDocument extends Document {
	text: string
	date: Date
	blog: BlogDocument
	user: UserDocument
}

const commentSchema: Schema = new Schema<CommentDocument>({
	text: {
		type: String,
		required: true,
	},
	date: {
		type: Date,
		required: true,
	},
	blog: { type: Schema.Types.ObjectId, ref: 'Blog' },
	user: { type: Schema.Types.ObjectId, ref: 'User' },
})

export const Comment = mongoose.model('Comment', commentSchema)

export default Comment
