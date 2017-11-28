import React from 'react';
import Request from 'superagent';
import Shelf from "./Shelf.js"
import { Redirect, Route} from 'react-router-dom'
const url = 'http://localhost:4000/api/users';


class ReturningUser extends React.Component{
    loginUser(e){
        e.preventDefault()
        let returner = {}
        returner['email_address'] =this.refs.email_address.value
        localStorage.setItem('email_address', returner.email_address)
        if(returner){
            this.props.login(returner)
            this.refs.email_address.value=""
        }
    }

    render(){
        return(
            <form onSubmit={this.loginUser.bind(this)}>
            <input type="text" placeholder='Email' ref="email_address"/>
            <button type="submit">Login</button>
            </form>

        )
    }
}

export default class SignIn extends React.Component{
    login(user){
        Request.get(url + '/' + user.email_address)
        .then(response => {
              localStorage.setItem('name', response.body[0].name)
        }
      )
        .catch(error => console.log(error))
        .then(()=>{
              this.props.history.push("/shelf");
        })
    }

    render(){
        return(
            <ReturningUser login={this.login.bind(this)}/>
        )
    }
}
