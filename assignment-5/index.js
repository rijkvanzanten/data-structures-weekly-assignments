// Node's filesystem helpers
const fs = require("fs");

// Amazon AWS
const AWS = require("aws-sdk");

// Syntax highlighter that will be used in the markdown formatter
const hljs = require("highlight.js");

// Extract the YAML front matter from the .md files
const matter = require("gray-matter");

// Run an array of functions in series, comparable to async.eachSeries
const series = require("run-series");

// Used to display a progress bar in the CLI. So pretty!
const { Bar, Presets } = require("cli-progress");

// Have some colors in the console output
const kleur = require("kleur");

// Markdown formatter + config
const md = require("markdown-it")({
  highlight(str, lang) {
    if (lang && hljs.getLanguage(lang)) {
      try {
        return hljs.highlight(lang, str).value;
      } catch (err) {}
    }

    return "";
  }
});

// Load in the .env file and map the values to process.env
require("dotenv").config();

// Setup AWS creds
AWS.config = new AWS.Config();
AWS.config.accessKeyId = process.env.AWS_ID;
AWS.config.secretAccessKey = process.env.AWS_KEY;
AWS.config.region = process.env.AWS_REGION;

/**
 * By using DocumentClient instead of the raw DynamoDB, we don't have to
 * manually provide the DynamoDB data types
 */
const db = new AWS.DynamoDB.DocumentClient();

class DynamoPost {
  constructor({ data, content }) {
    const { slug, title, keywords, featured_image, datetime } = data;

    this.slug = slug;
    this.title = title;

    this.datetime = datetime;

    this.content = {
      raw: content,
      html: md.render(content)
    };

    if (keywords) {
      this.keywords = keywords.split(",").map(str => str.trim());
    }

    if (featured_image) {
      this.featured_image = featured_image;
    }
  }
}

const bar = new Bar(
  {
    format: "[{bar}] {percentage}% | ETA: {eta}s | {value}/{total}"
  },
  Presets.shades_classic
);

// Get the filenames of all the files in the posts folder so we can loop over them
const fileNames = fs.readdirSync("./posts");

bar.start(fileNames.length, 0);

// Convert every file in ./posts to a "saveable" object
const posts = fileNames.map(
  fileName => new DynamoPost(matter(fs.readFileSync("./posts/" + fileName)))
);

series(
  // Convert each post to a function that saves the post to the DB
  posts.map(post => cb => {
    db.put({ TableName: "deardiary", Item: post }, err => {
      if (err) console.log(err);
    });

    // Only save one post per 2 seconds to prevent having to pay Amazon
    setTimeout(() => {
      bar.increment();
      cb(null);
    }, 2000);
  }),

  () => {
    bar.stop();
    console.log(`

${kleur.green("Successfully")} saved ${kleur.blue(fileNames.length)} posts to ${kleur.yellow("Amazon DynamoDB")} 🎉

    `);
  }
);
