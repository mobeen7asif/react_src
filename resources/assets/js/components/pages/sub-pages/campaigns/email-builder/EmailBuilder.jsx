import React, {Component} from 'react';
import CreateEmailTemplate from "./CreateEmailTemplate";
import ListTemplates from "./ListTemplates";
import CreateEmailTemplate1 from "./CreateEmailTemplate1";


export default class EmailBuilder extends Component {
    state = {
        defaultPage:"list_template",
        template_id:0
    };

    editTemplate = (id) => {
        this.setState(()=>({template_id:id}));
        this.changePage("create_template");
    };

    loadComponents = () => {
        switch (this.state.defaultPage) {
            case "list_template":
                return <ListTemplates editTemplate={this.editTemplate} />;
            case "create_template":
                return <CreateEmailTemplate changePage={this.changePage} template_id={this.state.template_id} />;
            case "create_template2":
                return <CreateEmailTemplate1 changePage={this.changePage} template_id={this.state.template_id} />;
        }

    };
    changePage = (name) =>{
        if(name == "list_template"){
            this.setState(()=>({defaultPage:name,template_id:0}));
        }else{
            this.setState(()=>({defaultPage:name}));
        }

    };

    render() {

        return (
            <React.Fragment>
            {/*    <div className="compaignstabsBttns change_colorTab clearfix">
                    <a  style={{cursor:'pointer'}} onClick={()=>{this.changePage("list_template")}} className={this.state.defaultPage === 'list_template' ? "compaignsActive" : ""} >List Templates</a>
                    {(appPermission("Email Builder","add")) && (
                        <a  style={{cursor:'pointer'}} onClick={()=>{this.changePage("create_template")}} className={this.state.defaultPage === 'create_template' ? "compaignsActive" : ""} >Create Templates</a>
                    )}
                    {(appPermission("EmailBuilderDragDrop","view")) && (
                        <a  style={{cursor:'pointer'}} onClick={()=>{this.changePage("create_template2")}} className={this.state.defaultPage === 'create_template2' ? "compaignsActive" : ""} >Create Template (Drag & Drop)</a>
                    )}

                </div>*/}

                <div className="contentDetail">

                    <div className="autoContent" style={{maxWidth:"1330px"}}>
                        {this.loadComponents()}
                    </div>
                </div>
            </React.Fragment>



        );
    }//..... end of render() .....//

}//..... end of CampaignList.