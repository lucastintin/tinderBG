import React, { Fragment} from 'react';
import { BrowserRouter as Router, Route, Switch}  from 'react-router-dom';
import Login from './components/auth/Login';
import Register from './components/auth/Register';
import './App.css';
import Button from '@material-ui/core/Button';

const App = () => (
  <Router>
    <Fragment>
      <Route exact path='/' component={Login} />
      <section className='container'>
        <Switch>
          <Route exact path='/register' component={Register} />
        </Switch>
      </section>
    </Fragment>
  </Router>
);

export default App;
