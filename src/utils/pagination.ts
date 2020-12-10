export function convertTo2D<T>(arr: T[], size: number) {
	return arr.reduce(
		(acc, x, i) => (i%size===0) 
						? acc.concat([[x]]) 
						: acc.slice(0,-1).concat([...acc.slice(-1), x])
	, [])
}

export function convertUrlToLinkHref(url: string) {
	return (url === '/') ? url : '[page]';
}