import React, {Component} from 'react';

class UserLiveLocation extends Component {
    state = {
        interval:15
    };
    componentDidMount =() =>{
        this.props.setCriteriaValue('user_gps_detect', 'value', VenueID);
        this.props.setCriteriaValue('user_gps_detect', 'interval', this.state.interval);
        let preVal = this.props.criteria;
        if(this.props.criteria.interval){
            this.setState(()=>({interval:this.props.criteria.interval}));
        }
    };

    componentDidCatch = (error, info) => {
        show_loader(true);
    };//...... end of componentDidCatch() .....//

    handleInterval = (e) => {
        let value = e.target.value;
        this.setState(()=>({interval:value}));
        this.props.setCriteriaValue('user_gps_detect', 'interval', value);

    };

    render() {
        return (
            <div className="dropSegmentation_section">
                <div className="dropSegmentation_heading clearfix">
                    <h3>User GPS</h3>
                    <div className="segmntClose" onClick={(e)=> {this.props.removeCriteria('user_gps_detect')}}>
                        <a  style={{cursor:'pointer'}}>&nbsp;</a>
                    </div>
                </div>
              <div className="stateSegmentation">
                    <div className="compaignDescription_outer clearfix">
                        <label>Scan User Against GPS</label>
                        <div className="memberNumberOuter clearfix">
                            <div className="memberNumbe">
                                <div className="numberFields clearfix">
                                    <input  type="text" placeholder={VenueName} style={{width:100+'%'}} readOnly/>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>


                <div className="stateSegmentation">
                    <div className="compaignDescription_outer clearfix">
                        <label>Interval in Hours</label>
                        <div className="memberNumberOuter clearfix">
                            <div className="memberNumbe">
                                <div className="numberFields clearfix">
                                    <input  type="text" value={this.state.interval} placeholder="Interval" style={{width:100+'%'}} onChange={(e) => {this.handleInterval(e)}} />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

            </div>
        );
    }//..... end of render() .....//

}//..... end of User Sign Up.

export default UserLiveLocation;