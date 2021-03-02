import React, { useLayoutEffect, useState } from 'react';
import { format } from 'date-fns';
import Link from 'next/link';
import ParallaxFrame from '../images/ParallaxFrame'
import { Pagination, IBlogPaginationProps } from './pagination/Pagination';
import ImageHoverDistortNoSSR from '@dolly/components/images/ImageHoverDistort/ImageHoverDistortNoSSR'

export type IBlogGalleryProps = {
	posts: PostItems[];
  pagination: IBlogPaginationProps;
  meta: ReactNode;
};

export type PostItems = {
	[key: string]: any;
};

const colors = [
  '#DDFBFBff',
  '#00c8cbff',
  '#3b8ef3ff',
  '#faafd1ff',
  '#ff84b7ff',
  '#ffc627ff',
  '#ee6328ff'
]

const addScrollFadeEffect = (window, elRef) => {
  window.addEventListener('scroll', () => onScroll(window, elRef))
}

const removeScrollFadeEffect = (window, elRef) => {
  window.removeEventListener('scroll', () => onScroll(window, elRef))
}

const BlogGallery = (props: IBlogGalleryProps) => {
  const posts = props.posts.concat(props.posts);

  const [articleRefs, setArticleRefs] = useState(posts.map(x => React.createRef()))
  const [blurbRefs, setBlurbRefs] = useState(posts.map(x => React.createRef()));

  useLayoutEffect(() => {
    articleRefs.forEach(elRef => addScrollFadeEffect(window, elRef));
    blurbRefs.forEach(elRef => addScrollFadeEffect(window, elRef));

    return () => {
      articleRefs.forEach(elRef => removeScrollFadeEffect(window, elRef));
      blurbRefs.forEach(elRef => removeScrollFadeEffect(window, elRef));
    }
  }, []);

	return (<>
    {props.meta}
    <div className="x-wide">
      <div className="flex flex-col">
        <h1 className="page-title">Clockellipic Blog</h1>
        {
          posts.map((post, i) => (
              <article key={`post-${i}`} ref={articleRefs[i]} className={`post-${i} flex-section ${i%2===0 ? ' reverse' : ''}`}>
                <div className="content-container">
                  <div className="half desc">
                    <div ref={blurbRefs[i]} className="blurb">
                      <Link href="/posts/[slug]" as={`/posts/${post.fields.slug}`}>
                        <a className="title"><h2>{ post.fields.title }</h2></a>
                      </Link>
                      <p>{format(new Date(post.fields.publicationDate), 'LLL d, yyyy')}</p>
                    </div>
                  </div>
                  <div className="half img">
                    <div className="photo-frame">
                      <Link href="/posts/[slug]" as={`/posts/${post.fields.slug}`}>
                        <a className="photo">
                          <ParallaxFrame>
                            <ImageHoverDistortNoSSR 
                              img1={ 'https:'+post.fields.featureImage.fields.file.url }
                              img2={ 'https:'+post.fields.featureImage2.fields.file.url }
                            />
                          </ParallaxFrame>
                        </a>
                      </Link>
                    </div>
                  </div>
                </div>
              </article>
          ))
        }
      </div>
    <Pagination previous={props.pagination.previous} next={props.pagination.next} />
    </div>
    
    <style jsx>{`
      .x-wide {
        margin-right: 0;
        margin-left: auto;
      }

      p {
        color: #fff;
        font-size: 1rem;
        text-transform: uppercase;
        font-weight: 600;
      }

      h1.page-title {
        color: #fff;
        font-size: 5.75rem;
        margin: 160px 32px calc(160px - 7.5vh) 128px;
        padding: 0;
        line-height: 4.125rem;
      }

      h2 {
        font-size: 2.5rem;
        color: #fff;
        transition: color 0.15s ease-out;
        margin-bottom: 0;
      }

      ${
        posts.reduce((acc, _, i) => {
          return acc+`
            .post-${i} .blurb:hover h2 {
              color: ${colors[i%colors.length]};
            }
          `
        }, "")
      }

      .flex-section {
        display: flex;
        height: 75vh;
        width: 100%;
      }

      .content-container {
        display: flex;
        width: 100%;
        height: 100%;
        margin-left: 128px;
      }
      .half {
        width: 50%;
        height: 100%;
        padding: 64px;
      }
      .blurb {
        display: flex;
        flex-direction: column;
      }

      .flex-section {
      }

      .half.desc {
        padding-right: 32px;
        display: flex;
        justify-content: center;
        align-items: center;
      }
      .half.desc .blurb {
        align-items: flex-end;
      }
      .half.desc a.title  {
        max-width: 384px;
        text-align: right;
      }
      .half.img {
        padding-left: 0px;
        padding-right: 0px;
        display: flex;
        align-items: center;
      }


      .flex-section.reverse {
      }
      .flex-section.reverse .content-container {
        flex-direction: row-reverse;
      }
      .flex-section.reverse .half.desc {
        padding-right: 128px;
      }
      .flex-section.reverse .half.desc .blurb {
        align-items: flex-start;
      }
      .flex-section.reverse .half.desc a.title  {
        z-index: 10;
        text-align: left;
      }
      .flex-section.reverse.half.img {
        padding-right: 0;
        padding-left: 64px;
      }



      .img {

      }
      .photo-frame {
        position: relative;
        display: flex;
        justify-content: center;
        align-items: center;
        width: 100%;
        height: 60vh;
        overflow: hidden;
        margin-top: auto 0;
      }
      .photo {
        position: relative;
        width: 100%;
        height: 65vh;
      }
    `}</style>
  </>)
}
export { BlogGallery };

function onScroll (window, elRef) {
  const ref = elRef.current;

  if (!ref || !ref.getBoundingClientRect) return;

  const { bottom } = ref.getBoundingClientRect();
  const fadepoint = window.innerHeight/2;
  
  console.log(ref, bottom/fadepoint)

  if (bottom < fadepoint && bottom != 0) {
    ref.style.opacity = bottom/fadepoint;
  } else if (bottom <= 0) {
    ref.style.opacity = 0;
  } else {
    ref.style.opacity = 1;
  }
}