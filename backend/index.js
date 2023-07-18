const express = require('express')
const { v4: uuid } = require('uuid')

const { graphqlHTTP } = require('express-graphql')
const { GraphQLObjectType, GraphQLID, GraphQLString, GraphQLList, GraphQLSchema } = require('graphql')

const app = express()

const userList = [
	{
		id: '64b4e53a0cf5add2e71efba6',
		email: 'miranda_potts@undefined.degree',
		username: 'miranda23',
		name: 'Miranda Potts',
	},
	{
		id: '64b4e53a2ddd8dd470caf26a',
		email: 'kennedy_wilder@undefined.nadex',
		username: 'kennedy23',
		name: 'Kennedy Wilder',
	},
	{
		id: '64b4e53aa9792a61db78fd7f',
		email: 'odonnell_calderon@undefined.juegos',
		username: 'odonnell23',
		name: 'Odonnell Calderon',
	},
	{
		id: '64b4e53aac361bb9afb18dd7',
		email: 'mills_bean@undefined.gf',
		username: 'mills23',
		name: 'Mills Bean',
	},
	{
		id: '64b4e53a7887db9769b08b75',
		email: 'maldonado_gill@undefined.dz',
		username: 'maldonado23',
		name: 'Maldonado Gill',
	},
]

const UserType = new GraphQLObjectType({
	name: 'UserType',
	fields: () => ({
		id: { type: GraphQLID },
		name: { type: GraphQLString },
		username: { type: GraphQLString },
		email: { type: GraphQLString },
	}),
})

const RootQuery = new GraphQLObjectType({
	name: 'RootType',
	fields: {
		users: {
			type: new GraphQLList(UserType),
			resolve() {
				return userList
			},
		},
		user: {
			type: UserType,
			args: { id: { type: GraphQLID } },
			resolve(parent, { id }) {
				return userList.find((user) => user.id === id)
			},
		},
	},
})

const mutations = new GraphQLObjectType({
	name: 'mutations',
	fields: {
		addUser: {
			type: UserType,
			args: { name: { type: GraphQLString }, username: { type: GraphQLString }, email: { type: GraphQLString } },
			resolve(parent, { name, username, email }) {
				const newUser = { name, username, email, id: uuid() }
				userList.push(newUser)
				return newUser
			},
		},
		updateUser: {
			type: UserType,
			args: { id: { type: GraphQLID }, name: { type: GraphQLString }, username: { type: GraphQLString }, email: { type: GraphQLString } },
			resolve(parent, { name, username, email, id }) {
				const user = userList.find((user) => user.id === id)
				user.name = name ? name : user.name
				user.username = username ? username : user.username
				user.email = email ? email : user.email
				return user
			},
		},
	},
})

const schema = new GraphQLSchema({
	query: RootQuery,
	mutation: mutations,
})

app.use('/graphql', graphqlHTTP({ schema, graphiql: true }))

app.listen(5000, () => {
	console.log('Server running')
})
