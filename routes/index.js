var MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/notes-api';
var JWT_KEY = process.env.JWT_KEY || 'laclemagiquedelamort';
var express = require('express');
var md5 = require('md5');
var jwt = require('jsonwebtoken');
var MongoClient = require('mongodb').MongoClient;
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'le super titre' });
});


router.post('/signup', async (req, res) => {
  try {
    // Connection URL

    var regex = /[A-Z0-9]/;
    // Database Name
    const dbName = 'notes-api';
    const client = new MongoClient(MONGODB_URI);
    const username = req.body.username;
    const password = req.body.password;
    if (password.length < 4){
      res.status(400).send('Le mot de passe doit contenir au moins 4 caractères');
    } else if (username.match(regex)) {
      res.status(400).send('Votre identifiant ne doit contenir que des lettres minuscules non accentuées');
    } else if (username.length < 2 || username.length > 20) {
      res.status(400).send('Votre identifiant doit contenir entre 2 et 20 caractères');
    }
    else {
        await client.connect();
        const db = client.db(dbName);
        const col = db.collection('users');
        var find = await col.find({username: username}).toArray();
        if(find[0] != null) {
          res.status(400).send('Cet identifiant est déjà associé à un compte');
        }else {
          await col.insertMany([{username: username, password: md5(password)}]);
          var getUser = await col.find({username: username, password: md5(password)}).toArray();
          const user = {
            getUser
          }
          jwt.sign({user}, JWT_KEY, {expiresIn: '1d'} ,(err, token) => {
            res.json({
              token
            });
          });
          // res.send("Inscription effectuée");
        }
        client.close();
    }
  } catch (err) {
    //this will eventually be handled by your error handling middleware
    console.log(err.stack);
  }
})




router.get('/signin', async (req, res) => {
  try {
    // Connection URL

    var regex = /[A-Z0-9]/;
    // Database Name
    const dbName = 'notes-api';
    const client = new MongoClient(MONGODB_URI);
    const username = req.query.usernameSignIn;
    const password = req.query.passwordSignIn;
    if (password.length < 4){
      res.status(400).send('Le mot de passe doit contenir au moins 4 caractères');
    } else if (username.match(regex)) {
      res.status(400).send('Votre identifiant ne doit contenir que des lettres minuscules non accentuées');
    } else if (username.length < 2 || username.length > 20) {
      res.status(400).send('Votre identifiant doit contenir entre 2 et 20 caractères');
    } else{
      await client.connect();
      const db = client.db(dbName);
      const col = db.collection('users');
      var getUser = await col.find({username: username, password: md5(password)}).toArray();
      // res.send(find);
      if(find[0] != null) {
        const user = {
          getUser
        }
        jwt.sign({user}, JWT_KEY, {expiresIn: '1d'} ,(err, token) => {
          res.json({
            token
          });
        });
      } else {
        res.status(403).send('Cet identifiant est inconnu');
      }
      client.close();
    }
  } catch (err) {
    //this will eventually be handled by your error handling middleware
    console.log(err.stack);
  }
})


router.get('/show', async (req, res) => {
  try {
    // Connection URL

    // Database Name
    const dbName = 'notes-api';
    const client = new MongoClient(MONGODB_URI);

    await client.connect();
    const db = client.db(dbName);
    const col = db.collection('users');
    var find = await col.find().toArray();
    console.log(find);
    console.log(__dirname);
    res.send(find);
    client.close();
  } catch (err) {
    //this will eventually be handled by your error handling middleware
    console.log(err.stack);
  }
});

module.exports = router;
