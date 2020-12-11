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

## Default Contentful configuration

The default configuration assumes that you have a contentful blog collection with the following content model:

```
{
  "name": "Article",
  "description": "",
  "displayField": "title",
  "fields": [
    {
      "id": "title",
      "name": "Title",
      "type": "Symbol",
      "localized": false,
      "required": true,
      "validations": [],
      "disabled": false,
      "omitted": false
    },
    {
      "id": "slug",
      "name": "Slug",
      "type": "Symbol",
      "localized": false,
      "required": false,
      "validations": [
        {
          "unique": true
        }
      ],
      "disabled": false,
      "omitted": false
    },
    {
      "id": "publicationDate",
      "name": "Publication Date",
      "type": "Date",
      "localized": false,
      "required": false,
      "validations": [],
      "disabled": false,
      "omitted": false
    },
    {
      "id": "membersOnly",
      "name": "Members Only",
      "type": "Boolean",
      "localized": false,
      "required": true,
      "validations": [],
      "disabled": false,
      "omitted": false
    },
    {
      "id": "author",
      "name": "Author",
      "type": "Link",
      "localized": false,
      "required": true,
      "validations": [
        {
          "linkContentType": [
            "author"
          ]
        }
      ],
      "disabled": false,
      "omitted": false,
      "linkType": "Entry"
    },
    {
      "id": "content",
      "name": "Content",
      "type": "RichText",
      "localized": false,
      "required": true,
      "validations": [
        {
          "nodes": {}
        }
      ],
      "disabled": false,
      "omitted": false
    },
    {
      "id": "featureImage",
      "name": "Feature image",
      "type": "Link",
      "localized": false,
      "required": true,
      "validations": [
        {
          "linkMimetypeGroup": [
            "image"
          ]
        }
      ],
      "disabled": false,
      "omitted": false,
      "linkType": "Asset"
    },
    {
      "id": "excerpt",
      "name": "Excerpt",
      "type": "Text",
      "localized": false,
      "required": true,
      "validations": [
        {
          "size": {
            "max": 750
          }
        }
      ],
      "disabled": false,
      "omitted": false
    }
  ],
  "sys": {
    ...
  }
}
```

There are also 3+ additional default data shapes described at the end of this README that can be used to take advantage of other built-in `dolly` utilities found in `src/utils/contentful.ts`.

## Collection / Blog configuration

The Collection boilerplate is configured with `contentful.js`.

The Collection boilerplate has two parts:
1. The API functions located in `src/pages/api/posts`
2. The frontend located in `src/pages/posts`

Suppose we wanted to copy the blog boilerplate because we have a second collection called **news**. This means we want to have 2 blogs on our website: the original blog and a new **news** article blog. To do this, as an example of how to configure `dolly`:

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

### 7. Change the blog API functions to correctly handle the data from this new blog collection

If you just cloned the blog your data collection probably has a different shape than the one that is assumed here.

To do this, change 

## Additional Contentful collection shapes:
Team members:
```
{
  "name": "Team members",
  "description": "",
  "displayField": "name",
  "fields": [
    {
      "id": "name",
      "name": "Name",
      "type": "Symbol",
      "localized": false,
      "required": true,
      "validations": [],
      "disabled": false,
      "omitted": false
    },
    {
      "id": "email",
      "name": "Email",
      "type": "Symbol",
      "localized": false,
      "required": false,
      "validations": [
        {
          "regexp": {
            "pattern": "^\\w[\\w.-]*@([\\w-]+\\.)+[\\w-]+$"
          }
        }
      ],
      "disabled": false,
      "omitted": false
    },
    {
      "id": "role",
      "name": "Role / job title",
      "type": "Symbol",
      "localized": false,
      "required": false,
      "validations": [],
      "disabled": false,
      "omitted": false
    },
    {
      "id": "photo",
      "name": "Profile image",
      "type": "Link",
      "localized": false,
      "required": false,
      "validations": [
        {
          "assetImageDimensions": {
            "width": {
              "min": 250,
              "max": 2048
            },
            "height": {
              "min": 250,
              "max": 2048
            }
          }
        },
        {
          "assetFileSize": {
            "max": 8388608
          }
        }
      ],
      "disabled": false,
      "omitted": false,
      "linkType": "Asset"
    },
    {
      "id": "bio",
      "name": "Biography",
      "type": "Text",
      "localized": false,
      "required": true,
      "validations": [
        {
          "size": {
            "max": 1500
          }
        }
      ],
      "disabled": false,
      "omitted": false
    }
  ],
  "sys": {

    ...

  }
}
```

Reviews:
```
{
  "name": "Reviews",
  "description": "",
  "displayField": "title",
  "fields": [
    {
      "id": "title",
      "name": "Title",
      "type": "Symbol",
      "localized": false,
      "required": true,
      "validations": [
        {
          "size": {
            "min": 2,
            "max": 100
          }
        }
      ],
      "disabled": false,
      "omitted": false
    },
    {
      "id": "blurb",
      "name": "Blurb",
      "type": "Symbol",
      "localized": false,
      "required": true,
      "validations": [
        {
          "size": {
            "min": 2,
            "max": 500
          }
        }
      ],
      "disabled": false,
      "omitted": false
    },
    {
      "id": "profilePhoto",
      "name": "Profile photo",
      "type": "Link",
      "localized": false,
      "required": false,
      "validations": [
        {
          "assetImageDimensions": {
            "width": {
              "min": 160,
              "max": 512
            },
            "height": {
              "min": 160,
              "max": 512
            }
          }
        },
        {
          "assetFileSize": {
            "min": null,
            "max": 2097152
          }
        }
      ],
      "disabled": false,
      "omitted": false,
      "linkType": "Asset"
    },
    {
      "id": "stars",
      "name": "Stars",
      "type": "Integer",
      "localized": false,
      "required": true,
      "validations": [
        {
          "range": {
            "min": 3,
            "max": 5
          },
          "message": "Please only display positive reviews on a scale of 3-5"
        }
      ],
      "disabled": false,
      "omitted": false
    },
    {
      "id": "author",
      "name": "Author",
      "type": "Symbol",
      "localized": false,
      "required": true,
      "validations": [
        {
          "size": {
            "min": null,
            "max": 65
          }
        }
      ],
      "disabled": false,
      "omitted": false
    },
    {
      "id": "date",
      "name": "Review date",
      "type": "Date",
      "localized": false,
      "required": true,
      "validations": [],
      "disabled": false,
      "omitted": false
    }
  ],
  "sys": {
    
    ...

  }
}
```

Ad space:
```
{
  "name": "Ad space",
  "description": "",
  "displayField": "link",
  "fields": [
    {
      "id": "link",
      "name": "Link",
      "type": "Symbol",
      "localized": false,
      "required": true,
      "validations": [
        {
          "regexp": {
            "pattern": "^(ftp|http|https):\\/\\/(\\w+:{0,1}\\w*@)?(\\S+)(:[0-9]+)?(\\/|\\/([\\w#!:.?+=&%@!\\-/]))?$"
          }
        }
      ],
      "disabled": false,
      "omitted": false
    },
    {
      "id": "desktopImage",
      "name": "Desktop image",
      "type": "Link",
      "localized": false,
      "required": true,
      "validations": [
        {
          "assetImageDimensions": {
            "width": {
              "min": 2500,
              "max": 2500
            },
            "height": {
              "min": 500,
              "max": 500
            }
          }
        }
      ],
      "disabled": false,
      "omitted": false,
      "linkType": "Asset"
    },
    {
      "id": "mobileImage",
      "name": "Mobile image",
      "type": "Link",
      "localized": false,
      "required": true,
      "validations": [
        {
          "assetImageDimensions": {
            "width": {
              "min": 940,
              "max": null
            },
            "height": {
              "min": 788,
              "max": null
            }
          }
        }
      ],
      "disabled": false,
      "omitted": false,
      "linkType": "Asset"
    }
  ],
  "sys": {
    
    ...

  }
}
```

Workshops:
```
{
  "name": "Workshops",
  "description": "",
  "displayField": "header",
  "fields": [
    {
      "id": "description",
      "name": "Description",
      "type": "RichText",
      "localized": false,
      "required": false,
      "validations": [],
      "disabled": false,
      "omitted": false
    },
    {
      "id": "header",
      "name": "Header",
      "type": "Symbol",
      "localized": false,
      "required": true,
      "validations": [],
      "disabled": false,
      "omitted": false
    },
    {
      "id": "dateOfEvent",
      "name": "Date of event",
      "type": "Date",
      "localized": false,
      "required": true,
      "validations": [],
      "disabled": false,
      "omitted": false
    },
    {
      "id": "excerpt",
      "name": "Excerpt",
      "type": "Text",
      "localized": false,
      "required": true,
      "validations": [
        {
          "size": {
            "min": 50,
            "max": 448
          }
        }
      ],
      "disabled": false,
      "omitted": false
    },
    {
      "id": "costInCents",
      "name": "Cost (in cents)",
      "type": "Integer",
      "localized": false,
      "required": true,
      "validations": [],
      "disabled": false,
      "omitted": false
    },
    {
      "id": "featureImage",
      "name": "featureImage",
      "type": "Link",
      "localized": false,
      "required": true,
      "validations": [
        {
          "linkMimetypeGroup": [
            "image"
          ]
        }
      ],
      "disabled": false,
      "omitted": false,
      "linkType": "Asset"
    },
    {
      "id": "facilitator",
      "name": "Facilitator",
      "type": "Array",
      "localized": false,
      "required": true,
      "validations": [],
      "disabled": false,
      "omitted": false,
      "items": {
        "type": "Link",
        "validations": [
          {
            "linkContentType": [
              "practitioners"
            ]
          }
        ],
        "linkType": "Entry"
      }
    },
    {
      "id": "inPerson",
      "name": "In person?",
      "type": "Boolean",
      "localized": false,
      "required": true,
      "validations": [],
      "disabled": false,
      "omitted": false
    },
    {
      "id": "slug",
      "name": "Slug",
      "type": "Symbol",
      "localized": false,
      "required": true,
      "validations": [],
      "disabled": false,
      "omitted": false
    },
    {
      "id": "relatedEvent",
      "name": "Related Event",
      "type": "Symbol",
      "localized": false,
      "required": false,
      "validations": [],
      "disabled": false,
      "omitted": false
    }
  ],
  "sys": {
    
    ...

  }
}
```