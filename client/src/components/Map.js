import React from 'react';
import H from '@here/maps-api-for-javascript';
import onResize from 'simple-element-resize-detector';

export default class Map extends React.Component {
	state = {
		addContainer: false,
		mapArea: '',
		zoom: 0,
		lat: 0,
		lng: 0,
	};

	container = null;

	// the reference to the container
	ref = React.createRef();
	// reference to the map
	map = null;

	getMarker = () => {
		let myPromise = new Promise((myResolve, myReject) => {
			console.log(this.state.addContainer);

			//check if there is marker in container via a state addContainer
			if (this.state.addContainer) {
				this.container.removeObjects(this.container.getObjects());
			}

			//to increment count when marker is created
			let count = 0;
			this.props.area.map(async (carpark, index) => {
				try {
					const response = await fetch(
						`https://calvan-proxy.herokuapp.com/https://developers.onemap.sg/commonapi/convert/3414to3857?X=${carpark.x_coord}&Y=${carpark.y_coord}`,
						{
							headers: {
								Accept: 'application/json, text/plain, */*',
								'Content-Type': 'application/json',
							},
							method: 'GET',
						}
					);
					console.log(response);
					const fetched3857 = await response.json();
					console.log(fetched3857);
					const convertedx = fetched3857.X;
					const convertedy = fetched3857.Y;
					const response_1 = await fetch(
						`https://calvan-proxy.herokuapp.com/https://developers.onemap.sg/commonapi/convert/3857to4326?X=${convertedx}&Y=${convertedy}`,
						{
							headers: {
								Accept: 'application/json, text/plain, */*',
								'Content-Type': 'application/json',
							},
							method: 'GET',
						}
					);
					console.log(response_1);
					const coord = await response_1.json();
					console.log(coord);
					const lat = parseFloat(coord.latitude);
					const lng = parseFloat(coord.longitude);
					const marker = new H.map.Marker({ lat: lat, lng: lng });
					marker.setData(carpark);
					marker.addEventListener('tap', (event) => {
						console.log(event.target.getData());
						const markerDetail = event.target.getData();
						this.props.onClickMarker(markerDetail);
					});

					//add marker to container group
					this.container.addObject(marker);

					this.setState({ lat: lat, lng: lng });
					console.log(this.state.lat);
					console.log(this.state.lng);

					//increment count
					count++;
				} catch (err) {
					return console.log(err);
				}

				//condition to resolve promise (when count is equal to number of carparks stored in area state)
				console.log(count);
				if (count === this.props.area.length) {
					console.log('count is equal to array length');
					myResolve('proceed..');
				}
			});
			//add container group to map
			this.map.addObject(this.container);

			//change state for condition checking in componentDidUpdate
			this.setState({
				mapArea: this.props.area,
				addContainer: true,
			});
		});

		//resolve promise - set map center and zoom on change of search area
		myPromise.then(() => {
			this.map.setCenter({ lat: this.state.lat, lng: this.state.lng });
			this.map.setZoom(16);
		});
	};

	componentDidMount() {
		console.log('...mounting map');
		// instantiate a platform, default layers and a map as usual
		const platform = new H.service.Platform({
			apikey: process.env.REACT_APP_API_KEY,
		});

		const layers = platform.createDefaultLayers();
		const map = new H.Map(this.ref.current, layers.vector.normal.map, {
			pixelRatio: window.devicePixelRatio,
			center: { lat: 1.2851962650166864, lng: 103.81800888261792 },
			zoom: 11,
		});

		onResize(this.ref.current, () => {
			map.getViewPort().resize();
		});

		this.map = map;

		const container = new H.map.Group();
		this.container = container;

		// add the interactive behaviour to the map
		new H.mapevents.Behavior(new H.mapevents.MapEvents(map));
	}

	componentDidUpdate() {
		//condition to check area save in state is same as props to prevent re-rendering of markers
		if (this.props.area !== this.state.mapArea) {
			console.log('...updating');
			console.log(this.props.area);
			this.getMarker();
		}
	}

	render() {
		return (
			<React.Fragment>
				<div style={{ width: '100%', height: '100%' }} ref={this.ref} />
			</React.Fragment>
		);
	}
}
