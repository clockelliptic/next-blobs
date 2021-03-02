import Header from './BlogHeader';
import Footer from './BlogFooter'

const BlogLayout = ({ children }) => {
    return (<>
    
		<Header />
        <main>
          <div>{children}</div>
        </main>
        <Footer />
  
        <style jsx global>{`
            body {
                margin: 0;
                color: #333;
                background: #012021;
            }
            main {
                position: relative;
            }
        `}</style>
    </>);
  }
  export default BlogLayout;