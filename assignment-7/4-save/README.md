# Assignment 4

## Installation & Usage

**Requirements**  
* Node 7.6 or higher

### 1. Install the NPM dependencies

```bash
$ npm install
```

### 2. Add a `.env` file

The following environment variables are used:

```
host=localhost
user=postgres
database=data-structures
password=root
port=5432
```

Change these values to your specific database credentials

### 3. Run `npm start`

`npm start` will first run the installer script, which clears the database and sets up the table structure. When that's done, it will run the inserter script, which will insert all the rows.
