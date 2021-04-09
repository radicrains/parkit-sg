import React from 'react'
import Map from './Map'
import MarkerDetails from './MarkerDetails';
import Searchbar from './Searchbar';
import NewComment from './NewComment';

class Display extends React.Component {
    render() {
        return (
            <React.Fragment>
                <div>
                    {
                        this.props.fetchedArea ?
                        <div id='app-container'>   
                            <div id='LHS'>
                                <div id='LHS-top'>
                                    <div>
                                        <Searchbar onSearch={this.props.handleSearch}/>
                                    </div>
                                    <div style={{padding:'0.5vmax'}}>
                                        <button onClick={this.props.handleLogout} className='btn'>Logout</button> 
                                    </div>
                                </div>
                                <div id='map'>
                                    <Map 
                                        onClickMarker={this.props.handleMarkerDetails} 
                                        area={this.props.fetchedArea} 
                                    />
                                </div>
                            </div>
                            <div id='RHS'>
                                
                                {/* <form onSubmit={this.props.handleComment}>
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
                                </form> */}

                                <NewComment 
                                    handleComment={this.props.handleComment}
                                    car_park_no={this.props.car_park_no}
                                    userName={this.props.userName}
                                />
                                <MarkerDetails 
                                    markerDetails={this.props.markerDetails} 
                                    detail={this.props.fetchedAvailability} 
                                    comments={this.props.fetchedComments} 
                                    onUpdateComments={this.props.updateComments} 
                                    deleteComments={this.props.deleteComments}
                                    userName={this.props.userName} 
                                />
                            </div>
                        </div>
                        : ''
                    }
                </div>
            </React.Fragment>
            
        )
    }
}

export default Display;