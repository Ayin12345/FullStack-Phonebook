const mongoose = require('mongoose')

if (process.argv.length < 3) {
  console.log('Password is missing or incorrect')
  process.exit(1)
}
else if (process.argv.length === 4) {
  console.log('Phone number is missing')
  process.exit(1)
}


const password = process.argv[2]

const url =
`mongodb+srv://alekseiyin:${password}@cluster0.qqqtsui.mongodb.net/Person?retryWrites=true&w=majority&appName=Cluster0` 

mongoose.set('strictQuery',false)

mongoose
  .connect(url)
  .catch((err) => {
    console.error(err);
  });

mongoose.connection.on("error", (err) => {
  console.log(err);
});


const personSchema = new mongoose.Schema({
  name: {
    type: String,
    minLength: [3, 'Person validation failed: Minimum length is 3, got {VALUE}'],
    required: [true, 'User name required']
  },
  number: {
    type: String,
    validate: {
      validator: function(v) {
        return /\d{2,3}-\d/.test(v)
      },
      message: props => `${props.value} is not a valid phone number`
    },
    required: [true, 'User phone number required']
  },
})

const Person = mongoose.model('Person', personSchema);

if (process.argv.length === 3) {
  Person.find({}).then(result => {
    result.forEach(person => {
      console.log(person)
    })
    mongoose.connection.close()
  })
}
else if (process.argv.length === 5) {
  /* Add new person to phone book */
  const person = new Person({
    name: process.argv[3],
    number: process.argv[4]
  })

  person.save().then((result) => {
    console.log(`Added "${process.argv[3]}" with number "${process.argv[4]}" to phone book`)
    mongoose.connection.close()
  })
}        