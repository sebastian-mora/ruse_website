import React, { Component } from "react";
import { Routes, Route } from "react-router-dom";

import "./App.css";

// Add comps
import Nav from "./components/Nav/Nav";
import Index from "./components/Index/index";
import About from "./components/About/About";
import BlogList from "./components/Blog/BlogList";
import BlogPage from "./components/Blog/BlogPage";
import Projects from "./components/Projects/index";

class App extends Component {
  render() {
    return (
      <div>
        <Nav />
        <Routes>
          <Route path="/" exact element={<Index />} />
          <Route path="/about" exact element={<About />} />
          {/* <Route  path={"/assets"} component={AssetsPage}/> */}
          <Route path="/projects" exact element={<Projects />} />
          <Route path="/blogs" element={<BlogList />} />
          <Route path={"/blogs/:slug"} element={<BlogPage />} />
        </Routes>
      </div>
    );
  }
}

export default App;
