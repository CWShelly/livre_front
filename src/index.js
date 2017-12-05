import React from 'react';
import ReactDOM from 'react-dom';
import Users from './components/users/index.js'
import Allusers from './components/admin/index.js'
import Book from './components/books/index.js'
import SignIn from './components/users/SignIn.js'
import Welcome from "./components/welcome/index.js"
import Shelf from "./components/users/Shelf.js"
import SingleBook from './components/books/SingleBook.js'
import { BrowserRouter as Router, Route, Link } from 'react-router-dom'

class App extends React.Component{
    render(){
        return(
            <div>
            <Router>
            <div>
                <ul>
                <li><Link to="/admin">View All Users </Link> </li>
                <li><Link to="/create">Create User</Link> </li>
                <li><Link to="/login">Sign In </Link> </li>
                <li><Link to="/shelf">My Shelf </Link></li>
                </ul>
                <hr />

                <Route exact path="/" component = {Welcome} />
                <Route path="/admin" component = {Allusers} />
                <Route path = "/create" component = {Users}/>
                <Route path = "/login" component={SignIn} />
                <Route path = "/shelf" component={Shelf} />
            </div>
            </Router>
            </div>
        )
    }
}

ReactDOM.render(<App />, document.getElementById('root'))
