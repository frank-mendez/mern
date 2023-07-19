import mongoose, { Schema, model } from 'mongoose'

export interface CommentDocument extends Document {
	text: string
	date: Date
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
})

export const Comment = mongoose.model('Comment', commentSchema)

export default Comment
