import path from 'path';
import nconf from 'nconf';

const env = process.env.NODE_ENV || 'development' // By default development environment is picked

//  1. `process.argv`
//  2. `process.env`
nconf.argv().env()

// 3. Pick up the base configuration
nconf.file(path.join(__dirname, './base_config.json'))

// 4. Override arguments based on environment
nconf.file(path.join(__dirname, `./${env}_env_config.json`))

// 5. Update API Url

const apiUrl = nconf.get('express').protocol + (nconf.get('express').useFqdnForApis ? nconf.get('express').fqdn : nconf.get('express').ipAddress) + ':' + nconf.get('express').port + '/'
nconf.set('express:apiUrl', apiUrl)

//
if (env !== 'development') {

//    console.log("in check");
//
//     nconf.set('express:protocol', process.env.PROTOCOL);
//     nconf.set('express:useFqdnForApis', process.env.USE_FQDN_FOR_APIS);
//     nconf.set('express:fqdn', process.env.FQDN);
//     nconf.set('express:ipAddress', process.env.HOST);
//     nconf.set('express:port', process.env.PORT);

    nconf.set('firebase:account', process.env.FIREBASE_SERVICE_ACCOUNT_JSON_PATH);
    nconf.set('strapi:serverUrl', process.env.STRAPI_SERVER_URL);
    nconf.set('strapi:apiToken', process.env.STRAPI_API_TOKEN);

   // const apiUrl = process.env.PROTOCOL + process.env.HOST + ':' + process.env.PORT + '/';
   // nconf.set('express:apiUrl', apiUrl);
   //
   //  const apiUrl = nconf.get('express').protocol + (nconf.get('express').useFqdnForApis ? nconf.get('express').fqdn : nconf.get('express').ipAddress) + ':' + nconf.get('express').port + '/'
   //  nconf.set('express:apiUrl', apiUrl)


}


module.exports = nconf