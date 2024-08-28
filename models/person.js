const url = process.env.URL

const mongoose = require(`mongoose`)
mongoose.set( `strictQuery`, false )

console.log(`connecting mongoose to url...`)
mongoose.connect(url)
  .then( console.log(`connected`) )
  .catch( err => console.log(`ERROR ${err}`) )

const personSchema = new mongoose.Schema({
  name: {
    type: String,
    minLength: 3,
    required: true,
  },
  number: {
    type: String,
    required: true,
    validate: {
      validator: (v) => {
        return /\d(2,3)-\d/.test(v)
      },
      message: `invalid phone number`
    }
  }
})

personSchema.set(`toJSON`, {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  }
})


module.exports = mongoose.model(`Person`, personSchema)