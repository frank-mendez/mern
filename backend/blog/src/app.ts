import express from 'express'
import { config } from 'dotenv'
import { connectDB } from './utils/connection'
import { graphqlHTTP } from 'express-graphql'
import schema from './handlers/handlers'

config()

const app = express()

app.use('/graphql', graphqlHTTP({ schema: schema, graphiql: true }))

connectDB()
	.then(() => {
		app.listen(process.env.PORT || 5000, () => {
			console.log(`Server running on PORT: ${process.env.PORT}`)
		})
	})
	.catch((err) => {
		console.error(err)
	})
