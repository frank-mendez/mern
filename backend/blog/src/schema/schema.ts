import { GraphQLID, GraphQLNonNull, GraphQLObjectType, GraphQLString } from 'graphql'

const UserType = new GraphQLObjectType({
	name: 'UserType',
	fields: () => ({
		id: { type: GraphQLNonNull(GraphQLID) },
		name: { type: GraphQLString },
		email: { type: GraphQLString },
		password: { type: GraphQLString },
	}),
})

const BlogType = new GraphQLObjectType({
	name: 'BlogType',
	fields: () => ({
		id: { type: GraphQLNonNull(GraphQLID) },
		title: { type: GraphQLString },
		content: { type: GraphQLString },
		date: { type: GraphQLString },
	}),
})

const CommentType = new GraphQLObjectType({
	name: 'CommentType',
	fields: () => ({
		id: { type: GraphQLNonNull(GraphQLID) },
		text: { type: GraphQLString },
	}),
})
