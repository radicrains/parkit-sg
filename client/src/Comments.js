import React from 'react'
import EditForm from './EditForm'

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
                        <div id={index} key={index}>
                            {comment.user}: {comment.comment}
                            <div>
                                {
                                    comment.user === this.props.userName ? 
                                        <div>
                                            <EditForm onUpdateComments={this.props.onUpdateComments} comment={comment} id={comment._id}/>
                                            <button onClick={this.onDelete.bind(this, comment._id, index)}>Delete Comment</button>
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