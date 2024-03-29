# Assignment 2

> See [the assignment details](https://github.com/visualizedata/data-structures/blob/master/assignments/weekly_assignment_02.md)

* [**Script**](https://github.com/rijkvanzanten/data-structures/blob/master/assignment-2/index.js)
* [**Result**](https://github.com/rijkvanzanten/data-structures/blob/master/assignment-2/output.json)

## Installation & Usage

**Requirements**  
* Node 7.6 or higher

### 1. Clone this repo

```bash
$ git clone https://github.com/rijkvanzanten/data-structures.git
```

### 2. Go to the `assignment-2` folder

```bash
$ cd assignment-2
```

### 3. Install the NPM dependencies

```bash
$ npm install
```

### 4. Run the `index.js` file

```bash
$ node index.js
```

**Bonus**:  
You can also run the program with arguments to override the default input / output file paths. This allows you to use the same code for all the downloaded files from assignment-1:

```bash
$ node index.js ../assignment-1/data/m09.html output-09.json
```

## Problem to solve

Read one of the files created by [assignment-1](../assignment-1/) (in my case file `m08`) and convert the HTML into a usable format.

## The way I solved it

I chose to save the data as a JSON file. That way, I can easily read the file from JS (or any other language for that matter) again when I need to. (I heavily suspect we have to use said file in the upcoming assignment(s)).

The HTML is super annoying to read out, seeing that the HTML is very badly structured. I had to rely on a lot of RegExes to get the data I wanted.

### On Cheerio vs JSDOM

I chose to replace `cheerio` in the example code with JSDom. I'm personally of the camp that [You Might Not Need jQuery](http://youmightnotneedjquery.com) so I've been steering clear of it for most of my web projects. Seeing I'm more familiar with the native browser DOM APIs, I like to use the same methods on the server, which is why I use JSDom instead.

### Modules

I chose to extract as much information from the HTML page as I could, but seeing that there are quite a few different sections of data (hours, location, title, etc), I had a lot of code to extract each of those. To keep the main `index.js` file a little cleaner, I turned all those "getters" into modules.

## What I learned

I'd never really had the need to rely so much on RegEx statements. This assignment was a perfect chance for me to dive into how they work. Who could've thought that `/[0-9]{1,2}:[0-9]{2}\s(PM|AM)/g` would actually do something useful!

I also re-used and strengthened what I learned from the first assignment in terms of documentation and using async/await.

