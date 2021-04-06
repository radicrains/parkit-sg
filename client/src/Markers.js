import React from 'react';
import H from "@here/maps-api-for-javascript";



class Markers extends React.Component {
    render() {
        return (
            // add markers
            this.props.area.map((carpark, index) => {

                // console.log(`https://developers.onemap.sg/commonapi/convert/3414to3857?X=${carpark.x_coord}&Y=${carpark.y_coord}`);

                fetch(`https://calvan-proxy.herokuapp.com/https://developers.onemap.sg/commonapi/convert/3414to3857?X=${carpark.x_coord}&Y=${carpark.y_coord}`, {
                    headers: {
                    'Accept': 'application/json, text/plain, */*',
                    'Content-Type': 'application/json',
                    
                    },
                    method: 'GET',
                    })
                .then((response) => {
                    console.log(response);
                    return response.json();
                    })
                .then((fetched3857) => {
                    console.log(fetched3857);
                    const convertedx = fetched3857.X
                    const convertedy = fetched3857.Y

                    fetch(`https://calvan-proxy.herokuapp.com/https://developers.onemap.sg/commonapi/convert/3857to4326?X=${convertedx}&Y=${convertedy}`, {
                        headers: {
                        'Accept': 'application/json, text/plain, */*',
                        'Content-Type': 'application/json',
                        
                        },
                        method: 'GET',
                        })
                        .then((response) => {
                            console.log(response);
                            return response.json();
                        })
                        .then((fetched4326) => {
                            console.log(fetched4326);
                            const lat = parseFloat(fetched4326.latitude)
                            const lng = parseFloat(fetched4326.longitude)

                            console.log(lat);
                            console.log(lng);

                            const marker = new H.map.Marker({lat:lat, lng:lng});
                            marker.setData(carpark);
                            marker.addEventListener('tap', (event) => {
                            console.log(event.target.getData());
                            const markerDetail = event.target.getData();
                            this.props.onClickMarker(markerDetail);
                            

                        })
                        return this.props.map.addObject(marker);


                    
                    })
                    
            
                }).catch(err => console.log(err));

            })
            
        )
    }
}






export default Markers;