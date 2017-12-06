import React from 'react';
import Request from 'superagent';
import { BrowserRouter as Router, Route, Redirect } from 'react-router-dom'



const url = 'http://localhost:4000/api/books'

class EditBook extends React.Component{
  edit(e){
    e.preventDefault()
    let book = {}
    book['title'] = this.refs.title.value
    book['author'] = this.refs.author.value

    if(book){
      this.props.editBook(book)
      this.refs.title.value = ''
      this.refs.author.value = ''
    }

  }

  render(){
    return(
      <form onSubmit={this.edit.bind(this)}>
          <input type="text" ref="title" placeholder="Title"/>
          <input type="text" ref="author" placeholder="Author" />
          <button type="submit">submit</button>
      </form>
    )
  }
}

export default class SingleBook extends React.Component{
 
  editBook(book){
    Request.put(url + "/" + this.props.myId, book)
    .then(response=>console.log(response))
    .catch(error=>console.log(error))
    .then(()=>{
        this.props.history.push("/shelf");
    })
    .catch(error=>console.log(error))
    .then(()=>{
      this.props.history.go('/shelf')
    })
    .catch(error=>console.log(error))
  }

  render(){
    return(
      <div>
      <EditBook editBook={this.editBook.bind(this)}/>
      </div>
    )
  }
}
