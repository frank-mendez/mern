import mongoose, { Document, Schema, model } from 'mongoose'
import { BlogDocument } from './Blog'
import { CommentDocument } from './Comment'

export interface UserDocument extends Document {
	name: string
	email: string
	password: string
	blogs: BlogDocument[]
	comments: CommentDocument[]
}

const userSchema: Schema = new Schema<UserDocument>({
	name: {
		type: String,
		required: true,
	},
	email: {
		type: String,
		required: true,
		unique: true,
	},
	password: {
		type: String,
		required: true,
		minLength: 8,
	},
	blogs: [{ type: Schema.Types.ObjectId, ref: 'Blog' }],
	comments: [{ type: Schema.Types.ObjectId, ref: 'Comment' }],
})

export const User = mongoose.model('User', userSchema)

export default User
