import React, { useEffect } from "react";
import { Routes, Route, useLocation, Navigate } from "react-router-dom";
import ReactGA from "react-ga4";

import "./App.css";

// Add comps
import Nav from "./components/Nav/Nav";
import Index from "./components/Index/index";
import About from "./components/About/About";
import BlogList from "./components/Blog/BlogList";
import BlogPage from "./components/Blog/BlogPage";
import Projects from "./components/Projects/index";
import NotFound from "./components/NotFound";

const TRACKING_ID = "G-VL1JR0CST3"; // YOUR_TRACKING_ID

ReactGA.initialize(TRACKING_ID);

const App = () => {
  const location = useLocation();

  useEffect(() => {
    ReactGA.send({
      hitType: "pageview",
      page: location.pathname,
      title: location.pathname,
    });

  }, [location]);

  return (
    <div>
      <Nav />
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/about" element={<About />} />
        {/* <Route path="/projects" element={<Projects />} /> */}
        <Route path="/blogs" element={<BlogList />} />
        <Route path="/blogs/:slug" element={<BlogPage />} />
        <Route path="/404" element={<NotFound />} />
        <Route path="*" element={<Navigate replace to="/404" />} />
      </Routes>
    </div>
  );
};

export default App;
