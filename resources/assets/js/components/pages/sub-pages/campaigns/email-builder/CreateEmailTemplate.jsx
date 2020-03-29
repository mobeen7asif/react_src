import React, {Component} from 'react';
import ReactHtmlParser from "react-html-parser";
import {NotificationManager} from "react-notifications";

export default class CreateEmailTemplate extends Component {
    state = {
        htmlTemplate: [],
        rawHtml:`<html>
<head>

</head>
<body style="padding: 13px;">

</body>
</html>`,
        previewHml:"",
        customFields:[],
        templateName:"",
        id:this.props.template_id,
        emailSubject:"",
        tag_values:{},
        created_by:0,
        parent_id:0,
        tagList:[{tag:"|FirstName|"},{tag:"|LastName|"},{tag:"|Email|"},{tag:"|HomeTelephone|"},
            {tag:"|Mobile|"},{tag:"|VenueName|"},{tag:"|VenueAddress|"},{tag:"|VenuePhoneNo|"},{tag:"|twitter|"},{tag:"|facebook|"},{tag:"|instagram|"},{tag:"|CampaignName|"}],

        tagData:[
            {key:1,name:"Last Name",value:"|FirstName| "},
            {key:2,name:"First Name",value:"|LastName| "},
            { key:3,name:"Email",value:"|Email| "},
            {key:4,name:"Phone",value:"|HomeTelephone| "},
            {key:5,name:"Mobile",value:"|Mobile| "},
            {key:6,name:"Venue Name",value:"|VenueName| "},
            {key:7,name:"Venue Address",value:"|VenueAddress| "},
            {key:8,name:"Venue Phone",value:"|VenuePhoneNo| "},
            {key:9,name:"Venue Twitter",value:"|twitter| "},
            {key:10,name:"Venue Facebook",value:"|facebook| "},
            {key:11,name:"Venue Instagram",value:"|instagram| "},
            {key:12,name:"Campaign Name",value:"|CampaignName| "},
            {key:13,name:"Membership Number",value:"|MembershipNumber| "},
            {key:14,name:"Point Balance",value:"|PointBalance| "},
            {key:15,name:"Unsubscribe",value:"|Unsubscribe| "},
            {key:16,name:"Offer Name",value:"|OfferName| "},
            {key:17,name:"Voucher Description",value:"|VoucherDescription| "},
            {key:18,name:"Refer a friend unique code",value:"|ReferCode| "},
            {key:19,name:"Gift card amount",value:"|GiftAmount| "},
            {key:20,name:"Activation Code",value:"|ActivationCode| "},
            {key:21,name:"Gift card QR code",value:"|GiftQRCode| "},
            {key:22,name:"Gift card numeric code",value:"|GiftNuCode| "},

        ]
    };

    componentDidMount = () => {
        this.onLoad();
        this.getCustomFields();
        //EmailTemplateInput = {};
    };

    handleEmailChange = (e) => {
        let value = e.target.value;

        this.setState(()=>({rawHtml:value,previewHml:value}),()=>{
            this.persestHtmlData('');
        });
    };

    insertAtCaret = (text) => {

        var txtarea = document.getElementById("emailTemplate");
        if (!txtarea)
            return;

        var scrollPos = txtarea.scrollTop;
        var strPos = 0;
        var br = ((txtarea.selectionStart || txtarea.selectionStart == '0') ?
            "ff" : (document.selection ? "ie" : false));
        if (br == "ie") {
            txtarea.focus();
            var range = document.selection.createRange();
            range.moveStart('character', -txtarea.value.length);
            strPos = range.text.length;
        } else if (br == "ff") {
            strPos = txtarea.selectionStart;
        }

        var front = (txtarea.value).substring(0, strPos);
        var back = (txtarea.value).substring(strPos, txtarea.value.length);
        txtarea.value = front + text + back;
        strPos = strPos + text.length;
        if (br == "ie") {
            txtarea.focus();
            var ieRange = document.selection.createRange();
            ieRange.moveStart('character', -txtarea.value.length);
            ieRange.moveStart('character', strPos);
            ieRange.moveEnd('character', 0);
            ieRange.select();
        } else if (br == "ff") {
            txtarea.selectionStart = strPos;
            txtarea.selectionEnd = strPos;
            txtarea.focus();
        }
        txtarea.scrollTop = scrollPos;
        this.setState(()=>({rawHtml:document.getElementById("emailTemplate").value}));
        return false;

    };

    handleTags = (e) => {
        e.preventDefault();
        this.insertAtCaret(e.target.value);
        setTimeout(()=>{
            this.persestHtmlData('default');
        },200);

    };

    keyDown = (event) => {
        if(event.keyCode === 9) {
            event.preventDefault();
            this.insertAtCaret('\t');
        }else if(event.keyCode === 13){
            this.insertAtCaret('\n');
        }
    };

    onLoad = () => {
        if(this.props.template_id){
            axios.post(BaseUrl + '/api/getTemplate',{id:this.props.template_id})
                .then(res => {
                    //  let tags = JSON.parse(res.data.data.tag_values);

                    this.setState(()=>({parent_id:res.data.data.parent_id,created_by:res.data.data.created_by,tag_values:JSON.parse(res.data.data.tag_values),rawHtml:res.data.data.html,previewHml:res.data.data.html,templateName:res.data.data.title,emailSubject:res.data.data.subject}),()=>{
                        this.persestHtmlData();
                    });

                }).catch((err) => {
            });
        }


    };
    handleChange = (obj) => {
        this.setState(()=>(obj));
    };



    saveTemplate = () =>{
        this.getInputValues();
        if(this.state.templateName =="" ){
            NotificationManager.error("Template Name is required.", 'Error');
            return false;
        }
        if(this.state.emailSubject == ""){
            NotificationManager.error("Email Subject is required.", 'Error');
            return false;
        }
        if(this.state.rawHtml == ""){
            NotificationManager.error("Provide Html for email.", 'Error');
            return false;
        }
        show_loader();
        axios.post(BaseUrl + '/api/saveTemplate',{...this.state,user_role:UserRole,user_id:UserId})
            .then(res => {
                show_loader();
                if(res.data.status){
                    this.props.changePage("list_template");
                }

            }).catch((err) => {
            show_loader();
        });
    };



    persestHtmlData = () => {
        var txt = this.state.rawHtml;
        var regExp = /\|([^| ]+)\|/g;
        var matches = txt.match(regExp);

        if(matches == null)
            return false;


        for (var i = 0; i < matches.length; i++) {
            var placeholder = matches[i];
            let valueOfInput = placeholder.replace("|","").replace("|","");

            let field_value = (this.state.tag_values.hasOwnProperty(valueOfInput) && this.state.tag_values[valueOfInput]) ? this.state.tag_values[valueOfInput] : "";





            var newchar = '';
            placeholder = placeholder.split('|').join(newchar);
            var found = this.state.tagList.some(function (el) {
                return el.tag === matches[i];
            });
            if(found)
                txt = txt.replace(matches[i], "<span><input type='text' value='"+field_value+"'  readonly style='background: white;border-color: deeppink' class='emailTemplateInput tag_value "+placeholder+"' name='"+placeholder+"' placeholder='"+placeholder+"'> </span>");
            else
                txt = txt.replace(matches[i], "<span><input type='text' value='"+field_value+"'   style='background: white;' class='emailTemplateInput tag_value "+placeholder+"' name='"+placeholder+"' placeholder='"+placeholder+"'> </span>");
        }

        setTimeout(()=>{
            this.setState(()=>({previewHml:txt}));

        },500);

        setTimeout(()=>{
            //----- repopulate value of input fields  ........//
            console.log("sdafafa",this.state.tag_values);
            let inputs =Object.entries(this.state.tag_values);
            if(inputs.length > 0){
                inputs.forEach(function (value,key) {
                    $("."+value[0]).val(value[1]);
                    //document.getElementsByName(value[0])[0].value = value[1];

                });

            }
            //......... end of repopulation  .....//

        },600);


    };

    getInputValues = () => {
        var iframe = document.getElementById("frame_iframe_preview_id");
        var elements = iframe.contentWindow.document.getElementsByClassName("emailTemplateInput");


        let tag_values = this.state.tag_values;
        //var elements = document.getElementsByClassName("emailTemplateInput");
        if(elements.length > 0){
            for(let i=0; i< elements.length; i++){
                tag_values[elements[i].getAttribute('placeholder')] = elements[i].value;
            }
        }else{
            tag_values = {};
        }



        this.setState(()=>({tag_values}));
    };

    getCustomFields = (segment_name) => {
        let memberCustomFields= JSON.parse(localStorage.getItem('all_custom_fields'));
        this.setState(()=>({customFields: memberCustomFields}));
    }


    render() {
        return (
            <span>
                <div className="search_field">
                    <input type="text" style={{lineHeight: "29px",fontWeight: "200",fontSize: "20px"}} value={this.state.templateName} onChange={(e)=>{this.handleChange({templateName:e.target.value})}} name="templateName" />
                    <span style={{flot:'right'}}><button onClick={this.saveTemplate}>Save</button></span>
                </div>
               <ul style={{display:"flex",listStyle:"none",marginTop:"25px"}}>

                   {((UserRole != "Frenchise" || this.state.id == 0) || (UserId == this.state.created_by)) && (
                       <li style={{width:'50%',margin:"0px 0px 0px 11px",background:"white", padding:'15px'}} key={853455545}>
                           <div className="columnBox_outer">

                               <div className="columnsHead">
                                   <div className="" style={{"margin":"0px"}}>
                                       <label htmlFor="">
                                           Email Subject:
                                           <input
                                               style={{"width":"50%","verticalAlign":"middle","borderRadius":"6px",
                                                   "border":"solid 1px #d2d6dd","padding": "8px 15px"}}
                                               type="text" name="emailSubject"
                                               value={this.state.emailSubject}
                                               placeholder="subject for email template"
                                               onChange={(e)=>{this.setState({emailSubject:e.target.value})}}/>
                                       </label>
                                   </div><br/>
                                   <div>
                                       <label htmlFor="">Emails Tags: <select style={{"width":"50%",marginLeft:"8px","verticalAlign":"middle","borderRadius":"6px","border":"solid 1px #d2d6dd","padding": "8px 15px"}} onChange={(e)=>{this.handleTags(e)}}>
                                           {this.state.tagData.map((value,key)=>{
                                               return (
                                                   <option key={value.key} value={value.value}>{value.name}</option>
                                               )
                                           })}
                                           {this.state.customFields.map((value,key)=>{
                                               return (
                                                   <option key={"custom_"+key} value={"|custom_"+value.search_name+"|"}>{value.field_label.toUpperCase()}</option>
                                               )
                                           })}
                                       </select></label>
                                   </div>


                                   <span style={{float:'right',marginTop:'-10px',fontWeight:'bold',fontSize:"18px",marginRight:"10px"}}>
                               <strong style={{textAlign:"center"}}>Raw Html</strong>
                            </span>

                               </div>
                               <div style={{minHeight:"350px",maxHeight:"350px"}}>
                                   <textarea onKeyDown={(e)=>{this.keyDown(e)}} id="emailTemplate" value={this.state.rawHtml} style={{width:"100%",padding:"10px",minHeight:"350px"}} name="text-area" onFocus={()=>{this.getInputValues()}}   onChange={(e)=>{this.handleEmailChange(e)}}>some</textarea>
                               </div>


                           </div>


                       </li>
                   )}






                   <li style={{width:"50%",margin:"0px 0px 0px 11px",background:"white", padding:'15px '}} key={8555545}>
                        <div className="columnBox_outer">
                           <div className="columnsHead">
                                <strong style={{paddingTop:'5px'}}>Preview</strong>
                            </div>

                            <div className="">
                                {/*{ReactHtmlParser(this.state.previewHml)}*/}
                                <iframe className="frame_iframe_preview" id="frame_iframe_preview_id" name="frame_iframe_preview" width="100%" style={{border:"none",minHeight:"660px",transform: "scale(0.98)"}} srcdoc={this.state.previewHml}></iframe>
                            </div>
                        </div>




                    </li>

                </ul>
            </span>


        )
    }

}