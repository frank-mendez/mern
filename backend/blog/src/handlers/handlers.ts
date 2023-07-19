import { GraphQLList, GraphQLNonNull, GraphQLObjectType, GraphQLSchema, GraphQLString } from 'graphql'
import { BlogType, CommentType, UserType } from '../schema/schema'
import User, { UserDocument } from '../models/User'
import Blog from '../models/Blog'
import Comment from '../models/Comment'
import { hashSync, compareSync } from 'bcryptjs'

const RootQuery = new GraphQLObjectType({
	name: 'RootQuery',
	fields: {
		users: {
			type: GraphQLList(UserType),
			async resolve() {
				return await User.find()
			},
		},
		blogs: {
			type: GraphQLList(BlogType),
			async resolve() {
				return await Blog.find()
			},
		},
		comments: {
			type: GraphQLList(CommentType),
			async resolve() {
				return await Comment.find()
			},
		},
	},
})

const mutations = new GraphQLObjectType({
	name: 'mutation',
	fields: {
		signup: {
			type: UserType,
			args: {
				name: { type: GraphQLNonNull(GraphQLString) },
				email: { type: GraphQLNonNull(GraphQLString) },
				password: { type: GraphQLNonNull(GraphQLString) },
			},
			async resolve(parent, { email, name, password }) {
				try {
					const existingUser: UserDocument = await User.findOne({ email })
					if (existingUser) return new Error('User already exists')
					const encrpytedPassword = hashSync(password)
					const user = new User({ name, email, password: encrpytedPassword })
					return await user.save()
				} catch (error) {
					return new Error('User signup failed. Try again')
				}
			},
		},
		login: {
			type: UserType,
			args: {
				email: { type: GraphQLNonNull(GraphQLString) },
				password: { type: GraphQLNonNull(GraphQLString) },
			},
			async resolve(parent, { email, password }) {
				try {
					const existingUser: UserDocument = await User.findOne({ email })
					if (!existingUser) return new Error('Email is not yet registered')
					const decryptedPassword = compareSync(password, existingUser.password)
					if (!decryptedPassword) return new Error('Invalid Credentials')
					return existingUser
				} catch (error) {
					return new Error('Login failed. Try again')
				}
			},
		},
	},
})

export default new GraphQLSchema({
	query: RootQuery,
	mutation: mutations,
})
