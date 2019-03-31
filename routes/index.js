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
    const url = process.env.MONGODB_URI || 'mongodb://localhost:27017/notes-api';
    // Database Name
    const dbName = 'notes-api';
    const client = new MongoClient(url);
    const username = req.body.username;
    const password = req.body.password;
    await client.connect();
    const db = client.db(dbName);
    const col = db.collection('users');
    col.insertMany([{username: username, password: md5(password)}]);
    const user = {
      username: username,
      password: password
    }
    jwt.sign({user}, 'laclemagiquedelamort', (err, token) => {
      res.json({
        token
      });
    });
    // res.send("Inscription effectuée");
    client.close();
  } catch (err) {
    //this will eventually be handled by your error handling middleware
    console.log(err.stack);
  }
})


router.get('/signin', async (req, res) => {
  try {
    // Connection URL
    const url = process.env.MONGODB_URI || 'mongodb://localhost:27017/notes-api';
    // Database Name
    const dbName = 'notes-api';
    const client = new MongoClient(url);
    const username = req.query.usernameSignIn;
    const password = req.query.passwordSignIn;
    await client.connect();
    const db = client.db(dbName);
    const col = db.collection('users');
    var find = await col.find({username: username, password: md5(password)}).toArray();
    // res.send(find);
    if(find[0] != null) {
      const user = {
        username: username,
        password: password
      }
      jwt.sign({user}, 'laclemagiquedelamort', (err, token) => {
        res.json({
          token
        });
      });
    } else {
      res.sendStatus(403);
    }
    client.close();
  } catch (err) {
    //this will eventually be handled by your error handling middleware
    console.log(err.stack);
  }
})

router.post('/token', verifyToken, (req, res) => {
  jwt.verify(req.token, 'laclemagiquedelamort', (err, authData) => {
    if(err) {
      res.sendStatus(403);
    } else {
      res.json({
        message: 'Post created...',
        authData
      });
    }
  });
});



//POUR TITI
// router.get('/signin', verifyToken, async (req, res) => {
//   jwt.verify(req.token, 'laclemagiquedelamort', async (err, authData) => {
//     if(err) {
//       res.sendStatus(403);
//     } else {
//       try {
//         // Connection URL
//         const url = process.env.MONGODB_URI || 'mongodb://localhost:27017/notes-api';
//         // Database Name
//         const dbName = 'notes-api';
//         const client = new MongoClient(url);
//         const username = req.query.usernameSignIn;
//         const password = req.query.passwordSignIn;
//         await client.connect();
//         const db = client.db(dbName);
//         const col = db.collection('users');
//         var find = await col.find({username: username, password: md5(password)}).toArray();
//         // res.send(find);
//         if(find[0] != null) {
//           res.send("t'existe ma gueule");
//         } else {
//           res.sendStatus(403);
//         }
//         client.close();
//       } catch (err) {
//         //this will eventually be handled by your error handling middleware
//         console.log(err.stack);
//       }
//     }
//   });
// })

// FORMAT OF TOKEN
// Authorization: Bearer <access_token>

// Verify Token
function verifyToken(req, res, next) {
  // Get auth header value
  const bearerHeader = req.headers['authorization'];
  // Check if bearer is undefined
  if(typeof bearerHeader !== 'undefined') {
    // Split at the space
    const bearer = bearerHeader.split(' ');
    // Get token from array
    const bearerToken = bearer[1];
    // Set the token
    req.token = bearerToken;
    // Next middleware
    next();
  } else {
    // Forbidden
    res.sendStatus(403);
  }
}

router.get('/test', async (req, res) => {
  try {
    // Connection URL
    const url = process.env.MONGODB_URI || 'mongodb://localhost:27017/notes-api';
    // Database Name
    const dbName = 'notes-api';
    const client = new MongoClient(url);

    await client.connect();
    const db = client.db(dbName);
    const col = db.collection('users');
    col.insertMany([{nom: 'monNom', prenom: 'monPrenom', email: 'monEmail', mdp: 'monMdp', tel: 'monTel'}]);
    res.send(col.find().toArray());
    client.close();
  } catch (err) {
    //this will eventually be handled by your error handling middleware
    console.log(err.stack);
  }
});

router.get('/show', async (req, res) => {
  try {
    // Connection URL
    const url = process.env.MONGODB_URI || 'mongodb://localhost:27017/notes-api';
    // Database Name
    const dbName = 'notes-api';
    const client = new MongoClient(url);

    await client.connect();
    const db = client.db(dbName);
    const col = db.collection('users');
    var find = await col.find().toArray();
    console.log(find);
    res.send(find);
    client.close();
  } catch (err) {
    //this will eventually be handled by your error handling middleware
    console.log(err.stack);
  }
});


module.exports = router;
