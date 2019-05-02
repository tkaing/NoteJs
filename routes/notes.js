var JWT_KEY = process.env.JWT_KEY || 'laclemagiquedelamort';
var MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017';
var MONGODB_DBNAME = 'notes-api';
var MONGODB_COLLEC = 'notes';

var MongoClient = require('mongodb').MongoClient;
var ObjectId = require('mongodb').ObjectId;
var express = require('express');
var jwt = require('jsonwebtoken');
var router = express.Router();


/**
 * @PUT | CREATE Note
 *
 * @Route("/notes")
 */
router.put('/', verifyToken, function(request, response) {
	jwt.verify(request.token, JWT_KEY, async (err, authData) => {
		if (err)
		{
			response.status(401).send({
				error: 'Utilisateur non connecté.'
			});

		} else {

			try {

				var note = request.body;

				// Check note content
				if (note.content.length <= 0)
				{
					response.json({
						error: 'Une note ne peut pas être vide.'
					});

				} else {

						// Connect to MongoDB
					const client = new MongoClient(MONGODB_URI);
					await client.connect();

					// Move to database and collection
					const dbi = client.db(MONGODB_DBNAME);
					const col = dbi.collection(MONGODB_COLLEC);

					var options = {
					    timeZone: "Europe/Paris",
					    year: 'numeric', month: 'numeric', day: 'numeric',
					    hour: 'numeric', minute: 'numeric', second: 'numeric'
					};
					var formatter = new Intl.DateTimeFormat([], options);
					var currentTime = formatter.format(new Date());

					note['userId'] = authData.user.getUser[0]._id;
					note['createdAt'] = currentTime;
					note['lastUpdatedAt'] = null;

					// Insert Note
					await col.insertOne(note);

					response.status(200).json({
						error: null,
						data: note
					});

					// Close Connection
					client.close();
				}

			} catch (e) {
				// This will eventually be handled
				// ... by your error handling middleware
				response.status(500).json(e.stack);
			}
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
		if (err)
		{
			response.status(401).send({
				error: 'Utilisateur non connecté.'
			});

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
				notes = await col.find({userId: authData.user.getUser[0]._id}).sort({_id: -1}).toArray();

				// Close Connection
				client.close();

			} catch (e) {
				// This will eventually be handled
				// ... by your error handling middleware
				response.status(500).json(e.stack);
			}
			response.json({
				error: err,
				notes: notes
			});
		}
	});
});

/**
 * @PATCH | UPDATE Note
 *
 * @Route("/notes/:id")
 */
router.patch('/:id', verifyToken, function(request, response) {
	jwt.verify(request.token, JWT_KEY, async (err, authData) => {
		if (err)
		{
			response.status(401).send({
				error: 'Utilisateur non connecté.'
			});

		} else {

			try {

				var id = request.params.id;
				var note = request.body;

				// Check note content
				if (note.content.length <= 0)
				{
					response.json({
						error: 'Une note ne peut pas être vide.'
					});
				}

				// Connect to MongoDB
				const client = new MongoClient(MONGODB_URI);
				await client.connect();

				// Move to database and collection
				const dbi = client.db(MONGODB_DBNAME);
				const col = dbi.collection(MONGODB_COLLEC);

				// Update Note
				var tmpNote = await col.find({ _id: ObjectId(id) }).toArray();

				if (tmpNote[0] != null)
				{
					tmpNote = await col.find({ _id: ObjectId(id), userId: authData.user.getUser[0]._id }).toArray();

					if (tmpNote[0] != null)
					{
						var options = {
						    timeZone: "Europe/Paris",
						    year: 'numeric', month: 'numeric', day: 'numeric',
						    hour: 'numeric', minute: 'numeric', second: 'numeric'
						};
						var formatter = new Intl.DateTimeFormat([], options);
						var currentTime = formatter.format(new Date());

						var result = await col.updateOne({ _id: ObjectId(id) },
						{ $set: { content: note.content, lastUpdatedAt: currentTime } });

						var finalNote = await col.find({ _id: ObjectId(id) }).toArray();

						response.status(200).send({
							error: null,
							note: finalNote
						});

					} else {

						response.status(403).send({
							error: "Accès non autorisé à cette note."
						});
					}

				} else {

					response.status(404).send({
						error: "Cet identifiant est inconnu."
					});
				}

				// Close Connection
				client.close();

			} catch (e) {
				// This will eventually be handled
				// ... by your error handling middleware
				response.status(500).json(e.stack);
			}
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
		if (err)
		{
			response.status(401).send({
				error: 'Utilisateur non connecté.'
			});

		} else {

			try {

				var id = request.params.id;

				// Connect to MongoDB
				const client = new MongoClient(MONGODB_URI);
				await client.connect();

				// Move to database and collection
				const dbi = client.db(MONGODB_DBNAME);
				const col = dbi.collection(MONGODB_COLLEC);

				// Delete Note
				var tmpNote = await col.find({ _id: ObjectId(id) }).toArray();

				if (tmpNote[0] != null)
				{
					tmpNote = await col.find({ _id: ObjectId(id), userId: authData.user.getUser[0]._id }).toArray();

					if (tmpNote[0] != null)
					{
						var result = await col.deleteOne({ _id: ObjectId(id) });

						response.status(200).send({
							error: null
						});

					} else {

						response.status(403).send({
							error: "Accès non autorisé à cette note."
						});
					}

				} else {

					response.status(404).send({
						error: "Cet identifiant est inconnu."
					});
				}

				// Close Connection
				client.close();

			} catch (e) {
				// This will eventually be handled
				// ... by your error handling middleware
				response.status(500).json(e.stack);
			}
		}
	});
});

// FORMAT OF TOKEN
// Authorization: Bearer <access_token>

// Verify Token
function verifyToken(req, res, next) {
  // Get auth header value
  const bearerHeader = req.headers['x-access-token'];
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
