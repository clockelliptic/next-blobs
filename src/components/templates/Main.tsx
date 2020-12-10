import React, { ReactNode } from 'react';

import Link from 'next/link';

import { Navbar } from '../layout/navigation/Navbar';
import { Config } from '@dolly/utils/Config';

type IMainProps = {
  meta: ReactNode;
  children: ReactNode;
};

const Main = (props: IMainProps) => (
  <div className="antialiased w-full text-gray-700">
    {props.meta}

    <div className="max-w-screen-md mx-auto">
      <div className="border-b border-gray-300">
        <div className="pt-16 pb-8">
          <div className="font-semibold text-3xl text-gray-900">{Config.site_name}</div>
          <div className="text-xl">{Config.description}</div>
        </div>
        <div>
          <Navbar>
            <li className="mr-6">
              <Link href="/">
                <a>Home</a>
              </Link>
            </li>
            <li className="mr-6">
              <Link href="/about/">
                <a>About</a>
              </Link>
            </li>
            <li className="mr-6">
              <Link href="/posts/">
                <a>Blog</a>
              </Link>
            </li>
            <li className="mr-6">
              <a href="https://madebywink.com">;) Wink Digital</a>
            </li>
          </Navbar>
        </div>
      </div>

      <div className="text-xl py-5">{props.children}</div>

      <div className="border-t border-gray-300 text-center py-8">
        Made by
        {' '}
        <span role="img" aria-label="Love">
          ;)
        </span>
        {' '}
        by
        {' '}
        <a href="https://madebywink.com">Wink Digital</a>
      </div>
    </div>
  </div>
);

export { Main };