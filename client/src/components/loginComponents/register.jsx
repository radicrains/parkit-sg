import React from 'react';
import RightCar from './image/right_car.png';

export class Register extends React.Component {

  render() {
    return (
      <div className='base-container'>
        <div className='header'></div>
        <div className='content'>
          <div className='image'>
            <img src={RightCar} alt='red'/>
          </div>
          <div className='form'>
            <div className='form-group'>
              <label htmlFor='create-username'>Username</label>
              <input
                type='text'
                id='create-username'
                name='username'
                placeholder='username'
                onChange={this.handleChange}
              />
            </div>

            <div className='form-group'>
              <label htmlFor='create-password'>Password</label>
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
          <button type='submit' className='btn' value='Create User'>
            Register
          </button>
        </div>
      </div>
    );
  }
}
