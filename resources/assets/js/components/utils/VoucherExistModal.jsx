import React, {Component} from 'react';
import ReactModal from 'react-modal';
ReactModal.setAppElement('#root');

const customStyles = {
    content : {
        top                   : '20%',
        left                  : '50%',
        right                 : 'auto',
        bottom                : 'auto',
        marginRight           : '-50%',
        transform             : 'translate(-50%, -50%)',
        border                : 'none',
        background            : 'none',
        overflow              : 'none'
    },
    overlay: {
        backgroundColor: '#5d5858bf'
    }
};

class VoucherExistModal extends Component {
    render() {
        return (
            <ReactModal
                isOpen={this.props.isOpen}
                onRequestClose={this.props.handleCloseModal}
                style={customStyles}>
                <div className="popupDiv1">
                    <div className="popupDiv_detail">
                        <div className="">
                            <div className="popup_main_heading">
                                <h3>PLEASE CONFIRM</h3>
                                <a  style={{cursor:'pointer'}} className="closePop">&nbsp;</a>
                            </div>

                            <div className="alertPopup_info">
                                <div className="alertPopup_description">
                                    <span>
                                        <img src="/assets/images/warning_icon@2x.png" alt="#" />&nbsp;
                                    </span>
                                    <p>You are about to delete <b>{this.props.text}</b><br/> Are you sure?</p>
                                    {
                                        (this.props.voucherStatus &&
                                            <div className={'pop_up_check'}>

                                                <p>
                                                    <input onChange={this.props.handleCheckBox} type="checkbox" />
                                                    Delete existing vouchers from members?
                                                </p>
                                            </div>
                                        )
                                    }
                                </div>



                                <div className="okCancel_warning">
                                    <a  style={{cursor:'pointer'}} onClick={this.props.handleDeleteItem}>Yes</a>
                                    <a  style={{cursor:'pointer'}} onClick={this.props.handleCloseModal}>Cancel</a>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </ReactModal>
        );
    }//..... end of render() .....//
}//..... end of Modal.

export default VoucherExistModal;