import React, {Component} from 'react';
import {NotificationManager} from "react-notifications";


class StampCardStats extends Component {


    state = {
        total: 0,
        complete: 0,
        incomplete: 0,
        punch_cards: [],
        filter : 'week',
        x_axis_value : 7,
        axis_array: Array.from(Array(7), (d, i) => i+1),
        response_status: false
    };
    constructor(props) {
        super(props);
    }//..... end of constructor() .....//

    componentDidMount = () => {



    };




    chartMarkup = (punch_card) => {
        let html = '';
            let color = '#'+punch_card.color;
            html += '<div class="stamp_bar"><span> <b style="background: '+color+'"; ></b><small>'+punch_card.punch_card_rule.name+'</small></span></div>';
        return {__html: html};
    };

    createStampsMarkup = (punch_card) => {
        let html = '';
        let iterator = 1;
        for (let i = 0; i < 5; i++) {
            var color = punch_card.card_color;

            if(iterator <= punch_card.available_stamp) {
                html += '<li> <div class="stampStar_icon"> <span style="background: '+color+'"; ><i class="fa fa-star-o" aria-hidden="true"></i></span> </div> </li>';
            }
            else {
                color = '#cccccc';
                html += '<li> <div class="stampStar_icon"> <span style="background: '+color+'"; ><i class="fa fa-star-o" aria-hidden="true"></i></span> </div> </li>';
            }
            iterator++;
        }
        return {__html: html};
    };

    componentDidCatch = (error, info) => {
        show_loader(true);
    };//...... end of componentDidCatch() .....//
    render() {
        var iterator = 0;
        let axis_array = this.state.axis_array;
       return (

           <div className="e_transactions_box">
               <div className="e_transactions_box">
                   <div className="e_transactions_inner">
                     {/*  <div className="e_transactions_graphOut">
                           <h5>STAMPS ALLOCATED</h5>
                           <div className="e_transactions_graph_outer">
                               <div className="e_transactions_graph_head clearfix">
                                   <div className="e_transactions_graph_left">
                                       <div className="members_dayInner">
                                           <ul>
                                               <li><a className={this.state.filter === 'day' ? 'active' : ''} href="javascript:void(0);" onClick={() => {this.changeFilter('day')}}>Day</a></li>
                                               <li><a className={this.state.filter === 'week' ? 'active' : ''} href="javascript:void(0);" onClick={() => {this.changeFilter('week')}}>Week</a></li>
                                               <li><a className={this.state.filter === 'month' ? 'active' : ''} href="javascript:void(0);" onClick={() => {this.changeFilter('month')}}>Month</a></li>
                                               <li><a className={this.state.filter === 'year' ? 'active' : ''} href="javascript:void(0);" onClick={() => {this.changeFilter('year')}}>Year</a></li>
                                           </ul>
                                       </div>
                                   </div>

                                   <div className={'e_transactions_graph_right'}>
                                       <ul>
                                           {
                                               this.state.punch_cards.map((punch_card) => {
                                                   return <li key={Math.random()} dangerouslySetInnerHTML={this.chartMarkup(punch_card)}/>
                                               })
                                           }

                                       </ul>
                                   </div>
                               </div>

                               <div className="e_transactions_graphOuter">
                                   <div className="e_transactions_graph ">
                                       {
                                           (
                                               this.state.response_status &&
                                                           Object.keys(axis_array).map((item) => {
                                                               return <div key={Math.random()} className="e_cell_graph">
                                                                   <div className="e_cell_graph_inner">
                                                                       <ul>
                                                                           {
                                                                               (axis_array[item].length > 1) ?
                                                                                   axis_array[item].map((punch) => {
                                                                                       return <li key={Math.random()}>
                                                                                           <div
                                                                                               className="stampStar_icon"><span
                                                                                               style={{background: '#' + punch}}><i
                                                                                               className="fa fa-star-o"
                                                                                               aria-hidden="true"></i></span>
                                                                                           </div>
                                                                                       </li>
                                                                                   })
                                                                                   : ''
                                                                           }
                                                                       </ul>
                                                                   </div>

                                                                   <div className="cell_counter">
                                                                       <small>{item}</small>
                                                                   </div>
                                                               </div>
                                                           })
                                           )
                                       }
                                   </div>

                               </div>


                           </div>
                       </div>*/}
                       <div className="e_transactions_detail">
                           <div className="totalRevenue_head transectionText clearfix revenue_stamp">
                               <ul>
                                   <li>
                                       <div className="totalRevenue_val ">
                                           <figure><img src={BaseUrl+'/assets/images/total_stamp_1.png'} alt="#" /></figure>
                                           <b>{(this.props.stamps.length>0)?this.props.stamps[0].totalpoints:0}</b> </div>
                                       <span className="totalStamp_text">Total Stamps</span> </li>
                                   <li>
                                       <div className="totalRevenue_val">
                                           <figure><img src={BaseUrl+'/assets/images/total_stamp_2.png'} alt="#" /></figure>
                                           <b>{(this.props.stamps.length>0)?this.props.stamps[0].completed_stamps:0}</b> </div>
                                       <span className="totalStamp_text">Stamp Cards Completed</span> </li>
                                 <li>
                                       <div className="totalRevenue_val">
                                           <figure><img src={BaseUrl+'/assets/images/total_stamp_3.png'} alt="#" /></figure>
                                           <b>0</b> </div>
                                       <span className="totalStamp_text">Stamp Cards Incomplete</span> </li>
                               </ul>
                           </div>
                           <div className="cashCardPass_transection clearfix">
                               <ul>

                                   {
                                       this.props.stamps.map( punch_card=> {
                                           return <li key={punch_card._id} className="cashList">
                                               <div className="cashCardPass_transRow clearfix">
                                                   <div className="cashCardPass_label">
                                                       <label>{punch_card.name}</label>
                                                   </div>
                                                   <div className="stampStar_mid">
                                                       <div className="stampStar_list">
                                                           <ul>
                                                               {
                                                                   <div dangerouslySetInnerHTML={this.createStampsMarkup(punch_card)} />
                                                               }
                                                           </ul>
                                                       </div>
                                                   </div>
                                                   <div className="stampStar_right">
                                                       <div className="stampStar_right_text"> <span>{punch_card.available_stamp}/5</span> </div>
                                                   </div>
                                               </div>
                                           </li>
                                       })
                                   }
                               </ul>
                           </div>
                       </div>
                   </div>
               </div>
           </div>



       );
    }//..... end of render() .....//
}//..... end of Member.

StampCardStats.propTypes = {};

export default StampCardStats;
