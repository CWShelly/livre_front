import React from 'react';
import Request from 'superagent';
import { BrowserRouter as Router, Route, Redirect } from 'react-router-dom'



const url = 'http://localhost:4000/api/users'

class EditUserForm extends React.Component{
  edit(e){
    e.preventDefault()
    let book = {}
    book['name'] = this.refs.name.value
    if(book){
      this.props.editUser(book)
      this.refs.name.value = ''
    }
  }

  render(){
    return(
      <form onSubmit={this.edit.bind(this)}>
          <input type="text" ref="name" placeholder="Name"/>
          <button type="submit">submit</button>
      </form>
    )
  }
}

export default class EditUser extends React.Component{
  constructor(props){
    super(props)

  }
  editUser(book){
    Request.get(url + "/" + this.props.myEmail)
    .then(response=>{
      localStorage.setItem('name', book.name)
      Request.put(url + "/" + response.body[0].id.toString(), book)
        .then((response)=>{
          this.props.history.push("/shelf")
        }
      )
        .catch(error=>console.log(error))
        .then(()=>{
          this.props.history.go("/shelf")
        })
    })


  }

  render(){

    return(
      <div>
      <EditUserForm editUser={this.editUser.bind(this)}/>
      </div>
    )
  }
}
