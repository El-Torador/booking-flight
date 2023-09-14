# BOOKING-FLIGHT API ⚙️

API de vente de vol pour la companie K<sup>4</sup> Airline.

# TEAM 🫡

- Jordan KAGMENI (Torador): Lead Dev
- Carlos KODJO: QA
- Andy KOUEKAM: Front Dev
- Eddy KOKO: Front Dev

### STACK 📝

- [Node JS](https://nodejs.org)
- [Adonis JS](https://adonisjs.com)
- [Redis](https://redis.io)
- [Docker](https://www.docker.com)

## Getting started 🚦

### Intallation 🦅

1.  Node JS

Après avoir cloné le projet, rassurer vous d'avoir nodejs installé sur votre machine en tappant cette commande:

```bash
  node --version
  #v16.14.2
```

Si la version de node ne s'affiche pas, je vous invite à la télécharger [ici](https://nodejs.org/en/).

2.  Dépendances

Pour installer les dépendances du projet, tappez cette commande dans votre terminal à la racine du projet:

```bash
  yarn
  #or
  npm install
```

3.  Redis (Requis pour l'authentification API)

Rassurez-vous d'avoir lancer redis sur votre machine. Vous pouvez le faire via Docker. Voir [ici](https://hub.docker.com/_/redis/)

### Configuration 👨‍💻

1.  Création de la base de données

-Créer un fichier JSON dans le dossier **/app/data** et nommer le comme vous le voulez ou utiliser celui défini par défaut.

- Seed des données: Vous pouvez vous inspirer des données dans le fichier par défaut pour définir les données par défaut dans votre base de données comme les flights, les Airports et les Airlines. Ces contrats sont définis dans **/app/DTO**.

2.  Variables d'environnements

- Veuillez créer votre fichier .env à la racine du projet.

- Copiez le contenu se trouvant dans le fichier .env.example et coller le dans votre fichier .env

- Modifiez au besoin les identifiants de connexion propre à votre environnement sans supprimer les autres. Vous pouvez aussi modifier les variables d'environnements du serveur d'application (PORT, HOST, etc...).

3. Lancer le serveur de BD Json (json-server)

```bash
  npx json-server app/data/nom_de_votre_fichier_db.json --watch
```

Pour modifier le port par défaut (3000), vous pouver rajouter le drapeau: **_--port numero_port_**.

Pour plus d'information, cf [docs](https://www.npmjs.com/package/json-server).

### Start App Server 🛜

```bash
#To run development server
  yarn dev
  #or
  npm run dev

#To run tests
  yarn test
  #or
  npm run test

#To build application for production
  yarn build
  #or
  npm run build

#To run production server
  yarn start
  #or
  npm run start
```

### DOCUMENTATION

- Accéder à l'ensemble des routes de l'API: **/docs**

### CLI TIPS 😎

- Lancer le REPL

```bash
  node ace repl
```

- Voir la liste des endpoints

```bash
node ace list:routes
```

- Autres

Pour voir toutes les commandes, tapez:

```bash
  node ace
```

## Author 🤠

- Jordan KAGMENI (Torador)

## License 🤓

OPEN K<sup>4</sup>.
