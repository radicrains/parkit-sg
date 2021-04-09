import React from 'react';
import RightCar from './image/right_car.png';

export class Register extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div className='base-container'>
        <div className='header'>Register</div>
        <div className='content'>
          <div className='image'>
            <img src={RightCar} />
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
                type='text'
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
