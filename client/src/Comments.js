import React from 'react'

class Comments extends React.Component {
    render() {
        return (
            this.props.comments.map((comment, index) => {
                return (
                    comment.car_park_no === this.props.markerDetails.car_park_no ?
                        <div key={index}>
                            Comments: {comment.comment}
                        </div>
                    : ''
                )
            })  
            
        )
    }
}

export default Comments;