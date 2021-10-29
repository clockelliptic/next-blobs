import { GetStaticProps } from 'next';

import { BlogGallery, IBlogGalleryProps } from '../../../components/blog/BlogGallery';
import { Meta } from '../../../components/layout/Meta';
import { IBlogPaginationProps } from '../../../components/blog/pagination/Pagination';
import { PostsConfig } from '../../../utils/Config';
// import { getPosts } from '../../api/posts/index';

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

export const getStaticProps: GetStaticProps = async () => {
  /*const posts = await getPosts({
    skip: BigInt(0),
    limit: BigInt(perPage+1) // request an extra post to see if we need another pagination page
  })
  */
  const pagination: IBlogPaginationProps = {};

  // if (posts.length > perPage) pagination.next = `/posts/gallery/2`;

  return {
    props: {
      posts: [], // (posts.length > perPage) ? posts.slice(0,-1) : posts, // remember to remove the extra post
      pagination,
    }
  };
};