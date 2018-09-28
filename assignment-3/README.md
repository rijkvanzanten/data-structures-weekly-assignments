# Assignment 2

> See [the assignment details](https://github.com/visualizedata/data-structures/blob/master/assignments/weekly_assignment_03.md)

* [**Script**](https://github.com/rijkvanzanten/data-structures/blob/master/assignment-3/index.js)
* [**Result**](https://github.com/rijkvanzanten/data-structures/blob/master/assignment-3/output.json)

## Installation & Usage

**Requirements**  
* Node 7.6 or higher

### 1. Clone this repo

```bash
$ git clone https://github.com/rijkvanzanten/data-structures.git
```

### 2. Go to the `assignment-3` folder

```bash
$ cd assignment-3
```

### 3. Install the NPM dependencies

```bash
$ npm install
```

### 4. Add your Texas A&M GeoServices API Key

You can either add a `.env` file to the root of the `assignment-3` folder with the following contents:

```
TAMU_KEY=<your-key>
```

or export it on the CLI directly:

```bash
$ export TAMU_KEY=<your-key>
```

### 5. Run the `index.js` file

```bash
$ node index.js
```

## Problem to solve

For each of the retrieved events from [the previous assignment](../assignment-2), lookup the geolocation (lat/lon) and add them to the array of objects.

## The way I solved it

Texas A&M has a pretty strict limit of the amount of requests you get to play around with. In order to save on the usage, I made a copy of a single result output of the API, so I could use that file to test my data retrieval on.

### Sync vs Async

It was important to me that the script would perform the best it could (no waiting 2 arbitrary seconds per request). It meant that requests would be able to fire in parallel. Firing every request at the same time turned out to be the easiest part of the equation, as I could loop over each address and fire the request. The more involved part is actually waiting until all the requests are done before writing the result to file. I'm creating an array of Promises that I can than wait for using `Promise.all`. This ensures that all Promises are resolved before writing to file. However, this can cause problems if one of the requests doesn't contain the geolocation. Ideally, I want the script to finish and write whatever we got, and save `null` for the geolocations that failed.

By writing a huge amount of existence checks, I was able to save the lat / long if they exist, and default to `null` if they don't:

```js
  const { Latitude, Longitude } = (
    data &&
    data.OutputGeocodes &&
    data.OutputGeocodes &&
    data.OutputGeocodes[0] &&
    data.OutputGeocodes[0].OutputGeocode
  ) || {};

  meeting.address.coordinates = {
    lat: Latitude || null,
    lon: Longitude || null
  };
```

_Sidenote: I can't wait 'til [optional chaining](https://github.com/tc39/proposal-optional-chaining) makes it way into JavaScript_

## What I like to add

This script can take a little while to complete. Right now, it doesn't give any feedback while it's processing the requests. It could be nice to add some sort of progress bar just like you see when installing `npm` dependencies.
