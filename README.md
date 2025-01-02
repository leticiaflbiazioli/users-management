# USERS MANAGEMENT API

This project is a RESTful API that performs CRUD operations on a SQLite database using Node.js, TypeScript, Express and Sequelize.
It allows you to add, edit, list and delete users in a list. The fields for each record are: name (required), email (required and unique), age (optional), active (boolean with default true).
The route for listing all users allows the result to be filtered using query params (_name_ field to filter the name or part of it, _ageMin_ field to return users with age greater than or equal to the provided value and _ageMax_ to filter users with age less than or equal to the provided value).
In the authentication route, the login field to be used is 'login' and the password field is 'password'.
Consoles.error have been added throughout the application to inform about problems during execution.

## Stack

- TypeScript
- Node.js
- Express
- Sequelize
- SQLite

## How to Run the Project

1. Clone the repository.

2. Install the dependencies:

```
npm install
```

3. Add the environment variables to the _.env_ file (the keys were sent by email)

4. Start the server:

```
npm start
```

### Run the Tests

To run the unit tests:

```
npm test
```

## API documentation

Available through the Postman collection sent by email. Within the collection, you will need to set the _token_ and _id_ environment variables.
You can find the _token_ in the response of the login route and the _id_ is the ID of a user in the database that you want to delete, edit or list.

### Routes and endpoints

- POST: /api/login (logs into the application and generates a token valid for 1 hour to access the other routes)

```
curl --request POST \
  --url http://localhost:3000/api/login \
  --data '{
	"login": "login",
	"password": "password"
}'
```

- POST: /api/users (adds a new user)

```
curl --request POST \
  --url http://localhost:3000/api/users \
  --header 'Authorization: Bearer token' \
  --data '{
	"name": "Ana",
	"email": "ana@mail.com",
	"age": 30,
	"active": true
}'
```

- GET: /api/users (lists all users and the search can be filtered by name or age)

```
curl --request GET \
  --url 'http://localhost:3000/api/users?name=Ana&ageMin=30&ageMax=42' \
  --header 'Authorization: Bearer token' \
```

- GET: /api/users/:id (lists a specific user according to its id)

```
curl --request GET \
  --url http://localhost:3000/api/users/1 \
  --header 'Authorization: Bearer token' \
```

- PUT: /api/users/:id (edits a specific user according to its id)

```
curl --request PUT \
  --url http://localhost:3000/api/users/1 \
  --header 'Authorization: Bearer token' \
  --data '{
	"name": "Ana Maria",
	"email": "ana02@gmail.com"
}'
```

- DELETE: /api/users/:id (deletes a specific user according to its id)

```
curl --request DELETE \
  --url http://localhost:3000/api/users/1 \
  --header 'Authorization: Bearer token' \
```
