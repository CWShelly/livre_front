import React from 'react';
import Request from 'superagent';
import _ from 'lodash'
const url = 'http://localhost:4000/api/users';


export default class Allusers extends React.Component{
    constructor(props){
        super(props)
        this.state = {}
    }
    get(){
        Request.get(url)
            .then(response=>{
                this.setState({
                    users: response.body
                })
            }
        )
            .catch(error => console.log(error))
    }

    getUser(x){
        Request.get(url + '/' + x)
        .then(response=>console.log(response.body))
    }

    componentWillMount(){
        this.get()
    }

    render(){
        let users = _.map(this.state.users, (user)=>{
            return <li key={user.id}>{user.name} at <a href="#" onClick={(e)=>{this.getUser(user.id, e)}}>{user.email_address}</a></li>
        })


        return(<div>
            <ol>{users}</ol>
            </div>)

    }
}
