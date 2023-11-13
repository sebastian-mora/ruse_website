import React, { useState, useEffect } from "react";
import style from "./BlogPage.module.css";
import ReactGA from "react-ga";
import { useParams } from "react-router-dom";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { cb } from "react-syntax-highlighter/dist/esm/styles/prism";
import { getBlogBySlug } from "../../api/blogsApi";

const BlogPage = () => {
  const [blog, setBlog] = useState();
  const [errMessage, setError] = useState("");
  const { slug } = useParams();

  useEffect(() => {
    const startTime = new Date();

    getBlogBySlug(slug)
      .then((result) => {
        setBlog(result.data);

        // Track blog pageview
        ReactGA.pageview(`/blogs/${slug}`);

        // Track timing for reading the blog post
        ReactGA.timing({
          category: "Reading Time",
          variable: "Blog Reading",
          value: new Date() - startTime,
        });
      })
      .catch((err) => {
        if (err.response && err.response.status === 404) {
          setError("Blog not Found");
        }
      });
  }, [slug]);

  const NodeRenderer = {
    code({ node, inline, className, children, ...props }) {
      const match = /language-(\w+)/.exec(className || "");
      return !inline && match ? (
        <SyntaxHighlighter
          children={String(children).replace(/\n$/, "")}
          style={cb}
          customStyle={{ backgroundColor: "#080717" }}
          language={match[1]}
          PreTag="div"
          wrapLines={true}
          wrapLongLines={true}
          {...props}
        />
      ) : (
        <code className={className} {...props}>
          {children}
        </code>
      );
    },

    img({ node, inline, className, children, ...props }) {
      return (
        <a href={props.src} target="_blank" rel="noopener noreferrer">
          <img alt="" src={props.src} />
        </a>
      );
    },
  };

  return (
    <div>
      {blog ? (
        <>
          <div className={style.titleContainer}>
            <div className={style.title}>
              <h1>{blog.metadata.title}</h1>
            </div>
            <div className={style.date}>{blog.metadata.dateposted}</div>
          </div>
          <ReactMarkdown
            children={blog.blog}
            components={NodeRenderer}
            className={style.post}
            remarkPlugins={[remarkGfm]}
          />
        </>
      ) : (
        <div className={style.title}>
          <h1>{errMessage}</h1>
        </div>
      )}
    </div>
  );
};

export default BlogPage;
