import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {NotificationManager} from "react-notifications";

class UserGuide extends Component {
    state = {
        userManual : [],
        file:""
    };
    constructor(props) {
        super(props);
        this.getUserManual();
    }//..... end of constructor() .....//


    getUserManual = () => {
        axios.get(BaseUrl + '/api/user-manual',{'venue_id':""})
            .then(res => {
                this.setState({userManual : res.data.userManual_page.link});
            }).catch((err) => {
        });
    };

    handleChangeFile(event) {
        const file = event.target.files[0];
        this.setState(()=>({file:file}));
        //formData.append('file', file);
        //Make a request to server and send formData
    }

    uploadFile = () => {
        if(this.state.file == ""){
            NotificationManager.error("Please Select file to upload");
            return false;
        }

        var data = new FormData();

        data.append('file', this.state.file);
        (this.state.file);
        show_loader();
        const config = { headers: { 'Content-Type': 'multipart/form-data' } };
        axios.post(BaseUrl + '/api/upload-user-guide',data,config)
            .then(res => {
                this.setState({file : ""});
                this.getUserManual();
                show_loader();
            }).catch((err) => {
            NotificationManager.error("Error Occurred while saving/updating.", 'Error');
            show_loader();
        });
    }

    render() {
        return (
            <React.Fragment>
                <div className="contentDetail">

                    <div className="autoContent">

                        <div className="compaignHeadigs">
                            <h1>User guide</h1>

                            <input type="file" onChange={(e)=>this.handleChangeFile(e)} name="user_file" />
                            <button className="uploadButton" onClick={()=>this.uploadFile()}>UPLOAD</button>
                        </div>

                        <div className="faq_description_section" style={{padding:'0px'}}>
                            <div className=" faq_userGuide_Container">
                                <iframe id="dynamic_pdf" src={this.state.userManual}  width='100%'
                                        height='1500px' style={{border: '1px solid black', width:'100%', marginTop: '20px',height:"800px"}}/>

                                {/*<p>Tendae latemqui re eum qui ut volorei cienihi tibus, quiame ipsaepedit aute porporum quis di vent omnis etus abor sume consenis evenda nost, ommo el mos quoArchicab oreictatis des demodis ciendae ptatesent am, temod quature mi, veniendem sequi officab orehentur? Quibus ut officiant ipis nobitate vollo omnim que numqui ni asit pelenitat reperspid qui derate vero que volupta temperc iurepel iumquam atem. Itatetum intem es idempor atiossu mentiisti as am samet odi offic to officilique doluptat dolupta venist, ut aut autestrum resequis nis parume lacipis dolluptamet alignim aximolore porenihil </p>

                                <p>modicaborem issit pos entia num quae velest, cullabo. Et entem facculpa voloritas et labo. Faccae volupta vollenet aciam vit remquam, unt, enihitati dolorest, occae velit labo. Itaquo ipis imusant aut laborum aliatessim facea simus esequam rehent modi offic tem illit volum reptatur re, to es nonectium idel im estrunt re saped essequodio quissusdam faccus arum inciis ime mo inction sequis net quae ene nobis repudaesed molorest fugitem lam, conectatem hil est, num fugia doluptaero enist aturit lab ipid qui quaeperis magnate proremp ereprent elit ut omnis es nit es re, test, sandiciis doluptae vollandae none acipsum ad et, ius aut aut voluptatem harchictur, id et, aut</p>

                                <p>Tendae latemqui re eum qui ut volorei cienihi tibus, quiame ipsaepedit aute porporum quis di vent omnis etus abor sume consenis evenda nost, ommo el mos quoArchicab oreictatis des demodis ciendae ptatesent am, temod quature mi, veniendem sequi officab orehentur? Quibus ut officiant ipis nobitate vollo omnim que numqui ni asit pelenitat reperspid qui derate vero que volupta temperc iurepel iumquam atem. Itatetum intem es idempor atiossu mentiisti as am samet odi offic to officilique doluptat dolupta venist, ut aut autestrum resequis nis parume lacipis dolluptamet alignim aximolore porenihil modicaborem issit pos entia num quae velest, cullabo. Et entem facculpa voloritas et labo. Faccae volupta vollenet aciam vit remquam, unt, enihitati dolorest, occae </p>

                                <p>Tendae latemqui re eum qui ut volorei cienihi tibus, quiame ipsaepedit aute porporum quis di vent omnis etus abor sume consenis evenda nost, ommo el mos quoArchicab oreictatis des demodis ciendae ptatesent am, temod quature mi, veniendem sequi officab orehentur? Quibus ut officiant ipis nobitate vollo omnim que numqui ni asit pelenitat reperspid qui derate vero que volupta temperc iurepel iumquam atem. Itatetum intem es idempor atiossu mentiisti as am samet odi offic to officilique doluptat dolupta venist, ut aut autestrum resequis nis parume lacipis dolluptamet alignim aximolore porenihil modicaborem issit pos entia num quae velest, cullabo. Et entem facculpa voloritas et labo. Faccae volupta vollenet aciam vit remquam, unt, enihitati dolorest, occae velit labo. Itaquo ipis imusant aut laborum aliatessim facea simus esequam rehent modi offic tem illit volum reptatur re, to es nonectium idel im estrunt re saped essequodio quissusdam faccus arum inciis ime mo inction sequis net quae ene nobis repudaesed molorest fugitem lam, conectatem hil est, num fugia doluptaero enist aturit lab ipid qui quaeperis magnate proremp ereprent elit ut omnis es nit es re, test, sandiciis doluptae vollandae none acipsum ad et, ius aut aut voluptatem harchictur, id et, Tendae latemqui re eum qui ut volorei cienihi tibus, quiame ipsaepedit aute porporum quis di vent omnis etus abor sume consenis evenda nost, ommo el mos quoArchicab oreictatis des demodis ciendae ptatesent am, temod quature mi, veniendem sequi officab orehentur? Quibus ut officiant ipis nobitate vollo omnim que numqui ni asit pelenitat reperspid qui derate vero que volupta temperc iurepel iumquam atem. Itatetum intem es idempor atiossu mentiisti as am samet odi offic to officilique doluptat dolupta venist, ut aut autestrum resequis nis parume lacipis dolluptamet alignim aximolore porenihil modicaborem issit pos entia num quae velest, cullabo. Et entem facculpa voloritas et labo. Faccae volupta vollenet aciam vit remquam, unt, enihitati dolorest, occae velit labo. Itaquo ipis imusant aut laborum aliatessim facea simus esequam rehent modi offic tem illit volum reptatur re, to es nonectium idel im estrunt re saped essequodio quissusdam faccus arum inciis ime mo inction sequis net quae ene nobis repudaesed molorest fugitem lam, conectatem hil est, num fugia doluptaero enist aturit lab ipid qui quaeperis magnate proremp ereprent elit ut omnis es nit es re, test, sandiciis doluptae </p>
                                <p>modicaborem issit pos entia num quae velest, cullabo. Et entem facculpa voloritas et labo. Faccae volupta vollenet aciam vit remquam, unt, enihitati dolorest, occae velit labo. Itaquo ipis imusant aut laborum aliatessim facea simus esequam rehent modi offic tem illit volum reptatur re, to es nonectium idel im estrunt re saped essequodio quissusdam faccus arum inciis ime mo inction sequis net quae ene nobis repudaesed molorest fugitem lam, conectatem hil est, num fugia doluptaero enist aturit lab ipid qui quaeperis magnate proremp ereprent elit ut omnis es nit es re, test, sandiciis doluptae vollandae none acipsum ad et, ius aut aut voluptatem harchictur, id et, aut</p>
                                <p>Tendae latemqui re eum qui ut volorei cienihi tibus, quiame ipsaepedit aute porporum quis di vent omnis etus abor sume consenis evenda nost, ommo el mos quoArchicab oreictatis des demodis ciendae ptatesent am, temod quature mi, veniendem sequi officab orehentur? Quibus ut officiant ipis nobitate vollo omnim que numqui ni asit pelenitat reperspid qui derate vero que volupta temperc iurepel iumquam atem. Itatetum intem es idempor atiossu mentiisti as am samet odi offic to officilique doluptat dolupta venist, ut aut autestrum resequis nis parume lacipis dolluptamet alignim aximolore porenihil modicaborem issit pos entia num quae velest, cullabo. Et entem facculpa voloritas et labo. Faccae volupta vollenet aciam vit remquam, unt, enihitati dolorest, occae</p>*/}
                            </div>
                        </div>
                    </div>
                </div>
            </React.Fragment>
        );
    }//..... end of render() .....//
}//..... end of UserGuide.

UserGuide.propTypes = {};

export default UserGuide;