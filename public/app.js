class CarparkSlots extends React.Component {
    render() {
        return (
            this.props.details.map((detail, index) => {
                return (
                    detail.carpark_number == this.props.carParkNo ?
                        <div>
                            There is {detail.carpark_info[0].lots_available} slot available for Lot Type: {detail.carpark_info[0].lot_type}
                        </div>
                    : ''
                )
            })  
            
        )
    }
}



class Display extends React.Component {
    render() {
        return (
            <div>
                {this.props.area.map((carpark, index) => {
                    return(
                        <div id={carpark.car_park_no}>{carpark.address} <CarparkSlots details={this.props.detail} carParkNo={carpark.car_park_no}/></div>
                    )
                })}
            </div>
        )
    }
}



class App extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
            area: 'yishun',
            fetchedArea: '',
            fetchedDetails: '',
        };
	}

    fetchData = () => {
        fetch('/CarparkAvailability')
        .then((response) => {
            console.log(response);
            return response.json()
        })
        .then((fetchedData) => {
            this.setState({fetchedDetails: fetchedData.items[0].carpark_data})
            console.log(this.state.fetchedDetails);
            
        }).catch(err => console.log(err));
    }

    fetchOtherData = () => {
        fetch('/CarparkDetails?area=' + this.state.area)
        .then((response) => {
            console.log(response);
            return response.json()
        })
        .then((fetchedData) => {
            this.setState({fetchedArea: fetchedData})
            console.log(this.state.fetchedArea);
            
        }).catch(err => console.log(err));
    }

    componentDidMount() {
        this.fetchData()
        this.fetchOtherData()
    }


	render() {
		return (
            this.state.fetchedDetails ?
			<div>
                Test
                <button onClick={this.fetchData}>DataFromGovAPI</button>
                <button onClick={this.fetchOtherData}>OtherDataFromMongoDB</button>
                <br></br>
                
                'Appear if state has value...'
                <Display area={this.state.fetchedArea} detail={this.state.fetchedDetails} />
            </div>
            : 'State has no value'
		);
	}
}



ReactDOM.render(<App />, document.querySelector('.container'));

///////////Code Graveyard/////////////////////////

    // componentDidMount() {
    //     fetch('http://localhost:3003/carparkToken')
    //     .then((response) => {
    //       console.log(response);
    //      return response.json()
    //     })
    //     .then((fetchedToken) => {
    //         console.log(fetchedToken);
    //         this.setState({token: fetchedToken.Result})
    //         console.log(this.state.token);
    //     }).catch(err => console.log(err)); 


    //     /////////////////////////////////////////////////////////////

    //     fetch('http://localhost:3003/carparkAvailability')
    //     .then((response) => {
    //       console.log(response);
    //      return response.json()
    //     })
    //     .then(fetchedAvailability => {
          
    //         console.log(fetchedAvailability.Result);
            
    //     }).catch(err => console.log(err));   

    //     /////////////////////////////////////////////////////////////

        
    // }