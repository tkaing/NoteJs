# API HTTP DE GESTION DE NOTES PERSONNELLES

## Introduction

Bienvenue,

Ceci est un projet scolaire.

L'objectif de ce projet est d'écrire et de mettre en production une API HTTP de gestion de notes personnelles. Cette API sera le back-end d'une application mobile et d'une application web.

Ce travail a été effectuer en groupe (Herael et tkaing).

## Installation

- Pour clone le repo git :

  ```git clone https://github.com/tkaing/NoteJs.git```

- Pour lancer l'API en local :

  ```npm start```

- Pour tester l'API, veuillez installer [PostMan](<https://www.getpostman.com/>).

## Déploiement

L'API constitue 4 routes :

- <u>POST /signup</u>

  Cette route permet de créer un compte utilisateur, à partir d'un identifiant et mot de passe choisis par l'utilisateur.

  Le corps de la requête doit contenir :

  - ***username*** : identifiant unique choisi par l'utilisateur.
  - ***password*** : mot de passe choisi par l'utilisateur.

  *Exemple*:

  ​	```{ username : 'test', password : 'testfonc'}```

- <u>POST /signin</u>

  Cette route permet à un utilisateur de se connecter à son compte, en fournissant son identifiant et son mot de passe.

  Le corps de la requête dit contenir :

  - ***username*** : identifiant unique choisi par l'utilisateur.
  - ***password*** : mot de passe choisi par l'utilisateur.

  *Exemple* :

  ​	```{ username : 'test', password : 'test' }```

- <u>GET / notes</u>

  Cette route permet à un utilisateur connecté de lister ses notes, dans l'ordre anti-chronologique de création.

  Le jeton JWT de l'utilisateur connecté doit être fourni dans le header.

- <u>PUT /notes</u></u>

  Cette route permet à un utilisateur connecté d'ajouter une note'.

  Le jeton JWT de l'utilisateur connecté doit être fourni dans le header.

  Le corps de la requête doit contenir :

  - ***content*** : contenu de la note saisi par l'utilisateur

  *Exemple* :

  ​	```{content : 'Salut les amis'}```

- <u>PATCH /notes/:id</u>

  Cette route permet à un utilisateur connecté de modifié une note existante.

  Le jeton JWT de l'utilisateur connecté doit être fourni dans le header.

  Le paramètre *id* doit contenir l'identifiant unique de la note à modifier.

  Le corps de la requête doit contenir :

  - ***content*** : contenu de la note saisie par l'utilisateur. (mise à jour)

  *Exemple* :

  ​	```{ content : 'Salut Benjamin' }```

- <u>DELETE /notes/:id</u>

  Cette route permet à un utilisateur connecté de supprimer une de ses notes.

  Le jeton JWT de l'utilisateur connecté doit être fourni dans le header.

  Le paramètre *id* doit contenir l'identifiant unique de la note à modifier.
