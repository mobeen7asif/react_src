import React, {Component} from 'react';


class StaffSales extends Component {

    config = {};
    state = {
        response_status : false,
        config : '',
        start_date : '',
        end_date : '',
        series : [],
        categories : [],
        staffSales : [],
        products_limit : 10,
        state_changed : false
    };

    componentDidMount = () => {
        // show_loader();
        this.preLoader = $("body").find('.preloader3');
       // this.getSalesData();
    };

    componentWillReceiveProps(props) {
        // show_loader();
        if((!props.dateHandler.showDatePicker && props.dateHandler.applyFilter) ||  props.business_id > 0){
            this.setState(()=>({
                    start_date: props.dateHandler.start_date,
                    end_date: props.dateHandler.end_date
                }),
                () => {this.getSalesData();});
            // show_loader(true);
        }
    }

    getSalesData = () => {
        // show_loader();
        let url =  BaseUrl+'/api/soldi-staff-sales-data';

        axios.post(url,{
            'company_id': CompanyID,
            'venue_id': VenueID,
            'start_date': this.props.dateHandler.start_date,
            'end_date' : this.props.dateHandler.end_date,
            'filterby' : this.props.dateHandler.filterPeriod,
            'top_people' : this.state.products_limit,
            'api_key'   : this.props.api_key,
            'secret_key' : this.props.secret_key,
            'business_id' : this.props.business_id,
        }).then((response) => {
            if(response.data.status){
                this.setState({
                    staffSales:response.data.data.TransactionsData.TopStaffSales
                })
                if(this.state.state_changed){
                    show_loader(true);
                }
            }else{
                // show_loader(true);
            }
        }).catch((err) => {
            let newErr = (err);
            // show_loader(true);
            //NotificationManager.error("Internal Server error occurred.", 'Error');
        });

    };//..... end of getMemberStats() .....//*/

    loadChartData = () => {
        this.config = {
            title: null,
            xAxis: {
                categories: ['Adrian Cooper'],
            },

            yAxis: {
                gridLineWidth: 0
            },

            series: [{
                name: 'Year 1800',
                data: [107]
            }, {
                name: 'Year 1900',
                data: [133]
            }, {
                name: 'Year 2000',
                data: [814]
            }],

            chart: {
                type: 'bar'
            },
            credits: {
                enabled: false
            }
        }
    }

    handleChange(e){

        show_loader();
        var text = $("#myId option:selected").text();
        $("#myId").prev('span').text(text);
        this.setState({
            products_limit: e.target.value,
            state_changed : true
        }, () => {this.getSalesData()})
    }

    render() {
        return (
            <div className="e_staffSales_main">
                <div className="customer_matrics_listing_inner">
                    <div className="columnHeading clearfix">
                        <label className="width_50">Top Staff Sales</label>
                        <div className="columnHeading_right clearfix">
                            <div className="selectCompaign">
                                <div className="customDropDown_placeholder "> <span>Select Top 10 Staff Sales</span>
                                    <select id="myId" onChange = {this.handleChange.bind(this)}>
                                        <option value = {10} >Select Top 10 Staff Sales</option>
                                        <option value = {15} >Select Top 15 Staff Sales</option>
                                        <option value = {20} >Select Top 20 Staff Sales</option>
                                    </select>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="customer_matrics_lists">
                        <div className="data_notFound_detail">
                            <div className="data_notFound_data">
                                <span><img src="images/not_found_img.png" alt="#" /></span>
                                <strong>Sorry, no data found</strong>
                                <p>There is currently no data for the selected report</p>
                            </div>
                        </div>

                        {/*<ul>
                            {

                                this.state.staffSales.map((row, index) => {

                                    let a = '';
                                    let b = '';
                                    if(parseInt(row.basket_size) > parseInt(row.basket_value)){
                                        a = 100;
                                        b = (parseInt(row.basket_value)/parseInt(row.basket_size))*100;
                                    }else{
                                        a = (parseInt(row.basket_size)/parseInt(row.basket_value))*100;
                                        b = 100;
                                    }

                                    let image = (row.emp_img)?row.emp_img:'images/defaultImage.png';

                                    return (
                                        <li key={index}>
                                            <div className="customer_matrics_row">
                                                <div className="customer_matrics_cell matrics_cell_1">
                                                    <label>{index+1}</label>
                                                </div>
                                                <div className="customer_matrics_cell matrics_cell_2"> <span className="cL_rowList_number paddLeft_0"><img src={image} alt="#" className="profile_img" />{row.emp_name}</span> </div>
                                                <div className="customer_matrics_cell matrics_cell_3 padding0px">
                                                    <div className="matrics_progress">
                                                        <div className="matrics_progress_baar progreesdark_blue" style={{'width':b+'%'}}>&nbsp;</div>
                                                        <div className="matrics_progress_baar progreesgreen" style={{'width':a+'%'}}>&nbsp;</div>
                                                    </div>
                                                </div>
                                                <div className="customer_matrics_cell matrics_cell_4">
                                                    <div className="visits_active"> <strong><b className="oval_blue_midium">&nbsp;</b>{row.basket_value}</strong> <small>Basket value</small> </div>
                                                </div>
                                                <div className="customer_matrics_cell matrics_cell_5">
                                                    <div className="visits_active"> <strong><b className="oval_green_midium">&nbsp;</b>{row.basket_size}</strong> <small>Basket size ({Currency})</small> </div>
                                                </div>
                                            </div>
                                        </li>
                                    )
                                })
                            }
                        </ul>*/}
                    </div>
                </div>
            </div>
        );
    }//..... end of render() .....//
}//..... end of DetailList.

export default StaffSales;