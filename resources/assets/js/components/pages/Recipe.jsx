import React, {Component} from 'react';
import RecipeListing from "./sub-pages/Recipe/RecipeListing";
import AddRecipe from "./sub-pages/Recipe/AddRecipe";
import OfferListing from "./sub-pages/Recipe/OfferListing";
import AddOffer from "./sub-pages/Recipe/AddOffer";
import CategoryList from "./sub-pages/Recipe/CategoryList";
import AddCategory from "./sub-pages/Recipe/AddCategory";
import Chef from "./sub-pages/Recipe/Chef";


class Recipe extends Component {
    constructor(props) {
        super(props);
        this.state = {
            activeTab : "recipe",
            editData  : {}
        };
    }//..... end of constructor() .....//

    setEditRecord = (editData, tab) => {
        this.setState(()=>({editData, activeTab: tab}));
    };

    componentDidCatch = (error, info) => {
        show_loader(true);
    };//...... end of componentDidCatch() .....//

    render() {
        return (
            <div>
                <div className="compaignstabsBttns clearfix">
                    {(appPermission("Recipe List","view")) && (
                        <a  style={{cursor:'pointer'}}  onClick={(e)=>{ this.changeMainTab('recipe') }}   className={this.state.activeTab == 'recipe' || this.state.activeTab == 'edit' ? 'compaignsActive venueListTab' : 'venueListTab'}>Recipe List</a>
                    )}
                    {(appPermission("Chef Registration","view")) && (
                        <a  style={{cursor:'pointer'}}  onClick={(e)=>{ this.changeMainTab('chef') }}   className={this.state.activeTab == 'chef' || this.state.activeTab == 'edit' ? 'compaignsActive venueListTab' : 'venueListTab'}>Chef Registration</a>
                    )}
                   {/* {(appPermission("Offers List","view")) && (
                        <a  style={{cursor:'pointer'}}  onClick={(e)=>{ this.changeMainTab('offer') }}    className={this.state.activeTab == 'offer' || this.state.activeTab == 'addOffer' ? 'compaignsActive' : ''}>Offers List</a>
                    )}*/}
                    {(appPermission("Category List","view")) && (
                        <a  style={{cursor:'pointer'}}  onClick={(e)=>{ this.changeMainTab('category') }}    className={this.state.activeTab == 'category' || this.state.activeTab == 'addCategory' ? 'compaignsActive' : ''}>Category List</a>
                    )}

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

    changeMainTab = (tab) => {
        this.setState({activeTab : tab, editData: {}});
    };

    loadActiveComponent = () => {
        switch (this.state.activeTab) {
            case "recipe" :
                return <RecipeListing changeMainTab={this.changeMainTab} setEditRecord={this.setEditRecord} />;
            case "edit"  :
                return <AddRecipe changeMainTab={this.changeMainTab} editData={this.state.editData} />;
            case "chef"  :
                return <Chef/>;
            case "offer"  :
                return <OfferListing changeMainTab={this.changeMainTab} setEditRecord={this.setEditRecord} />;
            case "addOffer"  :
                return <AddOffer changeMainTab={this.changeMainTab} editData={this.state.editData} />;
            case 'category':
                return <CategoryList changeMainTab={this.changeMainTab} setEditRecord={this.setEditRecord} />;
            case 'addCategory':
                return <AddCategory changeMainTab={this.changeMainTab} editData={this.state.editData} />;
            default :
                return "";
        }
    };//..... end of loadActiveComponent() .....//
}//..... end of Recipe.

export default Recipe;