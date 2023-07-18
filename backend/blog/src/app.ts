import express from 'express'
import { config } from 'dotenv'

config()

const app = express()

app.listen(process.env.PORT || 5000, () => {
	console.log(`Server running on PORT: ${process.env.PORT}`)
})
