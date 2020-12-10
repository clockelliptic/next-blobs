import { GetStaticProps } from 'next';

import { Meta } from '@dolly/components/layout/Meta';
import { Main } from '@dolly/components/templates/Main';
import { Content } from '@dolly/components/templates/Content';
import { getPost } from '../api/posts/public';
import { getPosts } from '../api/posts/index';

import { contentRenderOptions } from "@dolly/utils/integrations/contentfulUtils";
import { documentToHtmlString } from "@contentful/rich-text-html-renderer";

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
				<div 
					className="content" 
					dangerouslySetInnerHTML={{
						__html: documentToHtmlString(post.fields.content, contentRenderOptions)
					}}
				>
				</div>
			</Content>
			<style jsx>{`
				  .content {
						@apply text-secondary;
					}
					.content h1 {
						@apply text-primary;
						font-size: 1.85em;
						font-weight: 500;
					}
					.content h2 {
						@apply text-primary;
						font-size: 1.65em;
						font-weight: 500;
					}
					.content h3 {
						@apply text-primary;
						font-size: 1.4em;
						font-weight: 500;
					}
					.content h4 {
						@apply text-primary;
						font-size: 1.25em;
						font-weight: 500;
					}
					.content h5 {
						@apply text-primary;
						font-size: 1.125em;
						font-weight: 500;
					}
					.content h6 {
						@apply text-primary;
						font-size: 1em;
						font-weight: 600;
					}
					.content a {
						@apply text-primary;
						font-size: 1em;
						font-weight: 400;
					}
					.content a:hover {
						@apply underline;
					}
					.content pre {
						background-color: #f9f9f9;
						box-shadow: inset 1px 1px 5px rgba(0, 0, 0, 0.05);
						padding: 0.5em;
						border-radius: 2px;
						overflow-x: auto;
					}
					.content pre code {
						background-color: transparent;
						padding: 0;
					}
					.content ul {
						list-style: disc inside;
					}
					.content ol {
						list-style: decimal inside;
					}
					.content li p {
						display: inline-block;
					}
					.content ol p {
						display: inline-block;
					}
					.content blockquote p {
						font-size: 1.25rem;
						@apply font-medium
							my-4;
					}
					.content .blogImageContainer {
						@apply w-full
										relative
										rounded-brand-mobile
										overflow-hidden;
						padding-top: 52.25%;
					}
					@screen md {
						.content .blogImageContainer {
							@apply rounded-brand;
						}
					}
					.content .blogImage {
						@apply w-full
										absolute
										transform
										-translate-x-1/2
										-translate-y-1/2;
						top: 50%;
						left: 50%;
					}
			`}</style>
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
  const post = await getPost(context.params.slug)
  console.log("CONTEXT", context.params.slug)
  return {
    props: {
      post
    }
  };
};