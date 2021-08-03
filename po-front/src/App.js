import React from 'react';
import {BrowserRouter as Router, Switch, Route, Link} from 'react-router-dom';
import POList from './pages/po_list';
import POItems from './pages/po_items';


export default class App extends React.Component {
  render(){
    return (
      <div className="App">
        <div className="App-body">
        <Router>
          <Switch>
            <Route exact path="/" component={POList}/>
            <Route path="/po/:poId" component={POItems}/>
          </Switch>
        </Router>
        </div>
      </div>
    );
  }
}
