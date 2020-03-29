import React, {Component} from 'react';
import QRCode from 'qrcode.react';

class QrCodeGenerate extends Component {
    constructor(props) {
        super(props);
        this.state = {
            qrcode:''
        };

    }//..... end of constructor() .....//
   componentDidMount() {
       this.checkvalidcode(atob(this.props.match.params.id))
   }

    /*qrcode =(this.props.match.params.id)?this.checkvalidcode(atob(this.props.match.params.id)):0*/

    checkvalidcode = (data)=>{
            this.setState(()=>({
                qrcode: data
            }))
    }

    render() {
        return (
            <div>
                <div className="container_outer">


                    <div className="contentDetail">
                        <div className="autoContent">
                            <div className="compaignstabsBttns clearfix">
                                <div className="autoContent">

                                    <div className="contentinner">
                                        <div style={{margin: '0px auto'}}>
                                            <QRCode size={400} value={this.state.qrcode} />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

            </div>
        );
    }//..... end of render() .....//
}//..... end of ImageCropping.

export default QrCodeGenerate;