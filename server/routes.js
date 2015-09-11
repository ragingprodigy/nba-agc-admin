/**
 * Main application routes
 */

'use strict';

var errors = require('./components/errors');

var Agenda = require('agenda'),
    agendaUI = require('agenda-ui'),
    config = require('./config/environment');


var agenda = new Agenda({db: { address: config.mongo.uri }});

module.exports = function(app) {

  app.use('/__agenda-check__', agendaUI(agenda, {poll: 30000}));

    app.get('/s3Upload', require('./api/aws').getS3Policy);

  // Insert routes below
  app.use('/api/branches', require('./api/branch'));
  app.use('/api/bags', require('./api/bag'));
  app.use('/api/sponsors', require('./api/sponsor'));
  app.use('/api/speakers', require('./api/speaker'));
  app.use('/api/sessions', require('./api/session'));
  app.use('/api/members', require('./api/member'));
  app.use('/api/users', require('./api/user'));
  app.use('/api/registrations', require('./api/registration'));
  app.use('/api/invoices', require('./api/invoice'));
  app.use('/auth', require('./api/auth'));
  
  // All undefined asset or api routes should return a 404
  app.route('/:url(api|auth|components|app|bower_components|assets)/*')
   .get(errors[404]);

  // All other routes should redirect to the index.html
  app.route('/*')
    .get(function(req, res) {
      res.sendfile(app.get('appPath') + '/index.html');
    });
};
