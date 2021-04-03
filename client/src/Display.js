import React from 'react'
import CarparkSlots from './CarparkSlots'
import Comments from './Comments'

class Display extends React.Component {
    render() {
        return (
            <div>
                {this.props.area.map((carpark, index) => {
                    return(
                        <div key={carpark.car_park_no} id={carpark.car_park_no}>{carpark.address} 
                        <CarparkSlots details={this.props.detail} carParkNo={carpark.car_park_no}/>
                        <Comments comments={this.props.comments} carParkNo={carpark.car_park_no}/>
                        </div>
                    )
                })}
            </div>
        )
    }
}

export default Display;