import React, {Component} from 'react';
import Select from 'react-select';

class StoreName extends Component {

    constructor(props) {
        super(props);
        this.state = {
            selectedOption:null,
            optionList:[]
        };
    }//..... end of constructor() .....//


    componentDidMount = () => {
        if(this.props.criteria.value.listStores.length > 0)
            this.setState(()=>({selectedOption:this.props.criteria.value.listStores}));
        show_loader();
        axios.post(`${BaseUrl}/api/list-stores`,{
            venue_id            : VenueID
        }).then(res => {
            this.setState(()=>({optionList: res.data.data}));
            show_loader(true);
        }).catch((err) => {
            show_loader(true);
        });

    }


    setCriteriaValue = (value) => {
        this.props.setCriteriaValue('venue_store_name', 'value', value);
    };//..... end of setCriteriaValue() .....//




    componentDidCatch = (error, info) => {
        show_loader(true);
    };//...... end of componentDidCatch() .....//

    handleSelectChange =(selectedOption)=> {
        if(selectedOption == null){
            selectedOption = [];
        }

        this.setState(
            ()=>({selectedOption}),

            () => {
                let preVal = this.props.criteria.value;
                preVal.listStores = this.state.selectedOption;
                this.setCriteriaValue(preVal);

            }
        );
    };

    render() {
        return (
            <div className="dropSegmentation_section">
                <div className="dropSegmentation_heading clearfix">
                    <h3>Store Name</h3>
                    <div className="segmntClose" onClick={(e)=> {this.props.removeCriteria('venue_store_name')}}>
                        <a href="javascript:void(0)">&nbsp;</a>
                    </div>
                </div>

                <div className="stateSegmentation">
                    <div className="compaignDescription_outer clearfix">
                        {/*<label>Store listing is</label>*/}
                        <div className="memberNumberOuter clearfix">
                            <div className="memberNumber_placeholder" style={{width:"100%"}}>
                                <div className="placeHolderOuter clearfix">
                                    <Select
                                        value={this.state.selectedOption}
                                        onChange={this.handleSelectChange}
                                        options={this.state.optionList}
                                        isMulti={true}
                                        placeholder={"Select Store ...."}
                                    />
                                </div>
                            </div>

                        </div>
                    </div>
                </div>
            </div>
        );
    }//..... end of render() .....//

}//..... end of StoreName.

export default StoreName;