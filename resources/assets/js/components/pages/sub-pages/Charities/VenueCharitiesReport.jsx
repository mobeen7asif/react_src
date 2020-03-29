import React, {Component} from 'react';


class VenueCharitiesReport extends Component {
    constructor(props) {
        super(props);
        this.state = {
            listData       : [],
        };
    }//..... end of constructor() .....//

    componentDidCatch = (error, info) => {
        show_loader(true);
    };//...... end of componentDidCatch() .....//



    componentDidMount = () => {
        this.loadReport();
    };

    loadReport = () => {
        axios.post(BaseUrl + '/api/all-venue-charity-report',{company_id: CompanyID,venue_id:VenueID})
            .then(res => {
                this.setState(()=>({listData:res.data.data}));
            }).catch((err) => {
        });
    };

    print = () => {
        let divToPrint=document.getElementById("printTable");
        let newWin= window.open("");
        newWin.document.write(divToPrint.outerHTML);
        newWin.print();
        newWin.close();
    }

    render() {

        return (
            <div>
                <div className="newVualt_container">
                    <div className="newVualt_container_detail">

                        <div className="newVualt_detail_outer">
                            <div className="newVualt_detail">
                                <div className="newVualt_heading_with_buttons clearfix">
                                    <div className="newVualt_heading">
                                        <h3>Venue Charities Report</h3>
                                    </div>

                                    <div className="backSave_buttons">
                                        <ul>
                                            <li><a href={BaseUrl+"/api/printPdf"} className="selecBttn" >Print</a></li>
                                        </ul>
                                    </div>
                                </div>

                                <div className="listing_floating_row clearfix">

                                    <div className="grid_searching clearfix">
                                        <ul>
                                            <li>
                                                <a  style={{cursor:'pointer'}}>&nbsp;</a>
                                            </li>
                                            <li>
                                                <a  style={{cursor:'pointer'}} className="combined_shape">&nbsp;</a>
                                            </li>

                                        </ul>
                                    </div>

                                </div>

                                <div className="category_list_outer">
                                    <div className="cL_listing_tableInn">

                                        <table width="100%" id="printTable" style={{border: "1px solid #ddd",textAlign: "left"}}>
                                            <thead>
                                            <tr>
                                                <th style={{backgroundColor:"lightGray",border: "1px solid #ddd",textAlign: "left",padding: "15px"}}>Venue Name</th>
                                                <th style={{backgroundColor:"lightGray",border: "1px solid #ddd",textAlign: "left",padding: "15px"}}>Total Donors</th>
                                                <th style={{background:"lightGray",border: "1px solid #ddd",textAlign: "left",padding: "15px"}}>Total Coins</th>
                                                <th style={{background:"lightGray",border: "1px solid #ddd",textAlign: "left",padding: "15px"}}>Status</th>
                                            </tr>
                                            </thead>
                                            <tbody>



                                            {this.state.listData && (
                                                this.state.listData.map((value,key)=>{

                                                    return (
                                                        <React.Fragment>
                                                        <tr key={key}>
                                                            <td style={{fontWeight:"bold",border: "1px solid #ddd",textAlign: "left",padding: "15px"}}> {value.venue_name} </td>
                                                            <td style={{fontWeight:"bold",border: "1px solid #ddd",textAlign: "left",padding: "15px"}}> {value.totalDonorInVenue} </td>
                                                            <td style={{fontWeight:"bold",border: "1px solid #ddd",textAlign: "left",padding: "15px"}}> {value.totalCoins} </td>
                                                            <td style={{fontWeight:"bold",border: "1px solid #ddd",textAlign: "left",padding: "15px"}}> {value.venue_status} </td>
                                                        </tr>


                                                            <tr key={key+2}>
                                                                <td></td>
                                                                <td></td>
                                                                <td colSpan="2">
                                                                    <table width="100%">
                                                                        <thead>
                                                                            <tr>
                                                                                <th style={{background:"lightGray",border: "1px solid #ddd",textAlign: "left",padding: "15px"}}>Charity Name</th>
                                                                                <th style={{background:"lightGray",border: "1px solid #ddd",textAlign: "left",padding: "15px"}}>Coins</th>
                                                                            </tr>
                                                                        </thead>
                                                                        <tbody>
                                                                        {value.charities.map((value2,key2)=>{
                                                                            return (
                                                                                <tr key={key2}>
                                                                                    <td style={{border: "1px solid #ddd",textAlign: "left",padding: "15px"}}>{value2.charity_name}</td>
                                                                                    <td style={{border: "1px solid #ddd",textAlign: "left",padding: "15px"}}>{value2.coins_count}</td>
                                                                                </tr>
                                                                            )
                                                                        })}
                                                                        </tbody>
                                                                    </table>
                                                                </td>
                                                            </tr>
                                                        </React.Fragment>

                                                    )
                                                })
                                            )}
                                            </tbody>

                                        </table>



                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>




            </div>
        );
    }//..... end of render() .....//
}//..... end of Shop.

VenueCharitiesReport.propTypes = {};

export default VenueCharitiesReport;