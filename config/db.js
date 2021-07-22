const mongoose = require('mongoose');

mongoose.connect('mongodb+srv://' + process.env.DB_USER_PASS + '@cluster0.ahqpy.mongodb.net/social-network-mern',
    {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useCreateIndex: true,
        useFindAndModify: false
    }
)
    .then(() => console.log('Connected to Mongo'))
    .catch((err) => console.log("Failed to connect to MongoDB", err))