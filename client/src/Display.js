import React from 'react'
import CarparkSlots from './CarparkSlots'
import Comments from './Comments'

class Display extends React.Component {
    render() {
        return (
            <React.Fragment>
                <div>
                    {this.props.area.map((carpark, index) => {
                        return(
                            <div key={carpark.car_park_no} id={carpark.car_park_no}>{carpark.address} <CarparkSlots details={this.props.detail} carParkNo={carpark.car_park_no}/>
                            <Comments car_park_no={this.props.car_park_no} carParkNo={carpark.car_park_no}/>
                            </div>
                            )
                        })}
                </div>
            </React.Fragment>
            
        )
    }
}

export default Display;