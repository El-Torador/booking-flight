### BOOKINGS API

## Installation

- Installer les dépendances:

```bash
  yarn
  #or
  npm install
```

- Créer un fichier **.env** et coller:

```sh
  PORT=3030

  HOST=0.0.0.0

  NODE_ENV=development

  APP_KEY=vZX_KcLjDnt2LBF1DI5NqGkHnEqxa0oE

  DRIVE_DISK=local

  CURRENCY_API="https://www.ecb.europa.eu/stats/eurofxref/eurofxref-daily.xml"

  DB_URI=http://localhost:3005

  DISCOUNT_QTE_TICKET_COND=10

  DISCOUNT_QTE_TICKET_PERCENT=0.05

  COST_PER_MORE_LUGGAGES=100

  REDIS_CONNECTION=local

  REDIS_HOST=127.0.0.1

  REDIS_PORT=6379

  REDIS_PASSWORD=

  API_FLIGHT=http://localhost:3000/api/v1/flights

  API_KEY_FLIGHT=_5uUeOQVcPJ52Pwgp23UjyzDiq-kHEIo

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
