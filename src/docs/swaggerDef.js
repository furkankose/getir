const { version } = require('../../package.json');

const swaggerDef = {
  openapi: '3.0.0',
  info: {
    title: 'Getir API documentation',
    version,
    license: {
      name: 'MIT',
      url: 'https://github.com/furkankose/getir/blob/master/LICENSE',
    },
  },
  servers: [
    {
      url: `/v1`,
    },
  ],
};

module.exports = swaggerDef;
