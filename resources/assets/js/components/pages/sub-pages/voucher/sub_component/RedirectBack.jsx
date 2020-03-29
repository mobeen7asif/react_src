import React, {Component} from 'react';
class RedirectBack extends Component {



    render() {
        return (
           <div className={(this.props.text =='Group Vouchers')?"newVualt_heading":"messageBuilder_heading"}>
               <h3 onClick={this.props.redirectToListing} style={{cursor:'pointer'}}><a style={{cursor: 'pointer',fontSize:'15px'}} ><i
                   className="fa fa-arrow-left" aria-hidden="true"></i></a>&nbsp;&nbsp;&nbsp;{this.props.text}</h3>
           </div>
        )
    }
}

export default RedirectBack;