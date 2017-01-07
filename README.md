# Chriba v2.0
Hovedprosjektet gjekk strålande bra, med toppkarakter (_IT2805_) og fornøgd klient (_Chriba AS_).
No er det påtide å gjere koden meir produksjonsvennleg. Valet datt på å bruke **Angular 2** for klient kode,
og behalde **ExpressJS** som API kode.

Samanlikna med den opprinnelege kildekoden, med vårt eige rammeverk. Forventar vi ved å gå over til stilen av _Single page application_ gjennom Angular 2,
ein betydeleg auke i responsivitet, og ryddigare kode.

## Installering
Krav for oppsett av prosjekt er følgande

1. Ei `_config.json` fil under `bin/config/`, for lagring av `token_secret`, og `mongo_data`
2. Ein køyrande MongoDB Server. (_Autentiseringdetaljar, lokasjon, port, etc. leggast i config fila_)
3. NodeJS >=v7.2.1
4. Installert nyaste Angular cli
5. Installert Nodepakkane i rotmappa og i klientmappa.

## Køyring av applikasjonen
Angular cli gjer det eigentleg kjempelett for deg å køyre ein statisk server.
Men sidan vi vil hovedsakeleg bere måtte køyre ein server (_og sleppe CORS_), må det nok bli litt meir komplisert.

1. Start Mongodb (om ikkje starta enno)
2. Start node (anten gjennom `nodemon`, eller `npm start`)
3. Køyr `npm start` eller `npm run watch` i `client` mappa

Du skal då ha eit program køyrande som vil kompilere TypeScript koden om til JavaScript, og legge dette i mappa `dist/`,
samtidig som node serveren vil gje det alle filene.

## _config.json format
```js
{
  "token_secret": String,
  "mongodb": {
    "db": String, // "Chriba"
    "domain": String, // "localhost"
    "port": Number,
    "username": String | undefined, // "peterJ4cks0n"
    "pwd": String | undefined // "S4cR3t"
  }
}
```