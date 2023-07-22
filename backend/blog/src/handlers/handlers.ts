import { GraphQLID, GraphQLList, GraphQLNonNull, GraphQLObjectType, GraphQLSchema, GraphQLString } from 'graphql'
import { BlogType, CommentType, UserType } from '../schema/schema'
import User, { UserDocument } from '../models/User'
import Blog, { BlogDocument } from '../models/Blog'
import Comment from '../models/Comment'
import { hashSync, compareSync } from 'bcryptjs'
import { Types, startSession } from 'mongoose'

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
		addBlog: {
			type: BlogType,
			args: {
				title: { type: GraphQLNonNull(GraphQLString) },
				content: { type: GraphQLNonNull(GraphQLString) },
				date: { type: GraphQLNonNull(GraphQLString) },
				user: { type: GraphQLNonNull(GraphQLID) },
			},
			async resolve(parent, { title, content, date, user }) {
				const session = await startSession()
				try {
					const newBlog = new Blog({ title, content, date, user })

					const existingUser = await User.findById(user)
					if (!existingUser) throw new Error('User not found')

					session.startTransaction({ session })
					existingUser.blogs.push(newBlog)
					await existingUser.save({ session })

					return await newBlog.save({ session })
				} catch (error) {
					return new Error('Create blog failed. Try again')
				} finally {
					await session.commitTransaction()
				}
			},
		},
		updateBlog: {
			type: BlogType,
			args: {
				id: { type: GraphQLNonNull(GraphQLID) },
				title: { type: GraphQLNonNull(GraphQLString) },
				content: { type: GraphQLNonNull(GraphQLString) },
			},
			async resolve(parent, { title, content, id }) {
				try {
					const blog: BlogDocument = await Blog.findById(id)
					if (!blog) return new Error('Blog does not exist')
					return await Blog.findByIdAndUpdate(id, { title, content }, { new: true })
				} catch (error) {
					return new Error('Update blog failed. Try again')
				}
			},
		},
		deleteBlog: {
			type: BlogType,
			args: {
				id: { type: GraphQLNonNull(GraphQLID) },
			},
			async resolve(parent, { id }) {
				const session = await startSession()
				try {
					session.startTransaction({ session })
					const blog: BlogDocument = await Blog.findById(id).populate('user')
					if (!blog) throw new Error('Blog does not exist')

					const existingUser = blog.user
					if (!existingUser) throw new Error('No user found in existing blog')
					existingUser.blogs.pull(blog)
					await existingUser.save({ session })

					return await Blog.findByIdAndDelete(id)
				} catch (error) {
					return new Error('Update blog failed. Try again')
				} finally {
					session.commitTransaction()
				}
			},
		},
		addCommentToBlog: {
			type: CommentType,
			args: {
				text: { type: GraphQLNonNull(GraphQLString) },
				date: { type: GraphQLNonNull(GraphQLString) },
				blog: { type: GraphQLNonNull(GraphQLID) },
				user: { type: GraphQLNonNull(GraphQLID) },
			},
			async resolve(parent, { text, date, blog, user }) {
				const session = await startSession()
				try {
					session.startTransaction({ session })

					const existingUser: UserDocument = await User.findById(user)
					if (!existingUser) throw new Error('User not found')

					const existingBlog: BlogDocument = await Blog.findById(blog)
					if (!existingBlog) throw new Error('Blog does not exist')

					const newComment = new Comment({ text, blog, date, user })
					existingUser.comments.push(newComment)
					existingBlog.comments.push(newComment)
					await existingUser.save({ session })
					await existingBlog.save({ session })

					return await newComment.save({ session })
				} catch (error) {
					return new Error('Create comment failed. Try again')
				} finally {
					await session.commitTransaction()
				}
			},
		},
	},
})

export default new GraphQLSchema({
	query: RootQuery,
	mutation: mutations,
})
