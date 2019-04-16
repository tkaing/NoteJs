var MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/notes-api';
var MONGODB_DBNAME = 'notes-api';
var MONGODB_COLLEC = 'users';
var JWT_KEY = process.env.JWT_KEY || 'laclemagiquedelamort';
var express = require('express');
var md5 = require('md5');
var jwt = require('jsonwebtoken');
var MongoClient = require('mongodb').MongoClient;
var router = express.Router();
var { check, validationResult } = require('express-validator/check');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'le super titre' });
});

/**
 * @POST | CREATE User
 *
 * @Route("/signup")
 */
router.post('/signup', async (req, res) => {
  try {
    var regex = /[^a-z]/;
    const dbName = MONGODB_DBNAME;
    const client = new MongoClient(MONGODB_URI);
    const username = req.body.username;
    const password = req.body.password;
    if (password.length < 4){
      res.status(400).send({error: 'Le mot de passe doit contenir au moins 4 caractères'});
    } else if (username.match(regex)) {
      res.status(400).send({error: 'Votre identifiant ne doit contenir que des lettres minuscules non accentuées'});
    } else if (username.length < 2 || username.length > 20) {
      res.status(400).send({error: 'Votre identifiant doit contenir entre 2 et 20 caractères'});
    }
    else {
        await client.connect();
        const db = client.db(dbName);
        const col = db.collection(MONGODB_COLLEC);
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
              error: null,
              token
            });
          });
        }
        client.close();
    }
  } catch (err) {
    console.log(err.stack);
  }
})



/**
 * @POST | CREATE a new token for a user
 *
 * @Route("/signin")
 */
router.post('/signin', async (req, res) => {
  try {

    var regex = /[^a-z]/;
    const dbName = MONGODB_DBNAME;
    const client = new MongoClient(MONGODB_URI);
    const username = req.body.username;
    const password = req.body.password;
    if (password.length < 4){
      res.status(400).send({error: 'Le mot de passe doit contenir au moins 4 caractères'});
    } else if (username.match(regex)) {
      res.status(400).send({error: 'Votre identifiant ne doit contenir que des lettres minuscules non accentuées'});
    } else if (username.length < 2 || username.length > 20) {
      res.status(400).send({error: 'Votre identifiant doit contenir entre 2 et 20 caractères'});
    } else{
      await client.connect();
      const db = client.db(dbName);
      const col = db.collection(MONGODB_COLLEC);
      var getUser = await col.find({username: username, password: md5(password)}).toArray();
      if(getUser[0] != null) {
        const user = {
          getUser
        }
        jwt.sign({user}, JWT_KEY, {expiresIn: '1d'} ,(err, token) => {
          res.json({
            error: null,
            token
          });
        });
      } else {
        res.status(403).send({error: 'Cet identifiant est inconnu'});
      }
      client.close();
    }
  } catch (err) {
    console.log(err.stack);
  }
})


router.get('/show', async (req, res) => {
  try {
    const dbName = MONGODB_DBNAME;
    const client = new MongoClient(MONGODB_URI);

    await client.connect();
    const db = client.db(dbName);
    const col = db.collection(MONGODB_COLLEC);
    var find = await col.find().toArray();
    res.send(find);
    client.close();
  } catch (err) {
    console.log(err.stack);
  }
});

module.exports = router;
