if (process.argv.length < 3) {
  console.log(`missing arguments. [password]`)
  process.exit(1)
}

const password = process.argv[2]
const url = `mongodb+srv://mongodb-testuser:${password}@cluster0.449vxy2.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`


const mongoose = require(`mongoose`)
mongoose.set( `strictQuery`, false )
mongoose.connect(url)


const personSchema = new mongoose.Schema({
  name: String,
  number: String
})
const Person = mongoose.model(`Person`, personSchema)



//get persons
if (process.argv.length === 3) {
  Person.find({}).then( result => {
    result.forEach( person => console.log(person) )
    mongoose.connection.close()
  } )
  return
}



//submit
const person = new Person({
  name: process.argv[3],
  number: process.argv[4]
})

person.save().then( () => {
  console.log(`added "${process.argv[3]}" number "${process.argv[4]}" to phonebook`)
  mongoose.connection.close()
} )