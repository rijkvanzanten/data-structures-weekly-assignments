# Assignment 10

> You will create a web server application in Node.js that will respond to various requests for JSON data

> See [the assignment details](https://github.com/visualizedata/data-structures/blob/master/assignments/weekly_assignment_10.md)

## Installation & Usage

**Requirements**  
* Node 7.6 or higher

### 1. Clone this repo

```bash
$ git clone https://github.com/rijkvanzanten/data-structures.git
```

### 2. Go to the `assignment-10` folder

```bash
$ cd assignment-10
```

### 3. Install the NPM dependencies

```bash
$ npm install
```

### 4. Run the `server.js` file

```bash
$ node server.js
```

## Problem to solve

Create an API endpoint that will return data for your final assignment in a format you can use.

## The way I solved it

I have a lot of experience creating APIs in NodeJS using Express as a webserver, so I decided to try something different. I've never played around with GraphQL and decided this would be a good testbed to give it a spin. 

I found a package called [`PostGraphile`](https://www.graphile.org/postgraphile/) that will connect to a given Postgres DB and open up the data in a GraphQL endpoint `/graphql`. It also includes the [`graphiql`](https://github.com/graphql/graphiql) in browser ID for exploring GraphQL to make it easier to play around with the endpoint. 

I'm not too sure if I'm going to use GraphQL for the actual final assignment, as I'm more comfortable with doing it REST style.
