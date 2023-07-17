const express = require('express')

const { graphqlHTTP } = require('express-graphql')

const app = express()

app.use('/graphql', graphqlHTTP({ schema: {}, graphiql: true }))

app.listen(5000, () => {
	console.log('Server running')
})
