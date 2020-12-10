# wink-dolly
  ... as in [Dolly](https://dolly.roslin.ed.ac.uk/facts/the-life-of-dolly/index.html), the first animal ever cloned!


## What is it? 

wink-dolly is a blog boilerplate written with Next.js and Typescript.

Out of the box it is setup to use an external CMS and comes configured with Contentful.js.


Tooling:
- [Next.js](https://nextjs.org/docs)
- [Contentful](https://contentful.com)
- [Typescript](https://www.typescriptlang.org/docs/)
- [RxJS](https://rxjs-dev.firebaseapp.com/guide/overview)
- [Axios](https://github.com/axios/axios) (and [rxios](https://github.com/davguij/rxios))
- [PostCSS](https://postcss.org/) Utilities
  - [tailwindcss](https://tailwindcss.com/docs) + `@apply` directive (utility classes, etc.)
  - [postcss-nested](https://github.com/postcss/postcss-nested) (nested CSS definitions, like SASS)
  - [postcss-simple-vars](https://github.com/postcss/postcss-simple-vars) (SASS-like css variables)
- [PostCSS](https://postcss.org/) Optimizations
  - [purgecss](https://github.com/FullHuman/purgecss) (unused CSS purging)
  - [cssnano](https://github.com/cssnano/cssnano) (stylesheet minification, incl. comment purging)
------------------------------

------------------------------

This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Usage:

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
import someComponent from '@dolly/utils/someComponent'
import Navbar from '@dolly/components/layout/navigation/Navbar'
import Content from '@dolly/components/templates'
```

### Collection / Blog

The Collection boilerplate is configured with `contentful.js`.

The Collection boilerplate has two parts:
1. The API functions located in `src/pages/api/posts`
2. The frontend located in `src/pages/posts`

Suppose we wanted to copy the blog boilerplate because we have a second collection called **news**. To do so, copy `src/pages/api/posts` to `src/pages/api/articles` and copy `src/pages/api/posts` to `src/pages/news`.

Then go into each of `src/pages/new/[slug].tsx`, `src/pages/news/gallery/index.tsx`, and `src/pages/news/gallery/[page].tsx` and change

```
import { getPost } from '../api/posts/public';
import { getPosts } from '../api/posts/index';
```

to 

```
import { getPost } from '../api/articles/public';
import { getPosts } from '../api/articles/index';
```
respectively.

Finally, in `src/pages/api/articles/`, each of `public.js`, `gated.js`, and `index.js` must be changed to use the correct contentful API utility functions.

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

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `pages/index.js`. The page auto-updates as you edit the file.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js/) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/import?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/deployment) for more details.
