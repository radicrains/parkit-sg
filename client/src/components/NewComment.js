import React from 'react'
import '../styles/App.css'

class NewComment extends React.Component{
    render() {
        return(
            <form onSubmit={this.props.handleComment}>
                <div id="RHS-top">
                    <div>
                        <input type="hidden" id="carparkNo" name="carparkNo" value={this.props.car_park_no}></input>
                        <input type="hidden" id="login-user" name="user" value={this.props.userName}></input>
                        <input type="text" id="user-comment" name="comment" placeholder="Input your review of the carpark"></input>
                        <label htmlFor="user-comment"></label>
                    </div>
                    <div>
                        <input type="submit" id='comment-btn'></input>
                    </div>
                </div>
            </form>
        )
    }
}

export default NewComment;

