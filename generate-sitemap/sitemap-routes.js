import React from 'react';
import { Route, Switch } from 'react-router';
 
export default (
    <Route>
            <Switch>
              <Route path ="/" exact  />
              <Route path ="/about" exact  />
              <Route path ="/projects" exact />
              <Route  path = "/blogs" exact   />
              <Route  path="/blogs/:slug" />
            </Switch>
    </Route>
);