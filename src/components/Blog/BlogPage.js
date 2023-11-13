import React, { useState, useEffect } from "react";
import ReactGA from "react-ga4";
import style from "./BlogPage.module.css";
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
  const [startTime, setStartTime] = useState(new Date());

  useEffect(() => {
    getBlogBySlug(slug)
      .then((result) => {
        setBlog(result.data);
        setStartTime(new Date());
      })
      .catch((err) => {
        if (err.response && err.response.status === 404) {
          setError("Blog not Found");
        }
      });
  }, [slug]);

  useEffect(() => {
    const handleBeforeUnload = (event) => {
      // Calculate reading duration when user leaves the page
      const endTime = new Date();
      const durationInSeconds = Math.round((endTime - startTime) / 1000);

      // Send GA event for reading duration only when navigating away
      if (event) {
        ReactGA.event({
          category: "Blog",
          action: "ReadDuration",
          label: slug,
          value: durationInSeconds,
        });
      }
    };

    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [startTime, slug]);

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
