import { connect } from 'mongoose'

export const connectDB = async () => {
	try {
		await connect(`mongodb+srv://admin:${process.env.MONGODB_PASSWORD}@cluster0.evsj75n.mongodb.net/?retryWrites=true&w=majority`)
		console.log('DB connected')
	} catch (error) {
		console.error(error)
		return error
	}
}
