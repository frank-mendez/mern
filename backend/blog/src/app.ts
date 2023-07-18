import express from 'express'
import { config } from 'dotenv'
import { connectDB } from './utils/connection'

config()

const app = express()

connectDB()
	.then(() => {
		app.listen(process.env.PORT || 5000, () => {
			console.log(`Server running on PORT: ${process.env.PORT}`)
		})
	})
	.catch((err) => {
		console.error(err)
	})
