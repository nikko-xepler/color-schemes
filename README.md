# color-schemes

A node application for creating, editing, and exporting color schemes.



## Local Installation

When running locally, it is recommended to use `node-foreman` to load an `.env`
file into `process.env` in order to simulate a production environment.

To install `node-foreman`, run the following from the command line:

```
npm install -g foreman
```

Depending on your operating system, you may need to run the command as sudo to
allow for npm to install globally:

```
sudo npm install -g foreman
```

-----------

Once `node-foreman` is installed, you can start the local server with:

```
nf run node index.js
```



## Future Todos

- [ ] Include either [colorspaces.js](https://github.com/boronine/colorspaces.js) or [color-space](https://github.com/scijs/color-space)
  - More human-friendly filtering and sorting
  - Better measurement of contrast for accessibility
- [ ] Set up a schema for storing colors and/or sets of colors
- [ ] Flesh out the API endpoints for:
  - [ ] Uploading images to extract colors from
  - [ ] CRUD for colors
  - [ ] CRUD for color schemes (has many colors)
  - [ ] Comparing colors and/or color sets
  - [ ] Exporting color sets (for SCSS, SASS, Swift, etc.)
- [ ] Make a sweet interface
