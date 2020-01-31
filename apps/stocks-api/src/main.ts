/**
 * This is not a production server yet!
 * This is only a minimal backend to get started.
 **/
import { Server } from 'hapi';
import * as axios from 'axios'
import { environment } from './environments/environment'

const init = async () => {
  const server = new Server({
    port: 3333,
    host: 'localhost'
  });

  server.route({
    method: 'GET',
    path: '/',
    handler: (request, h) => {
      return {
        hello: 'world'
      };
    }
  });

  server.route({
    method: 'GET',
    path: '/beta/stock/{symbol}/chart/{period}',
    handler: async (request, h) => {
      let symbol = request.params.symbol
      let period = request.params.period
      let res = await axios.default.get(environment.apiURL+'/beta/stock/'+symbol+'/chart/'+period+'?token='+environment.apiKey)
      return res.data;
    },
    options: {
      cache: {
          expiresIn: 1 * 60 * 60 * 1000, //caching for one hour
          privacy: 'private'
        }
    }
  });

  await server.start();
  console.log('Server running on %s', server.info.uri);
};

process.on('unhandledRejection', err => {
  console.log(err);
  process.exit(1);
});

init();
