import React from 'react'
import Display from './Display'
import Map from './Map'

import './App.css';
import MarkerDetails from './MarkerDetails';
import Searchbar from './Searchbar';

const backendURL = '/'

class App extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
            area: 'redhill',
            fetchedArea: false,
            fetchedAvailability: '',
            userID:'',
            userName:'',
            fetchedComments: '',
            car_park_no: '',
            markerDetails: ''
        };
	}


    ///////////////////////////////////////////////////////////////////////////////////////////
    //----------- FETCH ALL CARPARK AVAILABILITY FROM DATA.GOV.SG -----------//
    fetchData = () => {
        fetch(`${backendURL}carparkavailability`)
        .then((response) => {
            // console.log(response);
            return response.json()
        })
        .then((fetchedData) => {
            this.setState({fetchedAvailability: fetchedData.items[0].carpark_data})
            console.log(this.state.fetchedAvailability);
            
        }).catch(err => console.log(err));
    }


    ///////////////////////////////////////////////////////////////////////////////////////////
    //----------- FETCH CARPARK DETAILS (BY AREA) FROM MONGODB -----------//
    fetchOtherData = () => {
        fetch(`${backendURL}carparkdetails?area=` + this.state.area, {
            credentials: 'include'
        })
        .then((response) => {
            // console.log(response);
            return response.json()
        })
        .then((fetchedDetails) => {
            this.setState({fetchedArea: fetchedDetails})
            // console.log(this.state.fetchedArea);
            
        }).catch(err => console.log(err));
        

        //----------- FETCH COMMENTS FROM MONGODB -----------//
        fetch(`${backendURL}comments`, {
            headers: {
                'Accept': 'application/json, text/plain, */*',
				'Content-Type': 'application/json',
            },
            method: 'GET',
        })
        .then((response) => {
            console.log(response);
            return response.json()
        })
        .then((fetchedComments) => {
            this.setState({fetchedComments: fetchedComments});
            // console.log(this.state.fetchedComments);
        }).catch(err => console.log(err));
    }


    ///////////////////////////////////////////////////////////////////////////////////////////
    //----------- FUNCTION TO SEARCH CARPARK AREA BASED ON USER INPUT -----------//
    handleSearch = (result) => {
        this.setState({area: result}, () => {
            console.log(this.state.area)
        })  
    }


    ///////////////////////////////////////////////////////////////////////////////////////////
    //----------- HANDLE LOGIN, SET STATE FOR USER ID & USER NAME, FETCH CARPARK DETAILS -----------//
    handleLogin = (event) => {
        event.preventDefault();
        const loginUserData = new FormData(event.target);
        // console.log(event.target)
        // console.log(loginUserData.get('username'))
        
        fetch(`${backendURL}sessions`, {
            body: JSON.stringify({
                username: loginUserData.get('username'),
                password: loginUserData.get('password')
            }),
            method: 'POST',
            headers: {
                'Accept': 'application/json, text/plain, */*',
				'Content-Type': 'application/json',
            },
            credentials: 'include'
        })
            .then((loginUser) => {
            //   console.log(loginUser);
              return loginUser.json()
            })
            .then((jsonedUser) => {
                // console.log(jsonedUser);
                this.setState({userID: jsonedUser._id})
                this.setState({userName: jsonedUser.username})
                
            })
            .catch(error => console.log(error));
        event.target.reset();
        this.fetchOtherData() 

    }


    ///////////////////////////////////////////////////////////////////////////////////////////
    //----------- HANDLE CREATE NEW USER -----------//
    handleCreateUser = (event) => {
        event.preventDefault();
        const createUserData = new FormData(event.target);
        // console.log(event.target)
        // console.log(createUserData.get('username'))
        fetch(`${backendURL}users`, {
            body: JSON.stringify({
                username: createUserData.get('username'),
                password: createUserData.get('password')
            }),
            method: 'POST',
            headers: {
                'Accept': 'application/json, text/plain, */*',
				'Content-Type': 'application/json',
            },
        })
        .then(createdUser => createdUser.json())
        .then((jsonedUser) => {
            console.log(jsonedUser);
        })
        .catch(error => console.log(error));
        event.target.reset();
    }


    ///////////////////////////////////////////////////////////////////////////////////////////
    //----------- HANDLE LOGOUT - END SESSION & RESET STATE -----------//
    handleLogout = () => {
        fetch(`${backendURL}sessions`, {
            method: 'DELETE'
        })
        .then(response => response.json())
        .then((jsonedResponse) => {
            this.setState({userID: ''});
            this.setState({userName: ''});
            this.setState({fetchedArea: ''});
            this.setState({markerDetails: ''});
            // console.log(jsonedResponse);
        })
        .catch(error => console.log(error));
    }


    /////////////////////////////////////////////////////////////////////////////////////
    //----------- HANDLE COMMENTS - ADD NEW COMMENTS TO FETCH COMMENTS-----------//
    handleComment = (event) => {
        event.preventDefault();
        const createUserComment = new FormData(event.target);

        // console.log(event.target);
        // console.log(createUserComment);
        // console.log(createUserComment.get('comment'));

        fetch(`${backendURL}comments`, {
            body: JSON.stringify({
                car_park_no: createUserComment.get('carparkNo'),  
                user: createUserComment.get('user'),
                comment: createUserComment.get('comment')
            }),
            method: 'POST',
            headers: {
                'Accept': 'application/json, text/plain, */*',
				        'Content-Type': 'application/json',
            },
        })
        .then(createdComment => createdComment.json())
        .then((jsonedComment) => {
            // console.log(jsonedComment);
            this.setState({fetchedComments:[jsonedComment, ...this.state.fetchedComments]});
        })
        .catch(error => console.log(error));

        event.target.reset();
    }


    /////////////////////////////////////////////////////////////////////////////////////
    //----------- UPDATE & DELETE COMMENTS - ALLOW USER MODIFY OWN COMMENTS-----------//
    updateComments = (comments) => {
        this.setState({
            fetchedComments: comments
        });
    }

    deleteComments = (index) => {
        this.setState({
          fetchedComments: 
          [
            ...this.state.fetchedComments.slice(0, index),
            ...this.state.fetchedComments.slice(index + 1)
          ]
        });
    }


    /////////////////////////////////////////////////////////////////////////////////////
    //----------- LOAD THE DATAS ON START -----------//
    componentDidMount() {
        this.fetchData()
        this.fetchOtherData()
    }

    //----------- LOAD CARPARK DETAILS IF THERE IS CHANGE IN AREA SEARCH OR USERS -----------//
    componentDidUpdate(prevProps, prevState) {
        if(this.state.userID !== prevState.userID) {
            this.fetchOtherData()
        }

        if(this.state.area !== prevState.area) {
            this.fetchOtherData();

        }
    }


    /////////////////////////////////////////////////////////////////////////////////////
    //----------- SET STATE FOR CARPARK DETAILS - LOAD DATA BASED ON CLICK EVENT -----------//
    handleMarkerDetails = (markerDetails) => {
        this.setState({markerDetails})
        this.setState({car_park_no: markerDetails.car_park_no})
    }



    /////////////////////////////////////////////////////////////////////////////////////
	render() {
		return (
            <React.Fragment>
                <div id='top-container'>
                    <form onSubmit={this.handleCreateUser}>
                        <label htmlFor="create-username"></label>
                        <input type="text" id="create-username" name="username" placeholder="Input Username here" onChange={this.handleChange}></input>
                        <label htmlFor="create-password"></label>
                        <input type="password" id="create-password" name="password" placeholder="Enter Password here" onChange={this.handleChange}></input>
                        <input class='submit-btn' type="submit" value="Create User"></input>
                    </form>    

                    <form onSubmit={this.handleLogin}>
                        <label htmlFor="login-username"></label>
                        <input type="text" id="login-username" name="username" placeholder="Input Username here" onChange={this.handleChange}></input>
                        <label htmlFor="login-password"></label>
                        <input type="password" id="login-password" name="password" placeholder="Enter Password here" onChange={this.handleChange}></input>
                        <input class='submit-btn' type="submit" value="Login"></input>
                    </form>

                    

                    <button class='submit-btn' onClick={this.handleLogout}>Logout</button>
                </div>
                

                {
                    this.state.fetchedArea ?
                    <div class='bottom-container'>                        
                        <div id='LHS'>
                            <Searchbar onSearch={this.handleSearch}/>
                            <div id='map'>
                                <Map 
                                    onClickMarker={this.handleMarkerDetails} 
                                    area={this.state.fetchedArea} 
                                />
                            </div>
                        </div>
                        <div id='RHS'>
                            <form onSubmit={this.handleComment}>
                                <label htmlFor="user-comment"></label>
                                <input type="hidden" id="carparkNo" name="carparkNo" value={this.state.car_park_no}></input>
                                <input type="hidden" id="login-user" name="user" value={this.state.userName}></input>
                                <input type="text" id="user-comment" name="comment" placeholder="Input your review here" onChange={this.handleChange}></input>
                                <input class='submit-btn' type="submit" value="Post-it!"></input>
                            </form>
                            <MarkerDetails 
                                markerDetails={this.state.markerDetails} 
                                detail={this.state.fetchedAvailability} 
                                comments={this.state.fetchedComments} 
                                onUpdateComments={this.updateComments} 
                                deleteComments={this.deleteComments}
                                userName={this.state.userName} 
                            />
                        </div>
                    </div>
                    : ''
                }
                
            </React.Fragment>
		);
	}
}

export default App;