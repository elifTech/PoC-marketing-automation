# PoC-marketing-automation

# What you can do?
- create, modify, remove profiles
- create lists with different profiles, modify and remove it
- each profile can be added to zero or many lists

## App
App was written in javascript(ecmascript 6).
Created gulp tasks for building and running server.
Created docker images for easy deployment.

## DB
Relations between profiles and lists are stored as a graph in the arangodb. There are edges from profiles to lists.
Arangodb gives us nice query language for finding associations in a graph.
Profiles and lists by themselves are stored as documents in corresponding collections.

## Schema
For schema validation was added jsonschema package.

## UI experience
Created responsive single page application with bootstrap and client routing. Listening for socket notifications.
If someone has updated lists or profiles during your session you will get the latest changes immediately without making any requests.
It is developed with socket.io.
Ui is compiled by babel package.

## Server
Created rest api for profiles and lists. Server emits socket events.

## Technologies
- arangodb (Nosql db for documents and graphs storing)
- node.js (Event-driven I/O server-side JavaScript environment)
- angular (JavaScript framework)
- socket.io (real-time user experience)
- bootstrap (for responsiveness)

## To start project
- install arangoDB https://www.arangodb.com/download/
- node data_layer/initialize.js #initialize db
- npm i
- sudo npm i gulp -g
- bower i
- gulp

## To test
- localhost:5000/api