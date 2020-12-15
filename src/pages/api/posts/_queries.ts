import { gql } from 'apollo-boost'
export function POST_QUERY (slug) {
	return gql`
		query {
			articleCollection (
				where: {slug: "${slug}"}
			) {
				items {
					title
					slug
					publicationDate
					featureImage {
						title
						description
						contentType
						fileName
						size
						url
						width
						height
					}
					content {
						json
					}
					author {
						name
					}
					membersOnly
					excerpt
				} 
			}
		}
	`
}

export function GATED_POST_QUERY (slug) {
	return gql`
		query {
			articleCollection (
				where: {slug: "${slug}"}
			) {
				items {
					title
					slug
					publicationDate
					featureImage {
						title
						description
						contentType
						fileName
						size
						url
						width
						height
					}
					author {
						name
					}
					membersOnly
					excerpt
				} 
			}
		}
	`
}