import React from 'react'
import CarparkSlots from './CarparkSlots'

class MarkerDetails extends React.Component {
    render() {
        return (
            <React.Fragment>
                <CarparkSlots details={this.props.detail} carParkNo={this.props.markerDetails.car_park_no}/>



                {/* {
                    this.props.detail.map((detail, index) => {
                        return (
                            detail.carpark_number === this.props.markerDetails.car_park_no ?
                                <div key={detail.carpark_number}>
                                    There is {detail.carpark_info[0].lots_available} slot available for Lot Type: {detail.carpark_info[0].lot_type}
                                </div>
                            : ''
                        )
                    })  
                } */}
                <div>
                    <ul>
                        <li>{this.props.markerDetails.address}</li>
                        <li>{this.props.markerDetails.car_park_no}</li>
                        <li>{this.props.markerDetails.short_term_parking}</li>
                        <li>{this.props.markerDetails.car_park_type}</li>
                        <li>{this.props.markerDetails.free_parking}</li>
                        <li>{this.props.markerDetails.gantry_height}</li>
                        <li>{this.props.markerDetails.car_park_basement}</li>
                        <li>{this.props.markerDetails.night_parking}</li>
                        <li>{this.props.markerDetails.car_park_decks}</li>
                        <li>{this.props.markerDetails.type_of_parking_system}</li>
                    </ul>
                </div>
            </React.Fragment>
            
        )
    }
}

export default MarkerDetails;