import React from 'react';
import Request from 'superagent';
import _ from 'lodash'
import Book from '../books/index.js'
import SingleBook from "../books/SingleBook"
import EditUser from './EditUser'
import { BrowserRouter as Router, Link, Redirect, Route } from 'react-router-dom'
const url = 'http://localhost:4000/api/books';



export default class Shelf extends React.Component{
    constructor(props){
        super(props)
        this.state={}
    }




    getMyBooks(){
      console.log('GETTING YOUR BOOKS');
        Request.get(url)
            .then(response=>{
              let email_address = localStorage.getItem('email_address')
                let name = localStorage.getItem('name')

                const availableBooks = response.body.filter(x=>x.ownerEmail !== email_address && x.available === true)

                const owner = response.body.filter(x=>x.ownerEmail === email_address)
                  .map((x)=>{
                    if(x.available === true){
                      x.isAvailable = "Available"
                    }
                    else{
                      x.isAvailable = "Not Available"
                    }
                    return x
                  })

                  let ownerArray = owner.slice();

                const loanedBooks =response.body.filter(x=>x.ownerEmail === email_address && x.currentlyWith !== name )
                const borrowedBooks = response.body.filter(x=>x.ownerEmail !== email_address && x.currentlyWith === name )
                if(owner.length !== 0){
                  this.setState({
                      mybooks: owner,
                      allBooks: availableBooks,
                      availableBooks: availableBooks,
                      loanedBooks: loanedBooks,
                      borrowedBooks: borrowedBooks,
                      empty: '',
                      button: 'search',
                      errorMessage: '',
                      display: "none",
                      history: this.props.history,
                      myEmail: email_address
                  })
                }
                else{
                  this.setState({
                      mybooks: owner,
                      availableBooks: availableBooks,
                      allBooks: availableBooks,
                      loanedBooks: loanedBooks,
                      borrowedBooks: borrowedBooks,
                      empty: `You haven't added any books yet. Add some now.`,
                      button: 'search',
                      errorMessage: '',
                      history: this.props.history,
                        myEmail: email_address
                  })
                }
            })
    }

        getNoCall(x){
          let bookObject = this.state.mybooks.filter(a=>a.id === x)
          let bookObjectIndex = this.state.mybooks.indexOf(bookObject)
          let mybooksCopy = this.state.mybooks.slice()
          mybooksCopy.splice(bookObjectIndex, 1)
          this.setState({
            mybooks: mybooksCopy
          })
        }
    search(e){
        e.preventDefault()
        if(this.refs.search.value === ''){
          this.setState({
              message: 'Try a search'
          })

        }
        else{
              let bookQuery = this.refs.search.value
              let searchResults = this.state.allBooks.filter(x=>x.title === bookQuery || x.author === bookQuery)
              if(searchResults.length > 0 && bookQuery !== ''){
                   this.setState({
                       availableBooks:searchResults,
                       message: 'Results...'
                   })
              }
              else if (bookQuery === '') {
                this.setState({
                  message: '',
                  availableBooks:this.state.allBooks
                })
              }
              else{
                  this.setState({
                      message: 'Not found. Try another search.',
                      availableBooks:this.state.allBooks
                  })
              }
        }
    }
    returnBook(x, owner){
      let returnedBook = {
        borrowerEmail: owner
      }

      Request.put(url + '/' + x, returnedBook )
      .then(response=>console.log(response))
      .catch(error=>console.log(error))
      .then(()=>{
        this.getMyBooks()
      })
    }
    logOut(){
        localStorage.clear()
        this.props.history.push("/login");
    }

    borrow(x){
      let borrowedBook = {
        borrowerEmail: localStorage.getItem('email_address')
      }

      Request.put(url + '/' + x, borrowedBook )
      .then(response=>console.log(response))
      .catch(error=>console.log(error))
      .then(()=>{
        this.getMyBooks()
      })
    }

    deleteBook(x, currentlyWith){

        if(currentlyWith === localStorage.getItem('name')){
            Request.delete(url + '/' + x, x)
            .then(response=>console.log(response))
            .catch(error=>console.log(error))
            .then(()=>{

              // this.getNoCall(x)

              let bookObject = this.state.mybooks.filter(a=>a.id === x)
              let bookObjectIndex = this.state.mybooks.indexOf(bookObject)
              let mybooksCopy = this.state.mybooks.slice()
              mybooksCopy.splice(bookObjectIndex, 1)
              this.setState({
                mybooks: mybooksCopy
              })

            })
            .catch(error=>console.log(error))
          }
          else{
            this.setState({errorMessage: "You can't remove a book that is currently being borrowed."})

            setTimeout(()=>{
              this.setState({
                errorMessage: ""
              })
            }, 5000)
          }
    }

    changeAvailability(x, available, currentlyWith){
      if(currentlyWith === localStorage.getItem('name')){
      let borrowedBook = {
        available: !available
      }

      Request.put(url + '/' + x, borrowedBook )
      .then(response=>console.log(response))
      .catch(error=>console.log(error))
      .then(()=>{
        this.getMyBooks()
      })

    }
    else{
      this.setState({
        errorMessage: "Currently borrowed. You can't change the availability until it is returned to you"
      })

      setTimeout(()=>{
        this.setState({
          errorMessage: ""
        })
      }, 5000)

    }


    }


    componentDidMount(){
        let loggedIn = localStorage.getItem('name')
        if(loggedIn !== null){
          this.getMyBooks()
        }
        else{
            this.props.history.push("/login");
        }
    }

    render(){
      console.log(this.props);

        let myBooks = this.state.mybooks
        let button = this.state.button

        let name = localStorage.getItem('name')
        let books = _.map(myBooks, (book)=>{

            return   <div key={book.id}>
            <li key={book.id}> {book.title} by {book.author}. Currently  {book.isAvailable} <button onClick={(e)=>{this.deleteBook(book.id, book.currentlyWith, e)}}>Remove</button> <button onClick={(e)=>{this.changeAvailability(book.id, book.available, book.currentlyWith, e)}}>Change Availability</button>
            <Router>
            <div>
           <Link to="/book">Edit Book</Link>
               <Route path="/book"    render={(props) =>  <SingleBook myId = {book.id}  getMyBooks={this.getMyBooks.bind(this)} history={this.state.history} /> } />
               </div>
            </Router>
                  </li>
            </div>

        })
        let availableBooks = _.map(this.state.availableBooks, (book)=>{
            return <li key={book.id}> {book.title} by {book.author}. From the library of {book.currentlyWith}.  <button onClick={(e)=>{this.borrow(book.id, e)}}>Borrow</button></li>
        })

        let borrowedBooks = _.map(this.state.borrowedBooks, (book)=>{
            return <li key={book.id}> {book.title} by {book.author}. From the library of {book.ownerEmail} <button onClick={(e)=>{this.returnBook(book.id,  book.ownerEmail, e)}}>Return</button></li>
        })
        let loanedBooks = _.map(this.state.loanedBooks, (book)=>{
            return <li key={book.id}> {book.title} by {book.author}. Currently with {book.currentlyWith} </li>
        })
        return(
            <div>
                <p>Welcome, {name}</p>Not you? Or maybe it's you, but you'd like to not be here?<a href="#" onClick={this.logOut.bind(this)}> Logout</a>

                  <Router>
                  <div>
                  <Link to="/editUserInfo">Edit User</Link>
                     <Route path="/editUserInfo"    render={(props) =>  <EditUser  myEmail = {this.state.myEmail}   getMyBooks={this.getMyBooks.bind(this)} history={this.state.history} /> } />
                     </div>
                  </Router>

                  <h1 style={{"display": this.state.display}}>Hello!</h1>
                  <p>{this.state.empty}</p>
                  {this.state.errorMessage}
                  <Book getMyBooks={this.getMyBooks.bind(this)} />
                  Your books:

                <ol>{books}</ol>

                 <hr />
                 Books that I am borrowing:
                 <ol>{borrowedBooks}</ol>
                 <hr />

                 Books that I have loaned out:
                    <ol>{loanedBooks}</ol>
                 <hr />
                 <h1>All the Available Books from Other Libraries</h1>
                 <h4>Search by Author or Title</h4>
                         {this.state.message}
                     <form onSubmit={this.search.bind(this)}>
                     <input type="text" ref="search"/>
                     <button type="submit">{button}</button>
                     </form>
                 <ol> {availableBooks}</ol>
            </div>
        )
    }
}
