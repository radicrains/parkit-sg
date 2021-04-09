import React from 'react'
import CarparkSlots from './CarparkSlots'
import Comments from './Comments'
import './App.css';

class MarkerDetails extends React.Component {
    render() {
        return (
            <React.Fragment>

                <div id='cp-details'>
                    <CarparkSlots details={this.props.detail} carParkNo={this.props.markerDetails.car_park_no}/>
                    <ul>
                        <li>Carpark Address: {this.props.markerDetails.address}</li>
                        <li>Short Term Parking: {this.props.markerDetails.short_term_parking}</li>
                        <li>Carpark Type: {this.props.markerDetails.car_park_type}</li>
                        <li>Free Parking Details: {this.props.markerDetails.free_parking}</li>
                        <li>Overnight Parking: {this.props.markerDetails.night_parking}</li>
                        <li>System: {this.props.markerDetails.type_of_parking_system}</li>
                    </ul>
                </div>
                <div id='cp-comments'>
                    <Comments 
                        comments={this.props.comments} 
                        markerDetails={this.props.markerDetails} 
                        onUpdateComments={this.props.onUpdateComments} 
                        deleteComments={this.props.deleteComments} 
                        userName={this.props.userName}
                    />
                </div>

            </React.Fragment>
        )
    }
}

export default MarkerDetails;