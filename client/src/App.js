import React from 'react';
import Display from './Display';
// import Map from './Map'
import { Login, Register } from './components/index';
import './App.css';

const backendURL = '/';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      area: 'redhill',
      fetchedArea: false,
      fetchedAvailability: '',
      userID: '',
      activeLogin: true,
      show: true,
    };
  }
  deleteLogin = () => {
    this.setState({show: false});
  }

  fetchData = () => {
    fetch(`${backendURL}carparkavailability`)
      .then((response) => {
        console.log(response);
        return response.json();
      })
      .then((fetchedData) => {
        this.setState({
          fetchedAvailability: fetchedData.items[0].carpark_data,
        });
        console.log(this.state.fetchedAvailability);
      })
      .catch((err) => console.log(err));
  };

  fetchOtherData = () => {
    fetch(
      `${backendURL}carparkdetails?area=` +
        this.state.area +
        '&currentUser=' +
        this.state.userID,
      {
        headers: {
          Accept: 'application/json, text/plain, */*',
          'Content-Type': 'application/json',
        },
        method: 'GET',
      },
    )
      .then((response) => {
        console.log(response);
        return response.json();
      })
      .then((fetchedDetails) => {
        this.setState({ fetchedArea: fetchedDetails });
        console.log(this.state.fetchedArea);
      })
      .catch((err) => console.log(err));
  };

  handleChange = (event) => {
    this.setState({ [event.target.id]: event.target.value });
  };

  handleLogin = (event) => {
    event.preventDefault();
    const loginUserData = new FormData(event.target);
    console.log(event.target);
    console.log(loginUserData.get('username'));
    fetch(`${backendURL}sessions`, {
      body: JSON.stringify({
        username: loginUserData.get('username'),
        password: loginUserData.get('password'),
      }),
      method: 'POST',
      headers: {
        Accept: 'application/json, text/plain, */*',
        'Content-Type': 'application/json',
      },
    })
      .then((loginUser) => {
        console.log(loginUser);
        return loginUser.json();
      })
      .then((jsonedUser) => {
        console.log(jsonedUser);
        this.setState({ userID: jsonedUser._id });
      })
      .catch((error) => console.log(error));
    event.target.reset();
  };

  handleCreateUser = (event) => {
    event.preventDefault();
    const createUserData = new FormData(event.target);
    console.log(event.target);
    console.log(createUserData.get('username'));
    fetch(`${backendURL}users`, {
      body: JSON.stringify({
        username: createUserData.get('username'),
        password: createUserData.get('password'),
      }),
      method: 'POST',
      headers: {
        Accept: 'application/json, text/plain, */*',
        'Content-Type': 'application/json',
      },
    })
      .then((createdUser) => createdUser.json())
      .then((jsonedUser) => {
        console.log(jsonedUser);
      })
      .catch((error) => console.log(error));
    event.target.reset();
  };

  handleLogout = () => {
    fetch(`${backendURL}sessions`, {
      method: 'DELETE',
    })
      .then((response) => response.json())
      .then((jsonedResponse) => {
        this.setState({ userID: '' });
        this.setState({ fetchedArea: '' });
        console.log(jsonedResponse);
      })
      .catch((error) => console.log(error));
  };

  componentDidMount() {
    this.fetchData();
    this.fetchOtherData();
    this.rightSide.classList.add('right');
  }

  componentDidUpdate(prevProps, prevState) {
    if (this.state.userID !== prevState.userID) {
      this.fetchOtherData();
    }
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

  render() {
    const { activeLogin } = this.state;
    const current = activeLogin ? 'Login' : 'Register';
    const currentActive = activeLogin ? 'login' : 'register';
    let mylogin;
    if (this.state.show) {
      mylogin = <Login />;
    return (
      <React.Fragment>
        <div className='App'>
          <div className='login'>
            <div className='container' ref={(ref) => (this.container = ref)}>
              {activeLogin && (
                <form onSubmit={this.handleCreateUser}>
                  <Register containerRef={(ref) => (this.current = ref)} />
                </form>
              )}
              {!activeLogin && (
                <form onSubmit={this.handleLogin.deleteLogin} >
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

        <button onClick={this.handleLogout} className='btn'>
          Logout
        </button>

        {this.state.fetchedArea ? (
          <div className='display'>
            <div>
              <h1>Test</h1>
              <button onClick={this.fetchData} className='btn'>
                DataFromGovAPI
              </button>
              <button onClick={this.fetchOtherData} className='btn'>
                OtherDataFromMongoDB
              </button>
            </div>

            <br></br>
            <div className='display'>
              <h1>'Appear if state has value...'</h1>
              <div>
                <Display
                  area={this.state.fetchedArea}
                  detail={this.state.fetchedAvailability}
                />
              </div>
            </div>
          </div>
        ) : (
          'State has no value'
        )}
        <div>{/* <Map /> */}</div>
      </React.Fragment>
    );
  }
}
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
