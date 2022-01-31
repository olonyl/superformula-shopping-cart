
# SF Shopping Cart

This is an Shopping Cart API which exposes the methods for a basic domian concept, having methods to manage a shopping cart:

- Create a Shopping Cart
- Clean a Shopping Cart
- Add or remove products from the Shopping Cart
- Basic Auth implementation, to Signup and Signin

A user is required since the Shopping Cart methods are protected using JWT.



## Tech Stack

**Server:** Node, Express, knex, Objection

**Data Base:** PostgreSQL


## Dependencies

 - [Nodejs](https://nodejs.org/)
 - [PostgreSQL](https://www.postgresql.org/download/windows/)
 - [Knex](https://knexjs.org/)
 - [Objection](https://vincit.github.io/objection.js/)
 - [Heroku](https://www.heroku.com/)
 - [Swagger](https://swagger.io/)
 - [Express](https://expressjs.com/)
## Run Locally
#### As a pre-requirement, you need to install PostgreSQL and create a database which is going to be used bellow in the environment file.

Clone the project

```bash
  git clone https://github.com/olonyl/superformula-shopping-cart.git
```
Add environment file for development

#### Inside src/config add develpoment.env with the following content
```bash
  PORT= PORT WHERE YOUR APP IS GOING TO RUN
  PSQL_USERNAME= [PG USERNAME]
  PSQL_PASSWORD=[PG PASSWORD]
  DATABASE_NAME=[PG DATABASE]
  JWT_SECRET_KEY=[SECRET KEY TO GENERATE TOKEN]
  EXPIRES_IN=[TOKEN EXPIRATION TIME]
  SERVER_NAME=[PG IP/URL]
```

Go to the project directory

```bash
  cd superformula-shopping-cart
```

Install dependencies

```bash
  npm install
```

Start the server

```bash
  npm run dev
```
Once everything is configured and the database exists, now it's time to create the tables running the following command.

```bash
  npm run db:migrate
```

Now, let's populate the database with some data.

```bash
  npm run db:seeds
```
## Demo

https://superformula-shopping-cart.herokuapp.com/


## Testing the API

#### Tools
https://www.postman.com/downloads/

#### How to?

To use this collectiontion you only need to go to **Postman** and click on the **import** button, click **link** and let's add this URL:

https://www.getpostman.com/collections/a0c8cd9b38397a443ce9


To test the shopping-cart endpoints you need to pass the token generated on **api/auth/signin** through the **Authorization** option.

Refer to this https://learning.postman.com/docs/sending-requests/authorization/#bearer-token

It'll be required to add a variable called **endpoint_url** inside the **Environments** tabs, in this particular case the value we'll assign is the url in the **Demo** section of this file.

## Database Diagram

![image](https://user-images.githubusercontent.com/7118484/151899933-3938bd47-2011-4491-a9b3-257dc254a457.png)

