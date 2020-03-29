import React, {Component} from 'react';
import ToggleSwitch from "@trendmicro/react-toggle-switch";
import {NotificationManager} from "react-notifications";

class SegmentCriteria extends Component {

    constructor(props) {
        super(props);
        this.state = {
            is_edit: 0,
            data: []
        };
    }//..... end of constructor() .....//

    componentDidMount = () => {
        this.loadSetting();
    };//--- End of componentDidMount() ---//

    loadSetting = () => {
        show_loader()
        axios.get(BaseUrl + '/api/get-segment-data').then(res => {

            this.setState(() => ({data: res.data.data}));
            show_loader(true);

        }).catch((err) => {
            show_loader(true);

        });
    }

    referredStatusChanged = (value, field_name, type) => {
        let dataArray =  this.state.data;
        let index = dataArray.findIndex(x => x.type === type)
        let new_value = !value;
        let newArray = [];
        let jsonData = JSON.parse(dataArray[index].field2);
         let jsonInde = jsonData.findIndex(t=>t.name ===field_name);
        jsonData[jsonInde].show=new_value;
        dataArray[index].field2= JSON.stringify(jsonData);
        this.setState(()=>({data:dataArray}));
        this.saveData(index,type);
    };
    saveData =(json,type)=>{
        show_loader();
        axios.post(BaseUrl + '/api/save-segment-criteria',{
            fied2:this.state.data[json].field2,
            type:type
        }).then(res => {
            NotificationManager.success("Updated successfully.", 'success', 1500);
            show_loader(true);

        }).catch((err) => {
            show_loader(true);

        });
    }

    render() {
        return (
            <React.Fragment>
                <div className="dropSegmentation_section" id="segment_criteria" style={{display: 'none'}}>


                    <div className="venueInfo_div">
                        <div className="venueIdentification_section2">


                            <div className="faq_description_section">

                                <div className="faq_description_detail">
                                    <div className="faq_description_list">
                                        <ul>
                                        {this.state.data.map((value, key) => {
                                            return (
                                        <li key={key} data-id={value.id}>
                                            <div className="faq_questions" style={{background: "lightgray"}}>
                                                <div
                                                    className="faq_questions_head activeBar" >
                                                    <div className="faq_questions_cell faq_cell1 rightBorder">
                                                        <strong>{key + 1}</strong>

                                                    </div>

                                                    <div className="faq_questions_cell faq_cell2">
                                                        <p>{value.type}</p>
                                                    </div>



                                                </div>

                                                <div className="segment_criteria showfaq_data"
                                                     style={{display:'block' }}>
                                                    {
                                                        JSON.parse(value.field2).map((item) => {
                                                            return (
                                                                <ul>
                                                                    <li className="clearfix" style={{width: '100%',padding:"4px"}}>
                                                                        <div
                                                                             id={'allUsersCriteria'}>
                                                                            <h4 style={{font:'bolder'}}>{item.fieldName}</h4>
                                                                            <div style={{float:"right",marginTop: '-20px'}}>
                                                                                <ToggleSwitch

                                                                                    checked={item.show}
                                                                                    onChange={(e) => {
                                                                                        this.referredStatusChanged(item.show, item.name, value.type)
                                                                                    }}
                                                                                />
                                                                                <span style={{
                                                                                    fontWeight: 'bold',
                                                                                    fontSize: "12px",
                                                                                    color: "gray"
                                                                                }}> {item.show ? "True" : "False"}</span>
                                                                            </div>
                                                                        </div>
                                                                    </li>
                                                                    <br/>
                                                                </ul>
                                                            )
                                                        })
                                                    }
                                                </div>
                                            </div>
                                        </li>
                                            )
                                        })
                                        }
                                        </ul>
                                    </div>

                                </div>

                            </div>




                        </div>
                    </div>


                </div>
            </React.Fragment>
        );
    }//..... end of render() .....//
}//..... end of AddGroup.


export default SegmentCriteria;