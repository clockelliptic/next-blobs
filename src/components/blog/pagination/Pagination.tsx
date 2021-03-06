import Link from 'next/link';

import { convertUrlToLinkHref } from '@dolly/utils/pagination';

export type IBlogPaginationProps = {
  previous?: string;
  next?: string;
};

const Pagination = (props: IBlogPaginationProps) => (
  <div className="text-sm flex justify-between">
    {props.previous && (
      <div>
        <Link href={props.previous} as={props.previous}>
          <a>← Newer Posts</a>
        </Link>
      </div>
    )}

    {props.next && (
      <div className="text-right ml-auto">
        <Link href={props.next} as={props.next}>
          <a>Older Posts →</a>
        </Link>
      </div>
    )}
  </div>
);

export { Pagination };