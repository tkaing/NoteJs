var MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017';
var JWT_KEY = process.env.JWT_KEY || 'laclemagiquedelamort';
var MONGODB_DBNAME = 'notes-api';
var MONGODB_COLLEC = 'notes';

var { check, validationResult } = require('express-validator/check');
var MongoClient = require('mongodb').MongoClient;
var ObjectId = require('mongodb').ObjectId;
var express = require('express');
var jwt = require('jsonwebtoken');
// var verifyToken = require('./index').verifyToken;
var router = express.Router();


/**
 * @PUT | CREATE Note
 *
 * @Route("/notes")
 */
router.put('/', [verifyToken,
	check('content')
		.isLength({ min: 1 })
		.withMessage('Une note ne peut pas être vide')
		// .isEmail()
		// .withMessage('La note ne respecte pas le format')

], function(request, response) {
	jwt.verify(request.token, JWT_KEY, async (err, authData) => {
		if (err) {
			response.status(401).send('Utilisateur non connecté');
		} else {
				var note = request.body;
				var errors = validationResult(request).mapped();
				var success = Object.keys(errors).length === 0;

				if (success) {

					try {
						// Connect to MongoDB
						const client = new MongoClient(MONGODB_URI);
						await client.connect();

						// Move to database and collection
						const dbi = client.db(MONGODB_DBNAME);
						const col = dbi.collection(MONGODB_COLLEC);

						note['userId'] = authData.user.getUser[0]._id;
						note['createdAt'] = Date.now();
						note['lastUpdatedAt'] = null;

						// Insert Note
						await col.insertOne(note);

						// Close Connection
						client.close();

					} catch (e) {
						// This will eventually be handled
						// ... by your error handling middleware
						response.status(500);
						response.json(e.stack);
					}
				}
				response.status(200);
				response.json({
					error: errors,
					data: note
				});
			}
	});
});

/**
 * @GET | READ Note
 *
 * @Route("/notes")
 */
router.get('/', verifyToken, function(request, response) {
	jwt.verify(request.token, JWT_KEY, async (err, authData) => {
		if (err) {
			response.status(401).send('Utilisateur non connecté');
		} else {
			var notes = [];

			try {
				// Connect to MongoDB
				const client = new MongoClient(MONGODB_URI);
				await client.connect();

				// Move to database and collection
				const dbi = client.db(MONGODB_DBNAME);
				const col = dbi.collection(MONGODB_COLLEC);

				// Find All Note
				//var getUser = await col.find({username: username, password: md5(password)}).toArray();
				notes = await col.find({userId: authData.user.getUser[0]._id}).sort({_id: -1}).toArray();
				console.log(verifyToken);

				// Close Connection
				client.close();

			} catch (e) {
				// This will eventually be handled
				// ... by your error handling middleware
				response.status(500);
				response.json(e.stack);
			}
			response.json({
				"error": err,
				"notes": notes,
				authData
			});
			// response.render('notes/show', {
			// 	notes: notes
			// });
		}
	});
});

/**
 * @PATCH | UPDATE Note
 *
 * @Route("/notes/:id")
 */
router.patch('/:id', [verifyToken,

	check('content')
		.isLength({ min: 1 })
		.withMessage('Une note ne peut pas être vide')
		// .isEmail()
		// .withMessage('La note ne respecte pas le format')

], function(request, response) {
	jwt.verify(request.token, JWT_KEY, async (err, authData) => {
		if (err) {
			response.status(401).send('Utilisateur non connecté');
		} else {
			var id = request.params.id;
			var note = request.body;
			var errors = validationResult(request).mapped();
			var success = Object.keys(errors).length === 0;

			if (success) {

				try {
					// Connect to MongoDB
					const client = new MongoClient(MONGODB_URI);
					await client.connect();

					// Move to database and collection
					const dbi = client.db(MONGODB_DBNAME);
					const col = dbi.collection(MONGODB_COLLEC);

					// Update Note
					var result = await col.updateOne(
						{ _id: ObjectId(id) },
						{ $set: { 	content: note.content,
												lastUpdatedAt: Date.now()
										} }
					);
					if (result.modifiedCount === 0) {
						response.status(404);
						response.json("Votre note est introuvable.");
					}

					// Close Connection
					client.close();

				} catch (e) {
					// This will eventually be handled
					// ... by your error handling middleware
					response.status(500);
					response.json(e.stack);
				}
			}

			response.status(200);
			response.json({
				data: note,
				error: errors
			});
		}
	});
});

/**
 * @DELETE | DELETE Note
 *
 * @Route("/notes/:id")
 */
router.delete('/:id', verifyToken, function(request, response) {
	jwt.verify(request.token, JWT_KEY, async (err, authData) => {
		if (err) {
			response.status(401).send('Utilisateur non connecté');
		} else {
				var id = request.params.id;

				try {
					// Connect to MongoDB
					const client = new MongoClient(MONGODB_URI);
					await client.connect();

					// Move to database and collection
					const dbi = client.db(MONGODB_DBNAME);
					const col = dbi.collection(MONGODB_COLLEC);

					// Delete Note
					var result = await col.deleteOne({ _id: ObjectId(id) });
					if (result.deletedCount === 0) {
						response.status(404);
						response.json("Votre note est introuvable.");
					}

					// Close Connection
					client.close();

				} catch (e) {
					// This will eventually be handled
					// ... by your error handling middleware
					response.status(500);
					response.json(e.stack);
				}

				response.status(200);
				response.json({
					error: errors
				});
		}
	});
});



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

module.exports = router;
