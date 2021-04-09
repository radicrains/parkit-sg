import React from 'react'
import Display from './Display'

import { Login, Register } from './loginComponents/index';
import '../styles/App.css';


const backendURL = '/';

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
            markerDetails: '',
            activeLogin: true,
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
        this.fetchData();
        this.fetchOtherData();
        // this.rightSide.classList.add('right');
    }

    //----------- LOAD CARPARK DETAILS IF THERE IS CHANGE IN AREA SEARCH OR USERS -----------//
    componentDidUpdate(prevProps, prevState) {
        if(this.state.userID !== prevState.userID) {
            this.fetchOtherData();
            // this.rightSide.classList.add('right');
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

    changeState() {
        const { activeLogin } = this.state;
    
        if (activeLogin) {
          this.rightSide.classList.remove('right');
          this.rightSide.classList.add('left');
        } else {
          this.rightSide.classList.remove('left');
          this.rightSide.classList.add('right');
        }
        this.setState((prevState) => ({
          activeLogin: !prevState.activeLogin,
        }));
      }

    /////////////////////////////////////////////////////////////////////////////////////
	render() {
        const { activeLogin } = this.state;
        const current = activeLogin ? 'Login' : 'Register';
        const currentActive = activeLogin ? 'login' : 'register';

		return (
            <React.Fragment>
                <div id='main'>
                    {
                        this.state.fetchedAvailability.length > 10 ?
                        ''
                        :
                        <div style={{color:'grey'}}>fetching...</div>
                        
                    }
                    {
                        this.state.userID === '' ?
                            <div id='login-container'>
                                <div className='App'>
                                    <div className='login'>
                                        <div className='container' ref={(ref) => (this.container = ref)}>
                                            {activeLogin && (
                                                <form onSubmit={this.handleCreateUser}>
                                                <Register containerRef={(ref) => (this.current = ref)} />
                                                </form>
                                            )}
                                            {!activeLogin && (
                                                <form onSubmit={this.handleLogin}>
                                                <Login containerRef={(ref) => (this.current = ref)} />
                                                </form>
                                            )}
                                        </div>
                                        <RightSide
                                            current={current}
                                            currentActive={currentActive}
                                            containerRef={(ref) => (this.rightSide = ref)}
                                            onClick={this.changeState.bind(this)}
                                        />
                                    </div>
                                </div>
                            </div>
                        : ''
                    }
                    
                    <Display
                        //user login functions & state
                        handleLogout={this.handleLogout}
                        userName={this.state.userName}

                        //Searchbar functions & state
                        handleSearch={this.handleSearch}

                        //Maps functions & state
                        fetchedAvailability={this.state.fetchedAvailability}
                        fetchedArea={this.state.fetchedArea} 
                        car_park_no={this.state.car_park_no}

                        //MarkerDetails functions & state
                        handleMarkerDetails={this.handleMarkerDetails} 
                        markerDetails={this.state.markerDetails}

                        //Comments functions & state
                        fetchedComments={this.state.fetchedComments}
                        updateComments={this.updateComments}
                        deleteComments={this.deleteComments}
                        handleComment={this.handleComment}
                    />
                </div>
                
                
            </React.Fragment>
		);
	}
}

//Hook function for login/register animation
const RightSide = (props) => {
    return (
      <div
        className='right-side'
        ref={props.containerRef}
        onClick={props.onClick}
      >
        <div className='inner-container'>
          <div className='text'>{props.current}</div>
        </div>
      </div>
    );
};

export default App;