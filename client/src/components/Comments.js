import React from 'react'
import EditForm from './EditForm'
import '../styles/App.css';

class Comments extends React.Component {

    onDelete = (id, index) => {
        fetch('/comments/' + id, {
            method: 'DELETE'
        })
        .then(respnse => respnse.json())
        .then((jsonedComment) => {
            this.props.deleteComments(index)
            console.log('Deleted:', jsonedComment)
        })
        .catch(err => console.log(err))
    }

    render() {
        console.log(this.props.comments)
        return (
            this.props.comments.map((comment, index) => {
                return (
                    comment.car_park_no === this.props.markerDetails.car_park_no ?
                        <div className='user-btn' id={index} key={index}>
                            <div id='usercomment'>
                                <span id='user'>{comment.user}</span>: <span>{comment.comment}</span>
                            </div>
                            <div>
                                {
                                    comment.user === this.props.userName ? 
                                        <div className='user-btn'>
                                            <div>
                                                <EditForm onUpdateComments={this.props.onUpdateComments} comment={comment} id={comment._id}/>
                                            </div>
                                            <div>
                                                <button className='btn' id='deledit' onClick={this.onDelete.bind(this, comment._id, index)}>X</button>
                                            </div>
                                        </div>
                                    : ''
                                }
                            </div>
                        </div>
                    : ''
                )
            })   
        )
    }
}

export default Comments;