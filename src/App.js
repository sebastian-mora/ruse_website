import React, { Component } from 'react';
import { Routes, Route } from 'react-router-dom';


import './App.css';


// Add comps
import Nav from './components/Nav/Nav'
import Index from './components/Index/index'
import About from './components/About/About'
import Blog from './components/Blog/Blog'
import BlogPage from './components/Blog/BlogPage'
// import Projects from './components/Projects'
// import AssetsPage from './components/Assests/AssetsPage';

class App extends Component {

  render() {

    return (
      <div >
        <Nav />
        <Routes>
          <Route path="/" exact element={<Index />} />
          <Route path="/about" exact element={<About />} />
          {/* <Route  path={"/assets"} component={AssetsPage}/> */}
          {/* <Route path ="/projects" exact component={Projects} /> */}
          <Route  path="/blogs" element={<Blog />} />
          <Route  path={"/blogs/:slug"} element={<BlogPage />} />
        </Routes>
      </div>
    );
  }
}



export default App;
