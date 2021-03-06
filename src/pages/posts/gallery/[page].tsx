import { GetServerSideProps } from 'next';

import { BlogGallery, IBlogGalleryProps } from '@dolly/components/blog/BlogGallery';
import { Meta } from '@dolly/components/layouts/Meta';
import { IBlogPaginationProps } from '@dolly/components/blog/pagination/Pagination';
import { Main } from '@dolly/components/templates/Main';
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

export const getServerSideProps: GetServerSideProps<IBlogGalleryProps> = async (params) => {
  const page = Number(params.params.page),
        zeroIndexPage = page - 1,
        nextPage = page+1;

  const posts = await getPosts({
    skip: BigInt(zeroIndexPage*perPage),
    limit: BigInt(perPage+1) // request an extra post to see if we need another pagination page
  })
  
  const pagination: IBlogPaginationProps = {};

  if (page > 1) pagination.previous = `/posts/gallery/${page - 1}`;
  if (posts.length > perPage) pagination.next = `/posts/gallery/${nextPage}`;

  return {
    props: {
      posts: posts.slice(0,-1), // remember to remove the extra post
      pagination,
    }
  };
};