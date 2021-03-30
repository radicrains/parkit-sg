class App extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
            carpark: [],
        };
	}

    componentDidMount() {
        fetch('http://localhost:3003/carparkToken')
        .then((response) => {
          console.log(response);
         return response.json()
        })
        .then(fetchedToken => {
          
            console.log(fetchedToken);
            
        }).catch(err => console.log(err)); 


        /////////////////////////////////////////////////////////////

        fetch('http://localhost:3003/carparkAvailability')
        .then((response) => {
          console.log(response);
         return response.json()
        })
        .then(fetchedAvailability => {
          
            console.log(fetchedAvailability.Result);
            
        }).catch(err => console.log(err));   

        /////////////////////////////////////////////////////////////

        fetch('http://localhost:3003/carparkListDetails')
        .then((response) => {
          console.log(response);
         return response.json()
        })
        .then(fetchedListDetails => {
          
            console.log(fetchedListDetails.Result);
            
        }).catch(err => console.log(err));   
    }

    // deleteAnimal = (index) => {
    //     this.setState({
    //         animals: [
    //             ...this.state.animals.slice(0, index), 
    //             ...this.state.animals.slice(index + 1)
    //         ]
    //     })
    // }

    // updateAnimal = (animals) => {
    //     this.setState({
    //         animals: animals
    //     });
    // }
    

	render() {
		return (
			<div>
                Test
                <button></button>
            </div>
		);
	}
}



ReactDOM.render(<App />, document.querySelector('.container'));