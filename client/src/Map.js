import React from 'react';
import H from "@here/maps-api-for-javascript";
import onResize from 'simple-element-resize-detector';
import Markers from './Markers';

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
      // map.addEventListener('mapviewchange', this.handleMapViewChange);

      // add the interactive behaviour to the map
      new H.mapevents.Behavior(new H.mapevents.MapEvents(map));

      

    }
    
  }

  // componentWillUnmount() {
  //   if (this.map) {
  //     this.map.removeEventListener('mapviewchange', this.handleMapViewChange);
  //   }
  // }

  // handleMapViewChange = (ev) => {
  //   const {
  //     onMapViewChange
  //   } = this.props;
  //   if (ev.newValue && ev.newValue.lookAt) {
  //     const lookAt = ev.newValue.lookAt;
  //     // adjust precision
  //     const lat = Math.trunc(lookAt.position.lat * 1E7) / 1E7;
  //     const lng = Math.trunc(lookAt.position.lng * 1E7) / 1E7;
  //     const zoom = Math.trunc(lookAt.zoom * 1E2) / 1E2;
  //     onMapViewChange(zoom, lat, lng);
  //     console.log('this ran...')
  //   }
  // }

  render() {
    return (
      <React.Fragment>
        <div
          style={{ width: '100%', height:'300px' }}
          ref={this.ref}
        />
        <Markers onClickMarker={this.props.onClickMarker} area={this.props.area} map={this.map}/>
      </React.Fragment>
    )
  }
}
