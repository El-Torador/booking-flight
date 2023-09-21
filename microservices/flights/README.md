### FLIGHTS API

## Installation

- Installer les dépendances:

```bash
  yarn
  #or
  npm install
```

- Créer un fichier **.env** et coller:

```sh
  PORT=3000

  HOST=0.0.0.0

  NODE_ENV=development

  APP_KEY=_5uUeOQVcPJ52Pwgp23UjyzDiq-kHEIo

  DRIVE_DISK=local

  REDIS_CONNECTION=local

  REDIS_HOST=127.0.0.1

  REDIS_PORT=6379

  REDIS_PASSWORD=

  DB_URI=http://127.0.0.1:3005

  DATA_STORE_API_KEY="kBxpR0ce1jjBbXPMntTXNo6UykG9GFhG671HhCdSyDo="
```

- Lancer le serveur

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
