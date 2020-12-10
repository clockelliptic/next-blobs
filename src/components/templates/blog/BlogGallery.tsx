import React from 'react';

import { format } from 'date-fns';
import Link from 'next/link';

import { Pagination, IBlogPaginationProps } from './pagination/Pagination';

export type IBlogGalleryProps = {
	posts: PostItems[];
  pagination: IBlogPaginationProps;
};

export type PostItems = {
	[key: string]: any;
};

const BlogGallery = (props: IBlogGalleryProps) => {
	console.log("blogGallery", props)
	return (<>
    <ul>
      {props.posts.map((post) => (
        <li key={post.fields.slug} className="mb-3 flex justify-between">
          <Link href="/posts/[slug]" as={`/posts/${post.fields.slug}`}>
            <a>
              <h2>{post.fields.title}</h2>
            </a>
          </Link>

          <div>{format(new Date(post.fields.publicationDate), 'LLL d, yyyy')}</div>
        </li>
      ))}
    </ul>

    <Pagination previous={props.pagination.previous} next={props.pagination.next} />
  </>)
}
export { BlogGallery };