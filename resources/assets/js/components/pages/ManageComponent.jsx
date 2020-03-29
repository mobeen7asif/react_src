import React, {Component} from 'react';
import VoucherReport from "./sub-pages/Reports/VoucherReport";
import StampcardReport from "./sub-pages/Reports/StampcardReport";
import CampaignReporting from "./sub-pages/Reports/CampaignReporting";

class ManageComponent extends Component {
    constructor(props) {
        super(props);
        this.state = {currentTab:'voucher',showTab:true,voucher_id:(this.props.match.params.id)?this.props.match.params.id:0};

        this.setActiveTab = this.setActiveTab.bind(this);
    }//..... end of constructor() ....//
    componentDidCatch = (error, info) => {
        show_loader(true);
    };//...... end of componentDidCatch() .....//
    componentDidMount = () => {

        if((this.props.location.pathname.indexOf("/voucher") >= 0)){
            this.setState((prevState)=>({showTab:!prevState.showTab}));
        }
    }

    render() {
        return (
            <div>
                <div className="compaignstabsBttns clearfix">
                    <a  style={{cursor:'pointer'}}  onClick={(e)=>{ this.setActiveTab('voucher') }} className={this.state.currentTab == 'voucher' ? 'compaignsActive' : ''}>Voucher</a>
                    {
                        (this.state.showTab) && (
                            <a  style={{cursor:'pointer'}}  onClick={(e)=>{ this.setActiveTab('stampcard') }} className={this.state.currentTab == 'stampcard' ? 'compaignsActive' : ''}>Stampcard</a>
                        )
                    }


                </div>

                <div className="contentDetail">
                    <div className="autoContent">
                        <div className="contentinner">

                            {
                                this.loadActiveComponent()
                            }

                        </div>
                    </div>
                </div>
            </div>
        );
    }//..... end of render() .....//

    setActiveTab(tab) {
        this.setState({currentTab: tab});
    }//..... end of setActiveTab() .....//
    navigateToCampaignBuilder = (e, slug) => {
        if (e)
            e.preventDefault();
        this.setState({current_page: slug});
        this.props.history.push(slug);
    };//..... end of navigateToCampaignBuilder() .....//
    loadActiveComponent = () => {
        switch (this.state.currentTab){
            case "voucher" :
                return <VoucherReport navigate={this.navigateToCampaignBuilder} voucher_id={this.state.voucher_id}/>;
            case "stampcard" :
                return <StampcardReport />;

            default :
                return "";
        }
    };
}//..... end of members() .....//

export default ManageComponent;
