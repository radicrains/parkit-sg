import React from 'react'

class Comments extends React.Component {
    render() {
        return (
            this.props.car_park_no.map((comment, index) => {
                return (
                    comment.car_park_no === this.props.carParkNo ?
                        <div key={comment.car_park_no}>
                            Comments: {comment.comment}
                        </div>
                    : ''
                )
            })  
            
        )
    }
}

export default Comments;