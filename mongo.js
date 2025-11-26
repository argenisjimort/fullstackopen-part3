//this is just a file that either:
//1. displays all the info on the database collection, or...
//2. saves a new Person instance to the database collection

//this file is not really used anywhere on the app
/////////////////////////////////////////////////////
/////////////////////////////////////////////////////






if (process.argv.length < 3) { //if there are not atleast 2 arguments, exit
  console.log(`missing arguments. [password]`)
  process.exit(1)
}

const password = process.argv[2] //argument passed when the function is called c=fom the terminal
const url = `mongodb+srv://mongodb-testuser:${password}@cluster0.449vxy2.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`


const mongoose = require(`mongoose`)
mongoose.set( `strictQuery`, false )
mongoose.connect(url)//connect to the Mongo DB with the connection string (with the password added)


//this Schema is a "Blueprint" for the structure of the data to be saved on the MongoDB
const personSchema = new mongoose.Schema({
  name: String,
  number: String
})

const Person = mongoose.model(`Person`, personSchema) //`Person` is the model name, and personSChema, the schema previously created
//now Person is a model that can be used to communicate with the database (MpngoDB)





//////////if ONLY 3 arguments when running the program /////////////
//get persons
//if there are only 3 argumments, [Node.js, filetoRUn,js, (password) ]
if (process.argv.length === 3) {
  Person.find({}).then( result => { //only use the Person model to find all the persons
    result.forEach( person => console.log(person) )//and the then print each one of them
    mongoose.connection.close() //then close connection
  } )
  return //and exit of the program
}






////////////////// if not, (more than 3 arguments) //////////////
//submit
const person = new Person({ //create an instance of the model defined above
  name: process.argv[3],
  number: process.argv[4] //arguments passed when the function is called
})

person.save().then( () => { //save it ot the database
  console.log(`added "${process.argv[3]}" number "${process.argv[4]}" to phonebook`) //then print a message
  mongoose.connection.close() //close DB connection
} )

//(funny, bc you can put as many arguments as you want then, and this program wont check for it)
// it will just use as maximum the args 3, 4, 5
//also, it seems that if you just out 4 args (no phone number)
//the phone number wont be added to the item on the databse (not even as NULL)