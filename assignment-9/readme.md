# Assignment 9

> You will begin writing sensor data to a database.

> See [the assignment details](https://github.com/visualizedata/data-structures/blob/master/assignments/weekly_assignment_09.md)

## Description

This piece of code will periodically check the particles API for the provided value, and save this value into the Postgres database.

I'm not too sure if this is going to be used in my final assignment, as I need something that can process data way more quickly. (Think 30+ times a second versus once every five minutes).

## Installation & Usage

Clone this repo, `cd` into the `assignment-9` folder and run `npm install` followed by `npm start`.

You'll need to have a `.env` file in the root of the assignment-9 folder with the following keys:

```
DB_HOST=localhost
DB_PORT=5432
DB_NAME=sensor_values
DB_USER=rijk
DB_PASSWORD=1234
PHOTON_ID=1234
PHOTON_TOKEN=abcdef
```

You'll also need to make sure that your Photon will emit an escaped JSON object with the following structure:

```json
{
  "x": 5000,
  "y": 4000,
  "z": 3000
}
```
