const mongodb = require('mongodb');

const MongoClient = mongodb.MongoClient;

const MongoConnect = (callback) => {
  MongoClient.connect(
    'mongodb+srv://alex:9gBBaT0jYaGDmTZD@cluster0.u9lrb.mongodb.net/?retryWrites=true&w=majority'
  )
    .then((result) => {
      console.log('connected!!');
      callback(result);
    })
    .catch((error) => console.log(error));
};

module.exports = MongoConnect;
