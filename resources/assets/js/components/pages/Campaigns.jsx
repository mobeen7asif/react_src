import React, {Component} from 'react';
import CampaignList from "./sub-pages/campaigns/campaign-list/CampaignList";
import CampaignBuilder from "./sub-pages/campaigns/campaign-builder/CampaignBuilder";
import Gamification from "./Gamification";
import Competition from "./Competition";
import Survey from "./Survey";
import NotFound from "./NotFound";

class Campaigns extends Component {
    constructor(props) {
        super(props);
        this.state = {
            current_page: this.props.location.pathname

        };
    }

    componentDidCatch = (error, info) => {
        show_loader(true);
    };//...... end of componentDidCatch() .....//

    render() {

        if(!(appPermission("Campaigns","view"))){
            return <NotFound/>
        }else{
            return (
                <div>
                    <div className="compaignstabsBttns clearfix">
                        {(appPermission("Campaign List","view") && appPermission("Campaigns","view") ) && (
                            <a  style={{cursor:'pointer'}} onClick={(e)=> {this.navigateToCampaignBuilder(e, '/campaigns')}} className={(this.props.location.pathname === '/campaigns') ? 'compaignsActive': ''}>CAMPAIGN LIST</a>
                        )}
                        {(appPermission("Campaign Builder","add") && appPermission("Campaigns","view")) && (
                            <a  style={{cursor:'pointer'}} onClick={(e)=> {this.navigateToCampaignBuilder(e, (this.props.match.params.id) ? `/campaigns/builder/${this.props.match.params.id}` : '/campaigns/builder')}} className={(this.props.match.path === '/campaigns/builder/:id?') ? 'compaignsActive': ''}>CAMPAIGN BUILDER</a>
                        )}

                    </div>
                    {/*{(this.state.current_page === '/campaigns') ? <CampaignList navigate={this.navigateToCampaignBuilder}/>

                    : (<CampaignBuilder navigate={this.navigateToCampaignBuilder} editableId={this.props.match.params.id}/>)}*/}
                    {this.getComponent()}
                </div>
            );
        }

    }//...... end of render() ......//

    navigateToCampaignBuilder = (e, slug) => {
        if (e)
            e.preventDefault();
        this.setState({current_page: slug});
        this.props.history.push(slug);
    };//..... end of navigateToCampaignBuilder() .....//

    getComponent = () => {

        switch (this.state.current_page) {
            case '/campaigns':
                return <CampaignList navigate={this.navigateToCampaignBuilder}/>;
            case '/campaigns/':
                return <CampaignList navigate={this.navigateToCampaignBuilder}/>;

            default:
                return <CampaignBuilder navigate={this.navigateToCampaignBuilder} editableId={this.props.match.params.id}/>;
        }
    }
}//...... end of Campaigns.

export default Campaigns;
