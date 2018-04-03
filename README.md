# json-archive
Store posts as JSON and route them through Express

## How it Works

Instead of a database, all of your posts live inside a `data` directory.  Inside this folder are subfolders, one for each archive.

Example:

```
|- data
    |- blog
        |- first-blogpost.json
        |- json-archive-rocks.json
    |- testimonials
        |- john-smith.json
        |- ann-smith.json
```

You may also have a schema directory, which has a sample post of each type to maintain the post-type structure.

## Installation

```
npm i StatelessSoftware/json-archive
```

## Setup

### Data directory

Create your data directory and a couple sample posts, as shown in the How it Works section

### App.js

Add the following to express (this goes under `app.use('/', indexRouter)`)

```
var jsonArchive = new (require("json-archive"));
var archiveRouters = jsonArchive.createRouters("data");

archiveRouters.forEach(archiveRouter => {
    app.use(archiveRouter.archiveName, archiveRouter);
});
```

### Views

You will need 2 views per archive - an archive page and a single page.  The archive page will show a list of all posts in the current archive, and the single page shows a particular post.  They should be named `{archive-folder}-archive.hbs` and `{archive-folder}-single.hbs`.

Important:
- **The name of each view much match the name of the archive folder verbatim**
- **You may need to switch .hbs to whatever template engine you use**

Example:

```
|- data
    ...
|- views
    |- blog-archive.hbs
    |- blog-single.hbs
    |- error.hbs
    |- index.hbs
    |- layout.hbs
    |- testimonials-archive.hbs
    |- testimonials-single.hbs
```

#### Archive

Here is an example archive view (`blog-archive.hbs`)

``` handlebars
<h1>Blog!</h1>
<div>
    {{#each posts}}

        <h2>{{this.title}}</h2>
        <p>{{this.description}}</p>

    {{/each}}
</div>
```

#### Single

And an example single view (`blog-single.hbs`)

``` handlebars
<h1>{{post.title}}</h1>
<p>{{post.description}}</p>
```

## Test

Start your express server, and navigate to it in the browser.  Make sure you can still see the index page and that no errors occur on startup.
Once you successfully see the index page, now navigate to `/blog` (or the name of one of your archives).  You should see the list of blog posts.  Now navigate to `/blog/first-blogpost` - You should see the first blogpost (if you have a blogpost named that saved in the data directory)
