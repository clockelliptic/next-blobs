# wink-dolly
  ... as in [Dolly](https://dolly.roslin.ed.ac.uk/facts/the-life-of-dolly/index.html), the first animal ever cloned!


## What is it? 

wink-dolly is a blog boilerplate written with Next.js and Typescript.

Out of the box it is setup to use an external CMS and comes configured with Contentful.js.


Essential Tooling:
- [Next.js](https://nextjs.org/docs)
- [Contentful](https://contentful.com)
- [Typescript](https://www.typescriptlang.org/docs/)
- [PostCSS](https://postcss.org/) Utilities
  - [tailwindcss](https://tailwindcss.com/docs) + `@apply` directive (utility classes, etc.)
- [PostCSS](https://postcss.org/) Optimizations
  - [purgecss](https://github.com/FullHuman/purgecss) (unused CSS purging)
  - [cssnano](https://github.com/cssnano/cssnano) (stylesheet minification, incl. comment purging)

Non-critical bonus utilities:
- [RxJS](https://rxjs-dev.firebaseapp.com/guide/overview)
- [Axios](https://github.com/axios/axios) (and [rxios](https://github.com/davguij/rxios))
- [PostCSS](https://postcss.org/) Utilities
  - [postcss-nested](https://github.com/postcss/postcss-nested) (nested CSS definitions, like SASS)
  - [postcss-simple-vars](https://github.com/postcss/postcss-simple-vars) (SASS-like css variables)

------------------------------

## Environment configuration

There are two environment files:

1. `.env` (copy and rename `.env.sample`)
2. `.env.local` (copy and rename `.env.local.sample`)

`.env` contains environment variables for a local script that uses the COntentful management API to automatically create Contentful Typescript types. These types are meant to help development with better type hints and better error catching.

`.env.local` contains environment variables that your `next.js` application server uses. These are used on the front-end, should only contain public keys, and should **not** contain any management keys.

At a minimum you need Contentful keys unless you refactor the app to use another CMS / data source. You may also use keys for other integrations you choose to use, such as Auth0, Stripe, MongoDB, etc.).

## Local modules:

### Utils

The `src/utils` directory can be imported as a module like so:

```
import someUtility from '@dolly/utils/someUtility'
import { Config } from '@dolly/utils/Config'
import contentfulUtils from '@dolly/utils/contentfulUtils'
```

To explore what utilities are available check out `src/utils`.

### Components

Similar to utils, `src/components` is available as a module:

```
import someComponent from '@dolly/components/someComponent'
import Navbar from '@dolly/components/layout/navigation/Navbar'
import Content from '@dolly/components/templates'
```

### Types

Note that these will change if you define your own Contentful Typescript types. See below for instructions.

```
import { IArticle, IAdSpace, ITeamMembers } from `@dolly/types/contentful`
```

## Default Contentful Typescript types

The default configuration comes with some default Typscript types for a Contentful data model. These can be imported with `@dolly/types/contentful` and are found in `src/utils/contentful.ts`.

## Defining Typescript types for your own blogs/collections

Check out `contentful-typescript-codegen` [here](https://developer.aliyun.com/mirror/npm/package/contentful-typescript-codegen).

Once you configure your environment files and run the `contentful-typescript-codegen` script, you'll find your newly generated Contentful Typescript type definitons in `src/types/contentful.js`. Note that this will completely overwrite the contentful type definitions.

## Collection / Blog configuration

The Blog boilerplate is configured to use the official `contentful.js` package to fetch data/content from Contentful.

The Blog boilerplate has two parts:
1. The API functions located in `src/pages/api/posts` (which are built on `contentful.js`)
2. The frontend located in `src/pages/posts`

As an example, suppose we wanted to copy and reconfigure the blog boilerplate for anther Contentful collection called **news**. This means we would have 2 blogs on our website: the original blog and a new **news** article blog. 

To do this, as an example of how to configure `dolly` for your website/app:

### 1. Copy `src/pages/api/posts` to `src/pages/api/articles` and copy `src/pages/api/posts` to `src/pages/news`.

### 2. Change `import { getPost } from '../api/posts/public'` to `import { getPost } from '../api/articles/public'` in each of...

1. `src/pages/new/[slug].tsx`
2. `src/pages/news/gallery/index.tsx`
3. `src/pages/news/gallery/[page].tsx` 

### 3. In these three files, also change `import { getPosts } from '../api/posts/index'` to `import { getPosts } from '../api/articles/index'`

### 4. Next, in `src/pages/api/articles/`, each of `public.js`, `gated.js`, and `index.js` must be changed to use the correct contentful API utility functions.

  For example, in the original `posts` collection API, if we look at `src/pages/api/posts/public.ts` we'll see 

  ```
  const { getArticles } = require('@dolly/utils/integrations/contentful').public;
  ```

  In order to query contentful for the **news** collection, we need to go to `src/utils/integrations/contentful.ts` and create a new utility function `getNewsArticle`. Notice that dolly also comes packaged with a few more query utilities:

  ```
  module.exports = {
      public: contentfulUtilities(),
      private: __contentfulUtilities(),
  }
    
  ...

  function contentfulUtilities() {
    return {
      getTeammates: getItems("teamMembers"),
      getArticles: getItems("article"),
      getReviews: getItems("reviews"),
      getAdverts: getItems("adSpace"),
    }
  }

  function __contentfulUtilities() {
    return {
      __getItems: getItems,
      __getItem: getItem
    }
  }

  ...
  ```

  You will also notice two factory functions, `getItems` and `getItem` which can be used to build new contentful query functions.

### 5. Update the API functions located in `src/pages/api/articles` to handle the shape of the new blog data.

### 6. Permanently redirect the new blog's root path to the blog gallery root in `next.config.js`:

```
module.exports = withBundleAnalyzer({
	async redirects() {
		return [
		  {
            source: '/posts/',
            destination: '/posts/gallery/',
            permanent: true,
		  },
          { // ADD THIS OBJECT
            source: '/news/',
            destination: '/news/gallery/',
            permanent: true,
          }
		]
	},

	...

	},
});
```

### 7. Finally, configure and style the frontend pages for the new collection pages and indexes.