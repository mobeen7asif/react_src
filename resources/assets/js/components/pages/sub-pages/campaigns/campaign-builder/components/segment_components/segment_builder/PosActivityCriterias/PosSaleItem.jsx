import React, {Component} from 'react';
import { Scrollbars } from 'react-custom-scrollbars';
import {find} from 'lodash';
import {NotificationManager} from "react-notifications";

class PosSaleItem extends Component {

    state = {
        items: []
    };

    selectAll = () => {
        this.setCriteriaValue(this.state.items);
    };//..... end of selectAll() ......//

    clearAll = () => {
        this.setCriteriaValue([]);
    };//..... end of clearAll() ......//

    setCriteriaValue = (value) => {
        this.props.setCriteriaValue('pos_sale_item', 'value', value);
    };//..... end of setCriteriaValue() .....//

    setSelectedValue = (value) => {
        let newStates = this.props.criteria.value;
        if (!find(newStates, value)) {
            newStates.push(value);
        } else {
            newStates = this.props.criteria.value.filter((st) => st.id !== value.id);
        }//..... end if-else() .....//

        this.setCriteriaValue(newStates);
    };//..... end of setStateValue() ......//

    componentDidMount = () => {
        show_loader();
        axios.get(BaseUrl + `/api/pos-sale-items-list/${CompanyID}/${VenueID}`)
            .then((response) => {
                show_loader();
                this.setState({items: response.data});
            }).catch((err) => {
            show_loader();
            NotificationManager.error("Error occurred while fetching pos sales items.", 'Error');
        });
    };//..... end of componentDidMount() .....//

    componentDidCatch = (error, info) => {
        show_loader(true);
    };//...... end of componentDidCatch() .....//

    render() {
        return (
            <div className="dropSegmentation_section">
                <div className="dropSegmentation_heading clearfix">
                    <h3>POS Sale Item</h3>
                    <div className="segmntClose"  onClick={(e)=> {this.props.removeCriteria('pos_sale_item')}}>
                        <a  style={{cursor:'pointer'}}>&nbsp;</a>
                    </div>
                </div>
                <div className="stateSegmentation">
                    <div className="compaignDescription_outer clearfix">
                        <label>Item</label>
                        <div className="tagsCompaigns_detail clearfix">
                            <div className="tagsCompaigns_list">
                                <div className="tagsCompaigns_listScroll tagsScroll">
                                    <Scrollbars autoHeight renderTrackHorizontal={() => <div></div>} renderThumbHorizontal={() => <div></div>}>
                                        <ul style={{height: '197px'}}>
                                            {this.state.items.map((value) => {
                                                return <li key={value.id} onClick={()=> this.setSelectedValue(value)} className={(find(this.props.criteria.value, value)) ? 'selectedItem' : ''}>{value.name}</li>;
                                            })}
                                        </ul>
                                    </Scrollbars>
                                </div>
                            </div>
                            <div className="tagsSelected_tip">
                                <div className="selected_tip">
                                    <i>TIP</i>
                                    <p>Use the Control (Ctrl on Windows) or Command (âŒ˜ on Mac)key to select or unselect items.</p>
                                    <button onClick={this.selectAll}>SELECT ALL</button>
                                    <button onClick={this.clearAll}>CLEAR ALL</button>
                                </div>
                            </div>
                        </div>
                        <div className="selectedTags">
                            <label>Selected</label>
                            <div className="showTags clearfix">
                                <Scrollbars autoHeight renderTrackHorizontal={() => <div></div>} renderThumbHorizontal={() => <div></div>}>
                                    <span>
                                        {this.props.criteria.value.map((value) => {
                                            return <a  style={{cursor:'pointer'}} onClick={()=> this.setSelectedValue(value)} key={value.id}>
                                                {value.name}
                                                <i>&nbsp;</i>
                                            </a>
                                        })}
                                    </span>
                                </Scrollbars>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }//..... end of render() .....//
}//..... end of PosSaleItem.

export default PosSaleItem;