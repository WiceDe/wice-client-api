# Wice CRM API

[Wice CRM](https://wice.de/) is a CRM Software which offers different modules for address management, tasks management, project management, calendars and a knowledge base for knowledge management. The software could be used to manage sales opportunities and offers too. In addition, [Wice CRM](https://wice.de/) offers the possibility to manage and create invoices, open items and incoming payments.


## Before you begin

Before you can use our API you **must be a registered Wice CRM user**. Please visit the home page of [Wice CRM](https://wice.de/) to sign up.
> Any attempt to reach [Wice CRM](https://wice.de/) endpoints without registration will not be successful!

After you are already registered in [Wice CRM](https://wice.de/) you have to generate your **API Key**.
> For activation you **have to be logged in**, then click of ``Admin`` and under ```Plugins``` click of ``Wice OIH backend``. Once you are in click the button ``Create new`` to generate your API key.

![Administration](assets/Plugins.png)
***
![APIKey](assets/APIKey.png)

Once the activation is done you have an access to **API Key** which is required for an authentication when you make a request to [Wice CRM](https://wice.de/).

## Authentication

After you are successfully logged in, you receive a `cookie` which you have to send in the header as `wice-cookie` and don't forget to send your `APIKey` as `X-API-KEY` as well.
