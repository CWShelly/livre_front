import React from 'react';
import Request from 'superagent'
import Shelf from "./Shelf.js"
import { Redirect, Route} from 'react-router-dom'
const url = 'http://localhost:4000/api/users'



class NewUser extends React.Component{
    create(e){
        e.preventDefault()
        let emailHasAt = Object.values(this.refs.email_address.value)
        if(this.refs.name.value === '' || this.refs.email_address.value === '' ){
          console.log(`Can't be blank`);
        }

       else if (emailHasAt.indexOf('@') === -1) {
         console.log(`Please enter a valid email address`);

       }
        else{

        localStorage.setItem('email_address',this.refs.email_address.value)
          localStorage.setItem('name',this.refs.name.value)
        let user = {}
        user['name'] = this.refs.name.value
        user['email_address'] = this.refs.email_address.value
        if(user){
            this.props.createUser(user)
            this.refs.name.value = ''
            this.refs.email_address.value = ''
        }
      }


    }

    render(){
        return(
            <form onSubmit={this.create.bind(this)}>
                <input type="text" ref="name" placeholder="Name"/>
                <input type="text" ref="email_address" placeholder="Email" />
                <button type="submit">submit</button>
            </form>
        )
    }
}

export default class User extends React.Component{

    createUser(user){
            let newUser = {
                name: user.name,
                email_address: user.email_address
            }

            Request.post(url, newUser)
                .then(response => console.log(response))
                .catch(error => console.log(error))
                .then(()=>{
                    this.props.history.push("/shelf");
                })
                .catch(error=>console.log(error))
            }

    render(){
        return(
            <div>Sign up!
            <NewUser createUser={this.createUser.bind(this)}/>
            </div>
        )
    }
}
