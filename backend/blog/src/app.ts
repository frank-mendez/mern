import express from 'express'
import { config } from 'dotenv'
import { connectDB } from './utils/connection'
import { graphqlHTTP } from 'express-graphql'

config()

const app = express()

app.use('/graphql', graphqlHTTP({ schema: null, graphiql: true }))

connectDB()
	.then(() => {
		app.listen(process.env.PORT || 5000, () => {
			console.log(`Server running on PORT: ${process.env.PORT}`)
		})
	})
	.catch((err) => {
		console.error(err)
	})
