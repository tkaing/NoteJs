- /!\ certains tests automatisés (https://github.com/adrienjoly/ava-tests-for-note-keeper) ne passent pas (cf logs, plus bas) => appliquer attentivement les consignes du cahier des charges: http://adrienjoly.com/cours-nodejs/05-proj
- penser à utiliser `{ useNewUrlParser: true }` dans toutes les instanciations de MongoClient
- par ailleurs, l'API ne répond pas aux requête lorsqu'il y a une erreur de code. exemple de stack trace:

```
TypeError: Cannot read property 'length' of undefined
    at router.post (/usr/src/app/routes/index.js:29:18)
```

Logs de tests automatisés:

```
ℹ️ Testing API in end-to-end mode.
{ API_URL: 'http://localhost:3000',
  MONGODB_URI: 'mongodb://localhost:27017/notes-api',
  BACKUP_PATH:
   '/Users/adrienjoly/Dev/_eemi-aj/node-note-keeper/tests/setup/../_db_backup' }
  ✔ 1-golden-path › POST /signup - returns a token
  ✔ 1-golden-path › POST /signup - returns a null error
  ✔ 1-golden-path › POST /signup - returns a status 200
  ✔ 1-golden-path › POST /signin on an existing user - returns a token
  ✔ 1-golden-path › POST /signin on an existing user - returns a null error
  ✔ 1-golden-path › POST /signin on an existing user - returns a status 200
  ✖ 1-golden-path › GET /notes of new user - returns empty array 
  ✖ 1-golden-path › GET /notes of new user - returns a null error 
  ✖ 1-golden-path › GET /notes of new user - returns a status 200 
  ✖ 1-golden-path › PUT /notes - returns a null error 
  ✖ 1-golden-path › PUT /notes - returns a status 200 
  ✖ 1-golden-path › PUT /notes - returns the note with its content Rejected promise returned by test
  ✖ 1-golden-path › PUT /notes - adds a note Rejected promise returned by test
  ✖ 1-golden-path › PUT /notes - adds a note that has an _id Rejected promise returned by test
  ✖ 1-golden-path › PATCH /notes/:id - returns a null error Rejected promise returned by test
  ✖ 1-golden-path › PATCH /notes/:id - returns a status 200 Rejected promise returned by test
  ✖ 1-golden-path › PATCH /notes/:id - returns the note and its content Rejected promise returned by test
  ✖ 1-golden-path › PATCH /notes/:id - did update the content of the note Rejected promise returned by test
  ✖ 1-golden-path › DELETE /notes/:id - returns a null error Rejected promise returned by test
  ✖ 1-golden-path › DELETE /notes/:id - returns a status 200 Rejected promise returned by test
  ✖ 1-golden-path › DELETE /notes/:id - did delete the note Rejected promise returned by test
ℹ️ Testing API in end-to-end mode.
{ API_URL: 'http://localhost:3000',
  MONGODB_URI: 'mongodb://localhost:27017/notes-api',
  BACKUP_PATH:
   '/Users/adrienjoly/Dev/_eemi-aj/node-note-keeper/tests/setup/../_db_backup' }
^C
 ✘  ~/dev/_eemi-aj/node-note-keeper   master ●  E2E_MODE=true DB_PORT=27017 ava --verbose --serial ./tests/1-golden-path.test.js 

ℹ️ Testing API in end-to-end mode.
{ API_URL: 'http://localhost:3000',
  MONGODB_URI: 'mongodb://localhost:27017/notes-api',
  BACKUP_PATH:
   '/Users/adrienjoly/Dev/_eemi-aj/node-note-keeper/tests/setup/../_db_backup' }
  ✔ POST /signup - returns a token (134ms)
  ✔ POST /signup - returns a null error
  ✔ POST /signup - returns a status 200
  ✔ POST /signin on an existing user - returns a token
  ✔ POST /signin on an existing user - returns a null error
  ✔ POST /signin on an existing user - returns a status 200
  ✖ GET /notes of new user - returns empty array 
  ✖ GET /notes of new user - returns a null error 
  ✖ GET /notes of new user - returns a status 200 
  ✖ PUT /notes - returns a null error 
  ✖ PUT /notes - returns a status 200 
  ✖ PUT /notes - returns the note with its content Rejected promise returned by test
  ✖ PUT /notes - adds a note Rejected promise returned by test
  ✖ PUT /notes - adds a note that has an _id Rejected promise returned by test
  ✖ PATCH /notes/:id - returns a null error Rejected promise returned by test
  ✖ PATCH /notes/:id - returns a status 200 Rejected promise returned by test
  ✖ PATCH /notes/:id - returns the note and its content Rejected promise returned by test
  ✖ PATCH /notes/:id - did update the content of the note Rejected promise returned by test
  ✖ DELETE /notes/:id - returns a null error Rejected promise returned by test
  ✖ DELETE /notes/:id - returns a status 200 Rejected promise returned by test
  ✖ DELETE /notes/:id - did delete the note Rejected promise returned by test

  15 tests failed

  GET /notes of new user - returns empty array

  /Users/adrienjoly/Dev/_eemi-aj/node-note-keeper/tests/1-golden-path.test.js:55

   54:   });                                                                      
   55:   test('returns empty array', (t, res) => t.deepEqual(res.data.notes, []));
   56:   test('returns a null error', (t, res) => t.is(res.data.error, null));    

  Difference:

  - undefined
  + []

  deepEqual (tests/1-golden-path.test.js:55:45)
  tests/setup/common.js:39:12



  GET /notes of new user - returns a null error

  /Users/adrienjoly/Dev/_eemi-aj/node-note-keeper/tests/1-golden-path.test.js:56

   55:   test('returns empty array', (t, res) => t.deepEqual(res.data.notes, []));
   56:   test('returns a null error', (t, res) => t.is(res.data.error, null));    
   57:   test('returns a status 200', (t, res) => t.is(res.status, 200));         

  Difference:

  - undefined
  + null

  is (tests/1-golden-path.test.js:56:46)
  tests/setup/common.js:39:12



  GET /notes of new user - returns a status 200

  /Users/adrienjoly/Dev/_eemi-aj/node-note-keeper/tests/1-golden-path.test.js:57

   56:   test('returns a null error', (t, res) => t.is(res.data.error, null));
   57:   test('returns a status 200', (t, res) => t.is(res.status, 200));     
   58: });                                                                    

  Difference:

  - 403
  + 200

  is (tests/1-golden-path.test.js:57:46)
  tests/setup/common.js:39:12



  PUT /notes - returns a null error

  /Users/adrienjoly/Dev/_eemi-aj/node-note-keeper/tests/1-golden-path.test.js:68

   67:   });                                                                            
   68:   test('returns a null error', (t, { putRes }) => t.is(putRes.data.error, null));
   69:   test('returns a status 200', (t, { putRes }) => t.is(putRes.status, 200));     

  Difference:

  - undefined
  + null

  is (tests/1-golden-path.test.js:68:53)
  tests/setup/common.js:39:12



  PUT /notes - returns a status 200

  /Users/adrienjoly/Dev/_eemi-aj/node-note-keeper/tests/1-golden-path.test.js:69

   68:   test('returns a null error', (t, { putRes }) => t.is(putRes.data.error, null));           
   69:   test('returns a status 200', (t, { putRes }) => t.is(putRes.status, 200));                
   70:   test('returns the note with its content', (t, { putRes }) => t.is(putRes.data.note.conten…

  Difference:

  - 403
  + 200

  is (tests/1-golden-path.test.js:69:53)
  tests/setup/common.js:39:12



  PUT /notes - returns the note with its content

  /Users/adrienjoly/Dev/_eemi-aj/node-note-keeper/tests/1-golden-path.test.js:70

   69:   test('returns a status 200', (t, { putRes }) => t.is(putRes.status, 200));                
   70:   test('returns the note with its content', (t, { putRes }) => t.is(putRes.data.note.conten…
   71:   setup((t, { token }) => { // eslint-disable-line arrow-body-style                         

  Rejected promise returned by test. Reason:

  TypeError {
    message: 'Cannot read property \'content\' of undefined',
  }

  content (tests/1-golden-path.test.js:70:86)
  tests/setup/common.js:39:12



  PUT /notes - adds a note

  /Users/adrienjoly/Dev/_eemi-aj/node-note-keeper/tests/1-golden-path.test.js:75

   74:   });                                                                                       
   75:   test('adds a note', (t, { data }) => t.is(data.notes[0].content, content));               
   76:   test('adds a note that has an _id', (t, { data }) => t.is(typeof data.notes[0]._id, 'stri…

  Rejected promise returned by test. Reason:

  TypeError {
    message: 'Cannot read property \'0\' of undefined',
  }

  test (tests/1-golden-path.test.js:75:45)
  tests/setup/common.js:39:12



  PUT /notes - adds a note that has an _id

  /Users/adrienjoly/Dev/_eemi-aj/node-note-keeper/tests/1-golden-path.test.js:76

   75:   test('adds a note', (t, { data }) => t.is(data.notes[0].content, content));               
   76:   test('adds a note that has an _id', (t, { data }) => t.is(typeof data.notes[0]._id, 'stri…
   77: });                                                                                         

  Rejected promise returned by test. Reason:

  TypeError {
    message: 'Cannot read property \'0\' of undefined',
  }

  test (tests/1-golden-path.test.js:76:68)
  tests/setup/common.js:39:12



  PATCH /notes/:id - returns a null error

  /Users/adrienjoly/Dev/_eemi-aj/node-note-keeper/tests/1-golden-path.test.js:86

   85:     const res = await axios.put(`${t.context.urlPrefix}/notes`, { content: initialContent }…
   86:     const id = res.data.note._id; // eslint-disable-line no-underscore-dangle               
   87:     t.is(res.data.note.content, initialContent);                                            

  Rejected promise returned by test. Reason:

  TypeError {
    message: 'Cannot read property \'_id\' of undefined',
  }



  PATCH /notes/:id - returns a status 200

  /Users/adrienjoly/Dev/_eemi-aj/node-note-keeper/tests/1-golden-path.test.js:86

   85:     const res = await axios.put(`${t.context.urlPrefix}/notes`, { content: initialContent }…
   86:     const id = res.data.note._id; // eslint-disable-line no-underscore-dangle               
   87:     t.is(res.data.note.content, initialContent);                                            

  Rejected promise returned by test. Reason:

  TypeError {
    message: 'Cannot read property \'_id\' of undefined',
  }



  PATCH /notes/:id - returns the note and its content

  /Users/adrienjoly/Dev/_eemi-aj/node-note-keeper/tests/1-golden-path.test.js:86

   85:     const res = await axios.put(`${t.context.urlPrefix}/notes`, { content: initialContent }…
   86:     const id = res.data.note._id; // eslint-disable-line no-underscore-dangle               
   87:     t.is(res.data.note.content, initialContent);                                            

  Rejected promise returned by test. Reason:

  TypeError {
    message: 'Cannot read property \'_id\' of undefined',
  }



  PATCH /notes/:id - did update the content of the note

  /Users/adrienjoly/Dev/_eemi-aj/node-note-keeper/tests/1-golden-path.test.js:86

   85:     const res = await axios.put(`${t.context.urlPrefix}/notes`, { content: initialContent }…
   86:     const id = res.data.note._id; // eslint-disable-line no-underscore-dangle               
   87:     t.is(res.data.note.content, initialContent);                                            

  Rejected promise returned by test. Reason:

  TypeError {
    message: 'Cannot read property \'_id\' of undefined',
  }



  DELETE /notes/:id - returns a null error

  /Users/adrienjoly/Dev/_eemi-aj/node-note-keeper/tests/1-golden-path.test.js:110

   109:     const res = await axios.put(`${t.context.urlPrefix}/notes`, { content }, passToken(tok…
   110:     const id = res.data.note._id; // eslint-disable-line no-underscore-dangle              
   111:     // 2. delete the note                                                                  

  Rejected promise returned by test. Reason:

  TypeError {
    message: 'Cannot read property \'_id\' of undefined',
  }



  DELETE /notes/:id - returns a status 200

  /Users/adrienjoly/Dev/_eemi-aj/node-note-keeper/tests/1-golden-path.test.js:110

   109:     const res = await axios.put(`${t.context.urlPrefix}/notes`, { content }, passToken(tok…
   110:     const id = res.data.note._id; // eslint-disable-line no-underscore-dangle              
   111:     // 2. delete the note                                                                  

  Rejected promise returned by test. Reason:

  TypeError {
    message: 'Cannot read property \'_id\' of undefined',
  }



  DELETE /notes/:id - did delete the note

  /Users/adrienjoly/Dev/_eemi-aj/node-note-keeper/tests/1-golden-path.test.js:110

   109:     const res = await axios.put(`${t.context.urlPrefix}/notes`, { content }, passToken(tok…
   110:     const id = res.data.note._id; // eslint-disable-line no-underscore-dangle              
   111:     // 2. delete the note                                                                  

  Rejected promise returned by test. Reason:

  TypeError {
    message: 'Cannot read property \'_id\' of undefined',
  }
```

- PS: pourquoi votre README est le meme que celui du groupe 3 ? 🤔 
