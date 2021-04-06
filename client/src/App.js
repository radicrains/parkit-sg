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
            // zoom: 0,
            // lat: 0,
            // lng: 0,
            markerDetails: ''
        };
	}

    fetchData = () => {
        fetch(`${backendURL}carparkavailability`)
        .then((response) => {
            console.log(response);
            return response.json()
        })
        .then((fetchedData) => {
            this.setState({fetchedAvailability: fetchedData.items[0].carpark_data})
            console.log(this.state.fetchedAvailability);
            
        }).catch(err => console.log(err));
    }

    fetchOtherData = () => {
        fetch(`${backendURL}carparkdetails?area=` + this.state.area, {
            credentials: 'include'
        })
        .then((response) => {
            console.log(response);
            return response.json()
        })
        .then((fetchedDetails) => {
            this.setState({fetchedArea: fetchedDetails})
            // this.setState({car_park_no: fetchedDetails.car_park_no})
            console.log(this.state.fetchedArea);
            
        }).catch(err => console.log(err));
        
       
        
        //FETCH COMMENTS
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
            console.log(this.state.fetchedComments);
            
            
        }).catch(err => console.log(err));

    }

    handleSearch = (result) => {
        this.setState({area: result}, () => {
            console.log(this.state.area)
        })
        
    }

    handleLogin = (event) => {
        event.preventDefault();
        const loginUserData = new FormData(event.target);
        console.log(event.target)
        console.log(loginUserData.get('username'))
        
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
              console.log(loginUser);
              return loginUser.json()
            })
            .then((jsonedUser) => {
                console.log(jsonedUser);
                this.setState({userID: jsonedUser._id})
                this.setState({userName: jsonedUser.username})
                
            })
            .catch(error => console.log(error));
        event.target.reset();


    }

    handleCreateUser = (event) => {
        event.preventDefault();
        const createUserData = new FormData(event.target);
        console.log(event.target)
        console.log(createUserData.get('username'))
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

    handleLogout = () => {
        fetch(`${backendURL}sessions`, {
            method: 'DELETE'
        })
        .then(response => response.json())
            .then((jsonedResponse) => {
                this.setState({userID: ''})
                this.setState({userName: ''})
                this.setState({fetchedArea: ''})
                console.log(jsonedResponse);
            })
            .catch(error => console.log(error));
    }

    /////////////////////////////////////////////////////////////////////////////////////
    //HANDLING COMMENTS
    handleComment = (event) => {
        event.preventDefault();
        const createUserComment = new FormData(event.target);

        console.log(event.target);
        console.log(createUserComment);
        console.log(createUserComment.get('comment'));

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
                console.log(jsonedComment);
                this.setState({fetchedComments:[jsonedComment, ...this.state.fetchedComments]});
                
            })
            .catch(error => console.log(error));
        event.target.reset();

    }
    /////////////////////////////////////////////////////////////////////////////////////

    componentDidMount() {
        this.fetchData()
        this.fetchOtherData()
    }

    componentDidUpdate(prevProps, prevState) {
        if(this.state.userID !== prevState.userID) {
            this.fetchOtherData()
        }

        if(this.state.area !== prevState.area) {
            this.fetchOtherData();

        }
    }

  

    handleMarkerDetails = (markerDetails) => {
        this.setState({markerDetails})
        this.setState({car_park_no: markerDetails.car_park_no})

    }


	render() {
        
		return (
            <React.Fragment>
                <form onSubmit={this.handleCreateUser}>
                    <label htmlFor="create-username"></label>
                    <input type="text" id="create-username" name="username" placeholder="Input Username here" onChange={this.handleChange}></input>
                    <label htmlFor="create-password"></label>
                    <input type="password" id="create-password" name="password" placeholder="Enter Password here" onChange={this.handleChange}></input>
                    <input type="submit" value="Create User"></input>
                </form>    
                    
                <form onSubmit={this.handleLogin}>
                    <label htmlFor="login-username"></label>
                    <input type="text" id="login-username" name="username" placeholder="Input Username here" onChange={this.handleChange}></input>
                    <label htmlFor="login-password"></label>
                    <input type="password" id="login-password" name="password" placeholder="Enter Password here" onChange={this.handleChange}></input>
                    <input type="submit" value="Login"></input>
                </form>

                <form onSubmit={this.handleComment}>
                    <label htmlFor="user-comment"></label>
                    <input type="hidden" id="carparkNo" name="carparkNo" value={this.state.car_park_no}></input>
                    <input type="hidden" id="login-user" name="user" value={this.state.userName}></input>
                    <input type="text" id="user-comment" name="comment" placeholder="Input your review here" onChange={this.handleChange}></input>
                    <input type="submit" value="Post-it!"></input>
                </form>

                <button onClick={this.handleLogout}>Logout</button>

                {
                    this.state.fetchedArea ?
                    <div>
                        Test
                        <button onClick={this.fetchData}>DataFromGovAPI</button>
                        <button onClick={this.fetchOtherData}>OtherDataFromMongoDB</button>
                        <br></br>
                        
                        'Appear if state has value...'
                        {/* <Display comments={this.state.fetchedComments} area={this.state.fetchedArea} detail={this.state.fetchedAvailability} /> */}
                        
                        <div>
                            <Map onClickMarker={this.handleMarkerDetails} area={this.state.fetchedArea} />
                        </div>

                        <div>
                            <MarkerDetails markerDetails={this.state.markerDetails} detail={this.state.fetchedAvailability} comments={this.state.fetchedComments}/>
                        </div>
                    </div>
                    : 'State has no value'
                }
                <Searchbar onSearch={this.handleSearch}/>
            </React.Fragment>
		);
	}
}

export default App;






  // handleMapViewChange = (zoom, lat, lng) => {
    //     // this.setState({lat, lng, zoom})

    //     this.setState(() => {
    //         return {
    //             lat: lat,
    //             lng: lng,
    //             zoom: zoom
    //         }
    //     })
    //     console.log(`lat: ${this.state.lat} lng: ${this.state.lng} zoom: ${this.state.zoom}`)
    // }


     // ///////////////////////////
        // fetch(`${backendURL}comments`, {
        //     headers: {
        //         'Accept': 'application/json, text/plain, */*',
		// 		'Content-Type': 'application/json',
        //     },
        //     method: 'GET',
        // })
        // .then((response) => {
        //     console.log(response);
        //     return response.json()
        // })
        // .then((fetchedComments) => {
            
        //     this.setState({car_park_no: fetchedComments})
        //     console.log(this.state.car_park_no);
            
            
        // }).catch(err => console.log(err));