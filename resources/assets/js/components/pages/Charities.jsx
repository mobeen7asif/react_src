import React, {Component} from 'react';
import AddCharities from "./sub-pages/Charities/AddCharities";
import CharityBankInfo from "./sub-pages/Charities/CharityBankInfo";
import AddCharityTiers from "./sub-pages/Charities/AddCharityTiers";
import VenueCharitiesReport from "./sub-pages/Charities/VenueCharitiesReport";

class Charities extends Component {
    constructor(props) {
        super(props);
        this.state = {
            currentMenu :"Charities"
        };
    }//..... end of constructor() .....//

    changeMenue =(menuName) => {
        this.setState({currentMenu : menuName},() => {
            this.loadComponent();
        });
    };

    loadComponent = () => {
        switch (this.state.currentMenu) {
            case ("Charities"):
                return <AddCharities/>;
            case ("Report"):
                return <VenueCharitiesReport/>;
            case ("AddCharityTier"):
                return <AddCharityTiers/>;
        }
    };

    render() {
        return (
            <div>
                <React.Fragment>
                    <div className="compaignstabsBttns change_colorTab clearfix">
                        {(appPermission("Charities List","view")) && (
                            <a  style={{cursor:'pointer'}} className={this.state.currentMenu === 'Charities' ? "compaignsActive" : ""} onClick={(e)=>{this.changeMenue("Charities")}}>Charities List</a>
                        )}

                        {(appPermission("Tiers","view")) && (
                            <a  style={{cursor:'pointer'}} className={this.state.currentMenu === 'AddCharityTier' ? "compaignsActive" : ""} onClick={(e)=>{this.changeMenue("AddCharityTier")}}>Tiers</a>
                        )}
                        {(appPermission("Venue Charities Report","view")) && (
                            <a  style={{cursor:'pointer'}} className={this.state.currentMenu === 'Report' ? "compaignsActive" : ""} onClick={(e)=>{this.changeMenue("Report")}}>Venue Charities Report</a>
                        )}
                        {/*<a  style={{cursor:'pointer'}} className={this.state.currentMenu === 'AddBankInfo' ? "compaignsActive" : ""} onClick={(e)=>{this.changeMenue("AddBankInfo")}}>Charity Bank Information</a>*/}
                    </div>
                    <div className="contentDetail">
                        <div className="autoContent" style={{maxWidth:"1330px"}}>
                            {this.loadComponent()}
                        </div>
                    </div>
                </React.Fragment>
            </div>
        );
    }//..... end of render() .....//
}//..... end of MyApplication.

export default Charities;