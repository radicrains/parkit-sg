import React from 'react'


class Searchbar extends React.Component {

    handleSubmit = (event) => {
        event.preventDefault();
        const searchStr = new FormData(event.target);
        console.log(searchStr.get('search'));
        this.props.onSearch(searchStr.get('search'));
        event.target.reset();
    }


    render() {
        return (
            <React.Fragment>
                <div>
                    <form onSubmit={this.handleSubmit}>
                            <label htmlFor="searchbar"></label>
                            <input type="text" id="searchbar" name="search" placeholder="Search Here"></input>
                    </form>
                </div>
            </React.Fragment>
            
        )
    }
}








export default Searchbar;
