import React from 'react';
import H from "@here/maps-api-for-javascript";
import onResize from 'simple-element-resize-detector';

export default class Map extends React.Component {
  constructor(props) {
    super(props);
    // the reference to the container
    this.ref = React.createRef();
    // reference to the map
    this.map = null;
  }

  // fetchHelper = async (url) => {
  //   try {
  //     const response = await fetch(url, {
  //       headers: {
  //           'Accept': 'application/json, text/plain, */*',
  //           'Content-Type': 'application/json',
  //       },
  //       method: 'GET',
  //     })
  //     return response;
  //   }
  //   catch (err) {
  //     console.log(err)
  //   }
  // }

  componentDidMount() {
    if (!this.map) {
      // instantiate a platform, default layers and a map as usual
      const platform = new H.service.Platform({
        apikey: 'lWuHiqHF3US-TtO2Xt7u6rDZr2tjAAftuXnhwVAgZ3s'
      });
      const layers = platform.createDefaultLayers();
      const map = new H.Map(
        this.ref.current,
        layers.vector.normal.map,
        {
          pixelRatio: window.devicePixelRatio,
          center: {lat: 1.2851962650166864, lng: 103.81800888261792},
          zoom: 17,
        },
      );
      onResize(this.ref.current, () => {
        map.getViewPort().resize();
      });
      this.map = map;

      // attach the listener
      map.addEventListener('mapviewchange', this.handleMapViewChange);

      // add the interactive behaviour to the map
      new H.mapevents.Behavior(new H.mapevents.MapEvents(map));

      // add markers
      this.props.area.map((carpark, index) => {

        console.log(`https://developers.onemap.sg/commonapi/convert/3414to3857?X=${carpark.x_coord}&Y=${carpark.y_coord}`);

        fetch(`/coordinate?X=${carpark.x_coord}&Y=${carpark.y_coord}`, {
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
        .then((fetched3857) => {
          console.log(fetched3857);
          const lat = parseFloat(fetched3857.latitude)
          const lng = parseFloat(fetched3857.longitude)

          console.log(lat);
          console.log(lng);
          

          // fetch(`https://developers.onemap.sg/commonapi/convert/3857to4326?X=${x}&Y=${y}`, {
          //   headers: {
          //       'Accept': 'application/json, text/plain, */*',
          //       'Content-Type': 'application/json',
          //   },
          //   method: 'GET',
          // })
          // .then((response) => {
          //   console.log(response);
          //   return response.json()
          // })
          // .then((fetchedLatLng) => {
          //   console.log(fetchedLatLng);
          //   lat = fetchedLatLng.latitude
          //   lng = fetchedLatLng.longitude
          // })

          const marker = new H.map.Marker({lat:lat, lng:lng});
          marker.setData(carpark);
          marker.addEventListener('tap', (event) => {
            console.log(event.target.getData());
            const markerDetail = event.target.getData();
            this.props.onClickMarker(markerDetail);
          })
          return map.addObject(marker);
          
        }).catch(err => console.log(err));

        

        
      })

    }
    
  }

  componentWillUnmount() {
    if (this.map) {
      this.map.removeEventListener('mapviewchange', this.handleMapViewChange);
    }
  }

  handleMapViewChange = (ev) => {
    const {
      onMapViewChange
    } = this.props;
    if (ev.newValue && ev.newValue.lookAt) {
      const lookAt = ev.newValue.lookAt;
      // adjust precision
      const lat = Math.trunc(lookAt.position.lat * 1E7) / 1E7;
      const lng = Math.trunc(lookAt.position.lng * 1E7) / 1E7;
      const zoom = Math.trunc(lookAt.zoom * 1E2) / 1E2;
      onMapViewChange(zoom, lat, lng);
      console.log('this ran...')
    }
  }

  render() {
    return (
      <div
        style={{ width: '100%', height:'300px' }}
        ref={this.ref}
      />
    )
  }
}
