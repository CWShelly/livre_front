import React from 'react';
import Request from 'superagent'

const url = 'http://localhost:4000/api/books'



class NewBook extends React.Component{
    create(e){
        let storedEmail = localStorage.getItem('email_address')
        e.preventDefault()
        let book = {}
        book['title'] = this.refs.title.value
        book['author'] = this.refs.author.value
        book['available'] = this.refs.available.value
        book['ownerEmail'] = storedEmail
        console.log(book);
        if(book){
            console.log(book);
            console.log(this.props);
            this.props.createBook(book)
            this.refs.title.value = ''
            this.refs.author.value = ''
            this.refs.available.value = ''

        }
    }

    render(){
      console.log(this.props.message);
        return(
          <div>

            <form onSubmit={this.create.bind(this)}>
                <input type="text" ref="title" placeholder="Title"/>
                <input type="text" ref="author" placeholder="Author" />
                <input type="text" ref="available" placeholder="Available"/>
                <button type="submit">submit</button>
            </form>
            </div>
        )
    }
}

export default class Book extends React.Component{
  constructor(props){
    super(props)
    this.state={}
  }


  get(){


  return new Promise((resolve, reject)=>{
      resolve(Request.get(url)
                .then(response=>{
                    let email_address = localStorage.getItem('email_address')
                        const owner = response.body.filter(x=>x.ownerEmail !== email_address && x.available === true)
                    this.setState({
                        books: owner,
                        allBooks: owner
                    })
                }))
         })
  }

    createBook(book){
            let newBook = {
                title: book.title,
                author: book.author,
                available: book.available,
                ownerEmail: book.ownerEmail
            }

            this.setState({
              addBook:newBook
            })

            Request.post(url, newBook)
                .then(response => console.log(response))
                .catch(error => console.log(error))
                .then(()=>{
                  this.get()
                })
                .catch(error=>console.log(error))
                .then(()=>{
                  this.props.getMyBooks()
                })
                  .catch(error=>console.log(error))
        }
    render(){

        return(

            <div>Add a Book
            <NewBook createBook={this.createBook.bind(this)}  addBook={this.state.addBook}  message={this.props.message}/>

            <hr />
            </div>
        )
    }
}
