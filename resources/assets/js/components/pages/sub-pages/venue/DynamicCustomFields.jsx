import React, {Component} from 'react';
import {NotificationManager} from "react-notifications";


class DynamicCustomFields extends Component {
    state = {
        customFields:[],
        fieldCount : 5000,
    };

    shouldComponentUpdate(nextProps, nextState, nextContext) {
        if(this.props.data != nextProps.data){
            this.getUpdatedCustomFields();
        }
        return true;

    }

    componentDidMount = () => {


    }//..... end of function componentDidMount  .....//

    getUpdatedCustomFields = () => {
        console.log(this.props.data);
        this.setState(()=>({customFields: this.props.data}),()=>{
            if(this.state.customFields.length == 0)
                this.addCustomFields();
        });
    }

    setInputValue = (value,id,field_label)=>{
        let fields = this.state.customFields;
        let index = fields.findIndex(item => item.id == id);
        fields[index][field_label.toLowerCase()]=value;
        this.setState(()=>({customFields:fields}));
        this.returnFields();
    }//..... end of setInputValue  .....//

    addCustomFields = () => {
        let fields = this.state.customFields;
        let custom_field_length = this.state.customFields.length;
        let count = (custom_field_length > 0) ? parseInt(fields[custom_field_length - 1].id) + parseInt(1) : 1 ;
        fields.push({id:count,field_name:"",field_label:"",field_type:"text",segment_name:"",search_name:"",field_unique_id:this.props.field_id+count});
        this.setState(()=>({customFields:fields,fieldCount: count}),()=>{
            this.returnFields();
        })
    }//......  end of addCustomFields  ......//

    removeCustomFields = (id) => {
        let fields = this.state.customFields.filter(value=> value.id != id);
        this.setState(()=>({customFields:fields}));
        this.returnFields();

    }//......  end of removeCustomFields  .....//
    convertSpaceToUnderscore = (str) => str.replace(/\s+/g, '_').toLowerCase();

    returnFields = () => {
        let fields = this.state.customFields.map((value,key)=>{
            value.segment_name="custom_"+value.field_type+"_f"+(value.id);
            value.search_name=this.convertSpaceToUnderscore(value.field_name.trim());
            return value;
        });
        return this.props.getFields(fields);

    }//......  end of saveFields  ......//


    handleChanges = (e) => {
        var index = e.target.selectedIndex;
        var optionElement = e.target.childNodes[index]
        var id =  optionElement.getAttribute('id');
        var value =  optionElement.getAttribute('value');
        this.setInputValue(value,id,"field_type");
        this.returnFields();
    }

    render() {
        return (
            <React.Fragment>
                <div className="dropSegmentation_section">

                    <div className="dropSegmentation_heading clearfix">
                        <h3 style={{fontWeight: 'bold'}}>Member Custom Fields</h3>
                    </div>

                    <div className="venueInfo_div">
                        <div className="venueIdentification_section">
                            <div className="venueIdentification_form">
                                <ul>
                                    {this.state.customFields && (
                                        this.state.customFields.map((value,key)=>{
                                            return (
                                                <li key={key}>
                                                    {/*<label>Field Name</label>*/}
                                                    <div className="compaignSaturation " style={{paddingBottom:"10px"}}>
                                                        <div style={{width:"30%",display:"inline-block",paddingRight:"10px"}}>
                                                            <label style={{fontWeight:"bold"}}>Field Name</label>
                                                            <div className="customInput_div" style={{width:"100%"}}>
                                                                <input type="text" className="change" onChange={(e)=>{this.setInputValue(e.target.value,value.id,"field_name")}} value={value.field_name} placeholder={value.field_name} name={value.field_name} value={value.field_name}  />
                                                            </div>
                                                        </div>

                                                        <div style={{width:"30%",display:"inline-block",paddingRight:"10px"}}>
                                                            <label style={{fontWeight:"bold"}}>Field Label</label>
                                                            <div className="customInput_div" style={{width:"100%"}}>
                                                                <input type="text" className="change" onChange={(e)=>{this.setInputValue(e.target.value,value.id,"field_label")}} value={value.field_label} placeholder={value.field_label} name={value.field_label} value={value.field_label}  />
                                                            </div>
                                                        </div>

                                                        <div style={{width:"30%",display:"inline-block",paddingLeft:"10px"}}>
                                                            <label style={{fontWeight:"bold"}}>Field Type</label>
                                                            <div className="" style={{width:"100%"}}>

                                                                <select style={{border: "1px solid lightgray",width: "100%",height:"38px"}} id="mainselection" onChange={(e)=>{this.handleChanges(e)}} value={value.field_type} >
                                                                    <option value="text" id={value.id} >Text</option>
                                                                    <option value="number" id={value.id} >Number</option>
                                                                    <option value="date" id={value.id} >Date</option>
                                                                </select>
                                                            </div>
                                                        </div>
                                                        <div style={{width:"10%",display:"inline-block",paddingLeft:"20px"}}>
                                                            {this.state.customFields.length > 1 && (
                                                                <div  id="auto_checkout_btn" style={{display: 'block',textAlign:'left'}}>
                                                                <span><span style={{  fontSize: '20px',
                                                                    marginRight: '10px'}}><i
                                                                    className="fa fa-minus-circle"
                                                                    aria-hidden="true" style={{color:'red'}} onClick={()=>{this.removeCustomFields(value.id)}}></i></span>
                                                                    </span>
                                                                </div>
                                                            )}

                                                        </div>
                                                    </div>

                                                </li>
                                            )
                                        })
                                    )}

                                    <li>
                                        <div className="compaignSaturation " style={{padding:"10px"}}>
                                            <div style={{width:"30%",display:"inline-block",paddingRight:"10px"}}>
                                            </div>
                                            <div style={{width:"30%",display:"inline-block",paddingLeft:"10px"}}>

                                            </div>
                                            <div style={{width:"30%",display:"inline-block",paddingLeft:"10px"}}>

                                            </div>
                                            <div style={{width:"10%",display:"inline-block",paddingLeft:"20px"}}>
                                                <div  id="auto_checkout_btn" style={{display: 'block',textAlign:'left'}}>
                                                    <span><span style={{  fontSize: '20px',
                                                        marginRight: '10px'}}><i
                                                        className="fa fa-plus-circle"
                                                         style={{color:'green'}} onClick={()=>{this.addCustomFields()}}></i></span>
                                                        </span>
                                                </div>
                                            </div>
                                        </div>
                                    </li>
                                        {this.state.customFields.length > 0 && (
                                            <li>
                                                <div className="compaignSaturation ">
                                                    <div className="continueCancel" id="skinning_save_btn" style={{display: 'block',textAlign:'left',marginTop:'20px'}}>
                                                        <input  className="selecCompaignBttn" onClick={()=>{this.saveFields()}} type="submit" value="Save"  />
                                                    </div>
                                                </div>
                                            </li>
                                        )}
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </React.Fragment>
        );
    }//..... end of render() .....//
}//..... end of CustomFields.

export default DynamicCustomFields;