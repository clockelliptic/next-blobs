import React, { ReactNode } from 'react';

type IContentProps = {
  meta?: ReactNode;
};

const Gated = (props: IContentProps) => (
  <div className="content">
    <h1>This is a gated article. The content has been redacted.... unless you're logged in!</h1>
    <p>Try making an account and logging in to see this content.</p>

    {null /* <style jsx>
      {`
        .content :global(p) {
          @apply my-6;
        }
        .content :global(ul) {
          @apply my-6;
        }
        .content :global(h2) {
          @apply text-2xl font-semibold text-gray-700 my-4;
        }
        .content :global(h3) {
          @apply text-xl font-semibold text-gray-700 my-4;
        }
      `}
    </style>*/}
  </div>
);

export { Gated };