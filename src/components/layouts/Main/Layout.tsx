import Router, { useRouter } from 'next/router'
import { useState } from 'react'

import { Meta } from '../Meta'
import { Config } from '@dolly/utils/Config'
import { UserProvider } from '@dolly/utils/integrations/auth/user';

import HomeLayout from '../Home/HomeLayout/HomeLayout'
import BlogLayout from '../Blog/BlogLayout'


const Layout = ({ user, loading = false, children }) => {
	const router = useRouter()

	const [ currentPath, setCurrentPath ] = useState(router.pathname);

	Router.events.on('routeChangeComplete', (url) => setCurrentPath(url))

	const layouts = [
		{
			predicate: (p) => p==="" || p==="/",
			component: <HomeLayout>{ children }</HomeLayout>
		},
		{
			predicate: (p) => p.includes("/posts") || p.includes("/posts/gallery"),
			component: <BlogLayout>{ children }</BlogLayout>
		}
	]

	const currentLayout = (path) => layouts.reduce((acc, x) => x.predicate(path) ? x.component : acc, layouts[0].component)

  return (
    <UserProvider value={{ user, loading }}>
      <Meta
          title={Config.site_name}
          description={Config.description}
      />
      
    { currentLayout(currentPath) }

    </UserProvider>
  );
}
export default Layout;