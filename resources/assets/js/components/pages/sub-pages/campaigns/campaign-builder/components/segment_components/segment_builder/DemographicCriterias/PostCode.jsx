import React, {Component} from 'react';
import { Scrollbars } from 'react-custom-scrollbars';

class PostCode extends Component {

    state = {
        post_codes : ["4000", "4001", "4002", "4004", "4005", "4006", "4007", "4008", "4009", "4010", "4011", "4012",
            "4013", "4014", "4017", "4018", "4019", "4020", "4021", "4022", "4025", "4030", "4031", "4032", "4034",
            "4035", "4036", "4037", "4051", "4053", "4054", "4055", "4059", "4060", "4061", "4064", "4065", "4066",
            "4067", "4068", "4069", "4070", "4073", "4074", "4075", "4076", "4077", "4078", "4101", "4102", "4103",
            "4104", "4105", "4106", "4107", "4108", "4109", "4110", "4111", "4112", "4113", "4114", "4115", "4116",
            "4117", "4118", "4119", "4120", "4121", "4122", "4123", "4124", "4125", "4127", "4128", "4129", "4130",
            "4131", "4132", "4133", "4151", "4152", "4153", "4154", "4155", "4156", "4157", "4158", "4159", "4160",
            "4161", "4163", "4164", "4165", "4169", "4170", "4171", "4172", "4173", "4174", "4178", "4179", "4183",
            "4184", "4205", "4207", "4208", "4209", "4210", "4211", "4212", "4213", "4214", "4215", "4216", "4217",
            "4218", "4220", "4221", "4223", "4224", "4225", "4226", "4227", "4228", "4270", "4271", "4272", "4275",
            "4280", "4285", "4287", "4300", "4301", "4303", "4304", "4305", "4306", "4307", "4309", "4310", "4311",
            "4312", "4313", "4340", "4341", "4342", "4343", "4344", "4346", "4347", "4350", "4352", "4353", "4354",
            "4355", "4356", "4357", "4358", "4359", "4360", "4361", "4362", "4363", "4364", "4365", "4370", "4371",
            "4372", "4373", "4374", "4375", "4376", "4377", "4378", "4380", "4381", "4382", "4383", "4384", "4385",
            "4387", "4388", "4390", "4400", "4401", "4402", "4403", "4404", "4405", "4406", "4407", "4408", "4410",
            "4411", "4412", "4413", "4415", "4416", "4417", "4418", "4419", "4420", "4421", "4422", "4423", "4424",
            "4425", "4426", "4427", "4428", "4454", "4455", "4461", "4462", "4465", "4467", "4468", "4470", "4472",
            "4474", "4477", "4478", "4479", "4480", "4481", "4482", "4486", "4487", "4488", "4489", "4490", "4491",
            "4492", "4493", "4494", "4496", "4497", "4498", "4500", "4501", "4502", "4503", "4504", "4505", "4506",
            "4507", "4508", "4509", "4510", "4511", "4512", "4514", "4515", "4516", "4517", "4518", "4519", "4520",
            "4521", "4550", "4551", "4552", "4553", "4554", "4555", "4556", "4557", "4558", "4559", "4560", "4561",
            "4562", "4563", "4564", "4565", "4566", "4567", "4568", "4569", "4570", "4571", "4572", "4573", "4574",
            "4575", "4580", "4581", "4600", "4601", "4605", "4606", "4608", "4610", "4611", "4612", "4613", "4614",
            "4615", "4620", "4621", "4625", "4626", "4627", "4630", "4650", "4655", "4659", "4660", "4662", "4670",
            "4671", "4673", "4674", "4676", "4677", "4678", "4680", "4694", "4695", "4697", "4699", "4700", "4701",
            "4702", "4703", "4704", "4705", "4706", "4707", "4709", "4710", "4711", "4712", "4713", "4714", "4715",
            "4716", "4717", "4718", "4719", "4720", "4721", "4722", "4723", "4724", "4725", "4726", "4727", "4728",
            "4730", "4731", "4732", "4733", "4735", "4736", "4737", "4738", "4739", "4740", "4741", "4742", "4743",
            "4744", "4745", "4746", "4750", "4751", "4753", "4754", "4756", "4757", "4798", "4799", "4800", "4802",
            "4803", "4804", "4805", "4806", "4807", "4808", "4809", "4810", "4811", "4812", "4814", "4815", "4816",
            "4817", "4818", "4819", "4820", "4821", "4822", "4823", "4824", "4825", "4828", "4829", "4830", "4849",
            "4850", "4852", "4854", "4855", "4856", "4858", "4859", "4860", "4861", "4865", "4868", "4869", "4870",
            "4871", "4872", "4873", "4874", "4875", "4876", "4877", "4878", "4879", "4880", "4881", "4882", "4883",
            "4884", "4885", "4886", "4887", "4888", "4890", "4891", "4892", "4895"],
        searchValue: ''
    };

    selectAllPostalCodes = () => {
        this.setCriteriaValue(this.state.post_codes);
    };//..... end of selectAllStates() ......//

    clearAllPostalCodes = () => {
        this.setCriteriaValue([]);
    };//..... end of clearAllStates() ......//

    setCriteriaValue = (value) => {
        this.props.setCriteriaValue('residential_address.postal_code', 'value', value);
    };//..... end of setCriteriaValue() .....//

    setPostalCodeValue = (state) => {
        let newStates = this.props.criteria.value;
        if (newStates.indexOf(state) === -1) {
            newStates.push(state);
        } else {
            newStates = this.props.criteria.value.filter((st) => st !== state);
        }//..... end if-else() .....//

        this.setCriteriaValue(newStates);
    };//..... end of setStateValue() ......//

    getPostalCodes = () => {
        return this.state.post_codes.filter((code) => code.indexOf(this.state.searchValue) !== -1);
    };//..... end of getPostalCodes() .....//

    setSearchValue = (value) => {
        this.setState(() => ({searchValue: value}));
    };//..... end of setSearchValue() ......//

    componentDidCatch = (error, info) => {
        show_loader(true);
    };//...... end of componentDidCatch() .....//

    render() {
        return (
            <div className="dropSegmentation_section">
                <div className="dropSegmentation_heading clearfix">
                    <h3>Postcode / Suburb</h3>
                    <div className="segmntClose" onClick={(e)=> {this.props.removeCriteria('residential_address.postal_code')}}>
                        <a  style={{cursor:'pointer'}}>&nbsp;</a>
                    </div>
                </div>
                <div className="stateSegmentation">
                    <div className="compaignDescription_outer clearfix">
                        <div className="tagsCompaigns_detail clearfix">
                            <div className="tagsCompaigns_list">
                                <div className="postcodeSearch">
                                    <input placeholder="Search Campaign" className="copmpaignSearch_field" type="text" value={this.state.searchValue} onChange={(e) => {this.setSearchValue(e.target.value)}} />
                                    <input className="copmpaignIcon_field" type="submit" style={{textIndent: '-999px'}}/>
                                </div>
                                <div className="tagsCompaigns_listScroll" style={{textAlign: 'left'}}>
                                    <Scrollbars autoHeight renderTrackHorizontal={() => <div></div>} renderThumbHorizontal={() => <div></div>}>
                                        <ul>
                                            {this.getPostalCodes().map((value) => {
                                                return <li key={value} onClick={()=> this.setPostalCodeValue(value)} className={(this.props.criteria.value.indexOf(value) !== -1) ? 'selectedItem' : ''}>{value}</li>;
                                            })}
                                        </ul>
                                    </Scrollbars>
                                </div>
                            </div>
                            <div className="tagsSelected_tip">
                                <div className="selected_tip" style={{textAlign: 'left'}}>
                                    <i>TIP</i> <p>Use the Control (Ctrl on Windows) or Command (âŒ˜ on Mac)key to select or unselect items.</p>
                                    <button onClick={this.selectAllPostalCodes}>SELECT ALL</button>
                                    <button onClick={this.clearAllPostalCodes}>CLEAR ALL</button>
                                </div>
                            </div>
                        </div>
                        <div className="selectedTags"><label>Selected</label>
                            <div className="showTags clearfix">
                                <Scrollbars autoHeight renderTrackHorizontal={() => <div></div>} renderThumbHorizontal={() => <div></div>}>
                                    <span>
                                        {this.props.criteria.value.map((value) => {
                                            return <a  style={{cursor:'pointer'}} onClick={()=> this.setPostalCodeValue(value)} key={value}>
                                                {value}
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
}//..... end of PostCode.

export default PostCode;