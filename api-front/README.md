### API-FRONT

## Installation

- Installer les dépendances:

```bash
  yarn
  #or
  npm install
```

- Créer un fichier **.env** et coller:

```sh
  PORT=3333

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
