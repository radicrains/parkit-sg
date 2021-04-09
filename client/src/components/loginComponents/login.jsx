import React from 'react';
import LeftCar from './image/left_blue_car.png';

export class Login extends React.Component {
    render() {
    return (
      <div className='base-container'>
        <div className='header'></div>
        <div className='content'>
          <div className='image'>
            <img src={LeftCar} alt='login_blue_car' />
          </div>
          <div className='form'>
            <div className='form-group'>
              <label htmlFor='login-username'>Username</label>
              <input
                type='text'
                id='login-username'
                name='username'
                placeholder='username'
                onChange={this.handleChange}
              />
            </div>
            <div className='form-group'>
              <label htmlFor='login-password'>Password</label>
              <input
                type='password'
                id='login-password'
                name='password'
                placeholder='password'
                onChange={this.handleChange}
              />
            </div>
          </div>
        </div>
        <div className='footer'>
          <button type='submit' className='btn' value='Login'>
            Login
          </button>
        </div>
      </div>
    );
  }
}
