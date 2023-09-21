### EXTERNAL API

### Installation

- Installer les dépendances:

```bash
  yarn
  #or
  npm install
```

- Créer un fichier **.env** et coller:

```sh
  PORT=8080
  HOST=0.0.0.0
  NODE_ENV=development
  APP_KEY=O2cv1Y1zMfMSBr_mmdq5Ktjz_46RV6pt
  DRIVE_DISK=local
  API_CURRENCY=http://localhost:3030/api/v1/currencies
  API_BOOKING=http://localhost:3030/api/v1/bookings
  API_KEY_BOOKING=vZX_KcLjDnt2LBF1DI5NqGkHnEqxa0oE
  API_FLIGHT=http://localhost:3000/api/v1/flights
  API_KEY_FLIGHT=_5uUeOQVcPJ52Pwgp23UjyzDiq-kHEIo

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

### ROUTES

une documentation swagger accessible via **/docs**.

### FILTRES ROUTES

1. Filtres Pagination

- /flights et /bookings:

```sh
  curl --request GET \
    --url http://127.0.0.1:8080/api/v1/flights?page={page}&limit={limit} \
    --header 'K4-API-KEY: __YOUR_API_KEY__'

  curl --request GET \
    --url http://127.0.0.1:8080/api/v1/bookings?page={page}&limit={limit} \
    --header 'K4-API-KEY: __YOUR_API_KEY__'
```

- Filtrer les bookings par email

```sh
  curl --request GET \
    --url http://127.0.0.1:8080/api/v1/bookings?email={email} \
    --header 'K4-API-KEY: __YOUR_API_KEY__'
```

Vous pouvez combiner les filtres pagination et email en suivant les règles [queryString](https://en.wikipedia.org/wiki/Query_string).
