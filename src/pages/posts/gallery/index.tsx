import { GetStaticProps } from 'next';

import { BlogGallery, IBlogGalleryProps } from '@dolly/components/blog/BlogGallery';
import { Meta } from '@dolly/components/layout/Meta';
import { IBlogPaginationProps } from '@dolly/components/blog/pagination/Pagination';
import { Main } from '@dolly/components/layout/Layout';
import { PostsConfig } from '@dolly/utils/Config';
import { getPosts } from '../../api/posts/index';

const perPage = Number(PostsConfig.pagination_size);

const Index = (props: IBlogGalleryProps) => {
  
  return (
    <BlogGallery 
      posts={props.posts} 
      pagination={props.pagination} 
      meta={(
        <Meta
          title={PostsConfig.title}
          description={PostsConfig.description}
        />
      )}
    />
  )
}
export default Index;

export const getStaticProps: GetStaticProps<IBlogGalleryProps> = async (params) => {
  const posts = await getPosts({
    skip: BigInt(0),
    limit: BigInt(perPage+1) // request an extra post to see if we need another pagination page
  })
  
  const pagination: IBlogPaginationProps = {};

  if (posts.length > perPage) pagination.next = `/posts/gallery/2`;

  return {
    props: {
      posts: (posts.length > perPage) ? posts.slice(0,-1) : posts, // remember to remove the extra post
      pagination,
    }
  };
};