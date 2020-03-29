import React, {Component} from 'react';
import ListTemplates from "./ListTemplates";
import CreateEmailTemplate from "./CreateEmailTemplate";
import CreateEmailTemplate1 from "./CreateEmailTemplate1";
class EmailComponent extends Component {
    constructor(props) {
        super(props);
        this.state = {
            defaultPage:"list_template",
            template_id:0
        };

    }
    changePage = (name) =>{
        if(name == "list_template"){
            this.setState(()=>({defaultPage:name,template_id:0}));
        }else{
            this.setState(()=>({defaultPage:name}));
        }

    };

    editTemplate = (id) => {
        this.setState(()=>({template_id:id}));
        this.changePage("create_template");
    };


    render() {
        return (
            (this.state.defaultPage === 'list_template') ? <ListTemplates  changePage={this.changePage} editTemplate={this.editTemplate} />
                : (this.state.defaultPage === 'create_template' ? <CreateEmailTemplate  changePage={this.changePage} template_id={this.state.template_id} />:<CreateEmailTemplate1  changePage={this.changePage} template_id={this.state.template_id} />)
        );
    }//..... end of render() .....//
}//..... end of Class.
export default EmailComponent ;