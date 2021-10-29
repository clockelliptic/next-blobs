import React, { ReactNode } from 'react';

import { format } from 'date-fns';
import Link from 'next/link';

import { Pagination, IBlogPaginationProps } from './pagination/Pagination';

export type IBlogGalleryProps = {
	posts: PostItems[];
  pagination: IBlogPaginationProps;
  meta: ReactNode;
};

export type PostItems = {
	[key: string]: any;
};

const BlogGallery = (props: IBlogGalleryProps) => {
	return (<>
  
    {null /* <style jsx>{`
      .container.x-wide {
        max-width: 60rem;
      }
      .link-container {
        display: flex;
        text-decoration: none;
        margin-bottom: 4rem;
      }
      .link-image {
        width: 320px;
        height: auto;
        border-radius: 2rem;
        object-fit: cover;
      }
      .link-content {
        margin-left: 1rem;
        text-decoration: none;
      }
    `}</style> */}
    
    {props.meta}
    <div className="container x-wide">
      <div className="flex flex-col">
        {props.posts.map((post) => (
          <div key={`${post.fields.slug}-${Math.floor(Math.random()*10000)}`} className="mb-3 flex justify-between">
            <Link href="/posts/[slug]" as={`/posts/${post.fields.slug}`}>
              <a className="link-container">
                <img 
                  className="link-image"
                  src={post.fields.featureImage.fields.file.url} 
                  alt={post.fields.featureImage.fields.title} 
                />
                <div className="link-content">
                    <h2>{post.fields.title}</h2>
                    <p>{post.fields.excerpt}</p>
                  <div>{ post.fields.author } - {format(new Date(post.fields.publicationDate), 'LLL d, yyyy')}</div>
                </div>
              </a>
            </Link>
          </div>
        ))}
      </div>
    <Pagination previous={props.pagination.previous} next={props.pagination.next} />
    </div>
  </>)
}
export { BlogGallery };