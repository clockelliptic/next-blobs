import useSWR from 'swr'

import { useState } from 'react'
import { useApollo } from '@dolly/utils/apolloClient'

import { Meta } from '@dolly/components/layouts/Meta';
import { Content } from '@dolly/components/blog/BlogContent';
import { Gated } from '@dolly/components/blog/Gated';

import { POST_QUERY, GATED_POST_QUERY } from '../api/posts/_queries';
import { getPost } from '../api/posts/public';
import { getPosts } from '../api/posts/index';

import { contentRenderOptions } from "@dolly/utils/integrations/contentfulUtils/richTextRenderer";
import { documentToHtmlString } from "@contentful/rich-text-html-renderer";

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
  const initialApolloState = await getPost(context.params.slug)
  return {
    props: {
		...initialApolloState,
		slug: context.params.slug
	},
	revalidate: 1
  };
};

export default function Index ({ slug, gated, initialApolloState, hasContent }) {
	/*
		if the article was gated by the /posts/public api (the getPost function) during static generation
		POST_QUERY will return null on client-side because initialApolloState does not contain the post content
	*/
	const apolloClient = useApollo(initialApolloState)
	const c = apolloClient.readQuery({ query: hasContent ? POST_QUERY(slug) : GATED_POST_QUERY(slug) })
												.articleCollection.items[0];

	const [content, setContent] = useState(extract_content(c)),
		  title = extract_title(c),
		  excerpt = extract_excerpt(c),
		  author = extract_author(c);

	/*
		query the /posts/gated api and let the server validate the user and send data
	*/
	const endpoint = `/api/posts/gated?slug=${slug}`;
	const { data, error } = useSWR(endpoint, () => requestGatedData(endpoint, setContent));

	const InnerContent = ({content}) => (
		<div 
			className="content" 
			dangerouslySetInnerHTML={{
				__html: documentToHtmlString(content, contentRenderOptions)
			}}
		>
		</div>
	);

  return (
		<>
			<Content meta={( <Meta title={title} description={excerpt} /> )}>
				<div className="container">
					<h2>{ title }</h2>
					<p>by { author }</p>
					{	
						content
							? <InnerContent content={content} />
							: <Gated />
					}
				</div>
			</Content>
			<style jsx>{`
				  .content {
						@apply text-secondary-typecolor;
					}
					.content h1 {
						@apply text-primary-typecolor;
						font-size: 1.85em;
						font-weight: 500;
					}
					.content h2 {
						@apply text-primary-typecolor;
						font-size: 1.65em;
						font-weight: 500;
					}
					.content h3 {
						@apply text-primary-typecolor;
						font-size: 1.4em;
						font-weight: 500;
					}
					.content h4 {
						@apply text-primary-typecolor;
						font-size: 1.25em;
						font-weight: 500;
					}
					.content h5 {
						@apply text-primary-typecolor;
						font-size: 1.125em;
						font-weight: 500;
					}
					.content h6 {
						@apply text-primary-typecolor;
						font-size: 1em;
						font-weight: 600;
					}
					.content a {
						@apply text-primary-typecolor;
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
						@apply 
						w-full
						relative
						rounded-xl
						overflow-hidden;
						padding-top: 52.25%;
					}
					@screen md {
						.content .blogImageContainer {
							@apply rounded-xl;
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
		</>
  )
}

async function requestGatedData (url: string, setState) {
		const response = await fetch(url);
		const d = await response.json()
		if (d.content) setState(extract_content(d.content));
		console.log("GATED DATA", d)
		return d
};

function validData (d) {
	return d 
			&& d.articleCollection 
			&& d.articleCollection.items 
			&& d.articleCollection.items[0] 
			&& d.articleCollection.items[0].content
			&& d.articleCollection.items[0].content.json
			&& d.articleCollection.items[0].content.json.content.length;
}

function extract_title (d) {
	return d && d.title 
}

function extract_author (d) {
	return d && d.author
}

function extract_excerpt (d) {
	return d && d.excerpt
}

function extract_content (d) {
	return d && d.content && d.content.json
}