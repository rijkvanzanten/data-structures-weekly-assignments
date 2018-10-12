# Assignment 5

> See [the assignment details](https://github.com/visualizedata/data-structures/blob/master/assignments/weekly_assignment_05.md)

* [**Script**](https://github.com/rijkvanzanten/data-structures/blob/master/assignment-5/index.js)

## Description

For my dear diary assignment, I'll be creating small posts about cool things I came across online regarding web development and design. 

These posts will be saved in Markdown format in the `./posts` folder. Each Markdown file starts with some YAML frontmatter that allows me to specify some metadata about the specific post.

My data structure can be described visually as follows:

```
slug              (S, PK)
datetime          (S, SORT)
title             (S)
content           (M)
  html            (S)
  raw             (S)
keywords          (SS)
[featured_image]  (S)
```

This structure works better in a NoSQL database (vs SQL) because data is being nested (content), there is a list (keywords), and one column is optional.

### Fun facts:

* By using `new AWS.DynamoDB.DocumentClient();` instead of `new AWS.DynamoDB();`, you don't have to specify the DynamoDB datatypes, as they are automatically inferred from JS.
* `kleur` is Dutch for color
* Progress bar ETA's are actually automated, never knew that! The time remaining is based on the time between increments, nothing else.
* The Markdown in the posts is saved both as raw Markdown as formatted HTML (with syntax highlighting!)
* I might be able to completely get rid of the `DynamoPost` class by sending the YAML data straight to Amazon. This would open up this script to be used by anyone for any MD file. However, having some constraints might not hurt 🤔

## Installation & Usage

**Requirements**  
* Node 7.6 or higher

### 1. Clone this repo

```bash
$ git clone https://github.com/rijkvanzanten/data-structures.git
```

### 2. Go to the `assignment-5` folder

```bash
$ cd assignment-5
```

### 3. Install the NPM dependencies

```bash
$ npm install
```

### 4. Add a `.env` file

The following environment variables are used:

```
AWS_ID=<key>
AWS_KEY=<key>
AWS_REGION=<region>
```

Change these values to your specific database credentials

### 5. Run `npm start`

`npm start` will first run the installer script, which clears the database and sets up the table structure. When that's done, it will run the inserter script, which will insert all the rows.
