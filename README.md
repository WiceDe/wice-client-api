# Wice CRM API

[![Build Status](https://travis-ci.com/shterion/wice-client-api.svg?token=H7APE9Z98wMSqKwH4sYc&branch=master)](https://travis-ci.com/shterion/wice-client-api) [![License](https://img.shields.io/badge/License-Apache%202.0-blue.svg)](https://opensource.org/licenses/Apache-2.0)
[![Maintenance](https://img.shields.io/badge/Maintained%3F-yes-green.svg)](https://GitHub.com/Naereen/StrapDown.js/graphs/commit-activity)

[Wice CRM](https://wice.de/) is a CRM Software which offers different modules for address management, tasks management, project management, calendars and a knowledge base for knowledge management. The software could be used to manage sales opportunities and offers too. In addition, [Wice CRM](https://wice.de/) offers the possibility to manage and create invoices, open items and incoming payments.

## Before you begin

Before you can use Wice Client API you **must be a registered Wice CRM user**. Please visit the home page of [Wice CRM](https://wice.de/register) to sign up.
> Any attempt to reach [Wice CRM](https://wice.de/) endpoints without registration will not be successful!

## Installation
To install the service locally run `npm install` to install all dependencies and then `npm start`. The service must be accessible on `http://localhost:5000/`

## Authentication

First you have to specify the server, which you are sending your requests to. Then you have to login to receive the cookie. The cookie value has to be set in every request you make.

## Swagger

You could test **Wice Client API** with [Swagger](https://swagger.io/) on [api-docs.wice-net.de](https://api-docs.wice-net.de/).

## Endpoints

At this point of time the API supports the following endpoints:

###### User management
- `​POST /pserv/base/webvis` - it returns a `cookie` if login is successful

###### Person actions
- `GET /plugin/wp_wice_client_api_backend/json` - it returns an array of objects with all persons
- `​POST /plugin/wp_wice_client_api_backend/json` - it returns the new created or updated person or a delete message depending on the selected operation

###### Organization actions
- `GET /plugin/wp_wice_client_api_backend/json` - it returns an array of objects with all organizations
- `​POST /plugin/wp_wice_client_api_backend/json` - it returns the new created or updated organization or a delete message depending on the selected operation

###### Article actions
- `GET /plugin/wp_wice_client_api_backend/json` - it returns an array of objects with all articles
- `​POST /plugin/wp_wice_client_api_backend/json` - it returns the new created or updated article or a delete message depending on the selected operation

## License

Apache-2.0 © [Wice GmbH](https://wice.de/)
