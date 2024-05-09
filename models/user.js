import mongoose from 'mongoose'

// following two lines (A,B) are identical. A is long form and B is destructuring Schema property from mongoose
//  and putting it into Schema.
//const Schema = mongoose.Schema          // A
const {Schema} = mongoose               // B

const userSchema = new Schema({
    googleID: String,
    name: String,
    emails: []
})

mongoose.model('users', userSchema)