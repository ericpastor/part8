require("dotenv").config()
require('./db.js')
const jwt = require('jsonwebtoken')
const { UserInputError, AuthenticationError } = require('apollo-server')
const { PubSub } = require("graphql-subscriptions")


const Author = require('./models/author')
const Book = require('./models/book')
const User = require('./models/user')
const user = require("./models/user")

const JWT_SECRET = process.env.JWT_SECRET

const pubsub = new PubSub()

const SUBSCRIPTION_EVENT = {
  BOOK_ADDED: 'BOOK_ADDED'
}


const resolvers = {
    Query: {
      authorsCount: () => Author.collection.countDocuments(),
      bookCount: () => Book.collection.countDocuments(),
      allAuthors: async () => Author.find({}),
      allBooks: async (root, args) =>  {
       
        if(!args.author && !args.genre) {
          return Book.find({}).populate("author")
         }
        // if(args.author){     
        //  return  books.filter(b => b.author === args.author)
        // }
        //   else
         if(args.genre){
          return Book.find({genres: { $in: [args.genre] } }).populate("author")
        }
  
        
      },
      me: (root, args, context) => {
        return context.currentUser
      }
    },
  
    Author: {      
      bookCount: async (root) => {
        return Book.countDocuments({ author: root })
      },
    },
   
     
    Mutation: {
  
      addBook: async (root, args, context) => {    
  
       const {currentUser} = context
  
       if(!currentUser){ throw new AuthenticationError('not authenticated')}
  
       let author = await Author.findOne({ name: args.author })
  
         if(!author){
  
          author = new Author({ name: args.author })
          try {
            await author.save()
          } catch (error) {
            throw new UserInputError(error.message, {
              invalidArgs: args,
            })
          }
         }
  
         if(author){
  
          const book = new Book({...args, author})
           try {
            await book.save()
          } catch (error) {
            throw new UserInputError(error.message, {
              invalidArgs: args,
            })
          }
  
          pubsub.publish(SUBSCRIPTION_EVENT.BOOK_ADDED, { bookAdded: book })
          return book
         }
         
      },     
  
      editAuthor: async (root, args, context) => {
  
        const {currentUser} = context
  
        if(!currentUser) { throw new AuthenticationError('not authenticated')}
  
        const author = await Author.findOne({ name: args.name })
        if(!author) return null
        author.born = args.born
        return author.save()
      }, 
  
      createUser: (root, args) => {
        const user = new User ({username: args.username, favoriteGenre: args.favoriteGenre})
  // without try 
        return user.save().catch(error =>{
          throw new UserInputError(error.message, {
            invalidArgs: args,
          }) 
        })
      }, 
  
      login: async (root, args) => {
        const user = await User.findOne({ username: args.username })
  
        if (!user||args.password !== 'lacontraseña')
  
        throw new UserInputError('wrong credentials')
        
        
        const userForToken = {
          username: user.username, 
          id: user._id
        }
  
        return {
          value: jwt.sign(userForToken, JWT_SECRET)
        }
      }
    },
  
    Subscription: {
      bookAdded: {
        subscribe: () => pubsub.asyncIterator(SUBSCRIPTION_EVENT.BOOK_ADDED)
      }
    },
   
  }

  module.exports = resolvers