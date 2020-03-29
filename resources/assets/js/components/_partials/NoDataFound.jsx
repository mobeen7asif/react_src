import React, {Component} from 'react';
import { Scrollbars } from 'react-custom-scrollbars';
import {NotificationManager} from "react-notifications";

class NoDataFound extends Component {



    render() {
        return (
          <div>
              <div className="data_notFound_detail">
                  <div className="data_notFound_data">
                      <span><img src="images/not_found_img.png" alt="#" /></span>
                      <strong>Sorry, no data found</strong>
                      <p>There is currently no data for the {this.props.customMessage}</p>
                  </div>
              </div>
          </div>
        );
    }//..... end of render() .....//
}//..... end of Header.




export default NoDataFound;
