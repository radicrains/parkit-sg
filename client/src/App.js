import React from 'react'
import Display from './Display'
import Map from './Map'

import './App.css';

const backendURL = '/'

class App extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
            area: 'redhill',
            fetchedArea: false,
            fetchedAvailability: '',
            userID:''
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
        fetch(`${backendURL}carparkdetails?area=` + this.state.area + "&currentUser=" + this.state.userID, {
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
        .then((fetchedDetails) => {
            this.setState({fetchedArea: fetchedDetails})
            console.log(this.state.fetchedArea);
            
        }).catch(err => console.log(err));
    }

    handleChange = (event) => {
        this.setState({[event.target.id]: event.target.value})
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
        })
            .then((loginUser) => {
              console.log(loginUser);
              return loginUser.json()
            })
            .then((jsonedUser) => {
                console.log(jsonedUser);
                this.setState({userID: jsonedUser._id})
                
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
                this.setState({fetchedArea: ''})
                console.log(jsonedResponse);
            })
            .catch(error => console.log(error));
    }

    componentDidMount() {
        this.fetchData()
        this.fetchOtherData()
    }

    componentDidUpdate(prevProps, prevState) {
        if(this.state.userID !== prevState.userID) {
            this.fetchOtherData()
        }
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

                <button onClick={this.handleLogout}>Logout</button>

                {this.state.fetchedArea ?
                <div>
                    Test
                    <button onClick={this.fetchData}>DataFromGovAPI</button>
                    <button onClick={this.fetchOtherData}>OtherDataFromMongoDB</button>
                    <br></br>
                    
                    'Appear if state has value...'
                    <Display area={this.state.fetchedArea} detail={this.state.fetchedAvailability} />
                </div>
                : 'State has no value'
                }
                <div>
                    <Map />
                </div>
            </React.Fragment>
		);
	}
}

export default App;
