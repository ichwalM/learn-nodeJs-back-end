import { server as _server } from '@hapi/hapi';
import routes from './routers/Routes';

const init = async () => {
    const server = _server({
        port: 5000,
        host: 'localhost',
    });

    server.route(routes);

    await server.start();
    console.log(`Server berjalan pada ${server.info.uri}`);
}

init();