var MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017';
var MONGODB_DBNAME = 'notes-api';
var MONGODB_COLLEC = 'notes';

var { check, validationResult } = require('express-validator/check');
var MongoClient = require('mongodb').MongoClient;
var ObjectId = require('mongodb').ObjectId;
var express = require('express');

var router = express.Router();

/**
 * @PUT | CREATE Note
 * 
 * @Route("/notes")
 */
router.post('/', [

	check('content')
		.isLength({ min: 1 })
		.withMessage('Une note ne peut pas être vide')
		// .isEmail()
		// .withMessage('La note ne respecte pas le format')

], async function(request, response) {

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
		data: note,
		errors: errors,
		success: success
	});
});

/**
 * @GET | READ Note
 *
 * @Route("/notes")
 */
router.get('/', [], async function(request, response) {

	var notes = [];

	try {
		// Connect to MongoDB
		const client = new MongoClient(MONGODB_URI);
		await client.connect();

		// Move to database and collection
		const dbi = client.db(MONGODB_DBNAME);
		const col = dbi.collection(MONGODB_COLLEC);

		// Find All Note
		notes = await col.find().toArray();

		// Close Connection
		client.close();

	} catch (e) {
		// This will eventually be handled 
		// ... by your error handling middleware
		response.status(500);
		response.json(e.stack);
	}

	response.render('notes/show', {
		notes: notes
	});
});

/**
 * @PATCH | UPDATE Note
 *
 * @Route("/notes/:id")
 */
router.patch('/:id', [

	check('content')
		.isLength({ min: 1 })
		.withMessage('Une note ne peut pas être vide')
		// .isEmail()
		// .withMessage('La note ne respecte pas le format')

], async function(request, response) {

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
				{ $set: { content: note.content } }
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
		errors: errors,
		success: success
	});
});

/**
 * @DELETE | DELETE Note
 *
 * @Route("/notes/:id")
 */
router.delete('/:id', async function(request, response) {

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
	response.json("Une note a été supprimé !");
});

module.exports = router;