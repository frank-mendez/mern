import mongoose, { Document, Schema, model } from 'mongoose'

export interface UserDocument extends Document {
	name: string
	email: string
	password: string
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
})

export const User = mongoose.model('User', userSchema)

export default User
