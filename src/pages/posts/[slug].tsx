import { GetStaticProps } from 'next';

import { Meta } from '../../layout/Meta';
import { Main } from '../../templates/Main';
import { Content } from '../../templates/Content';
import { getPost } from '../api/posts/public';
import { getPosts } from '../api/posts/index';

const Index = ({ post }) => {
	const d = post.fields;
	console.log("POST OBJECT:", post)
  return (
    <Main
      meta={(
        <Meta
          title={d.title}
          description={d.excerpt}
        />
      )}
    >
			<Content>
				<h2>view console logs to see post object</h2>
				<h2>Post excerpt:</h2><p>{d.excerpt}</p>
			</Content>
    </Main>
  )
}
export default Index;

export async function getStaticPaths() {
	const posts = await getPosts({
			skip: BigInt(0),
			limit: BigInt(100) // request an extra post to see if we need another pagination page
	})
	return {
		paths: posts.map((post) => ({ params: { slug: post.fields.slug } })),
		fallback: true
	};
}

export const getStaticProps = async (context) => {
  const post = await getPost(context.slug)
  
  return {
    props: {
      post
    }
  };
};