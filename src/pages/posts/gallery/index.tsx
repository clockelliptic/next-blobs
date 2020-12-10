import { GetStaticProps } from 'next';

import { BlogGallery, IBlogGalleryProps } from '../../../templates/blog/BlogGallery';
import { Meta } from '../../../layout/Meta';
import { IBlogPaginationProps } from '../../../templates/blog/pagination/Pagination';
import { Main } from '../../../templates/Main';
import { PostsConfig } from '../../../utils/Config';
import { getPosts } from '../../api/posts/index';

const perPage = Number(PostsConfig.pagination_size);

const Index = (props: IBlogGalleryProps) => {
  return (
    <Main
      meta={(
        <Meta
          title={PostsConfig.title}
          description={PostsConfig.description}
        />
      )}
    >
      <BlogGallery posts={props.posts} pagination={props.pagination} />
    </Main>
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
      posts: posts.slice(0,-1), // remember to remove the extra post
      pagination,
    }
  };
};