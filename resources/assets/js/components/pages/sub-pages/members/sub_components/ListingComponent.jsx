import React, {Component} from 'react';
import DetailList from '../sub_components/DetailList';
import ConfirmationModal from "../../../../utils/ConfirmationModal";

class ListingComponent extends Component {
    state ={
        show    : false,
        listInd : null,
        deleteSegment: 0
    };

    updateState = (id) => {
        this.setState(() => ({
                show: (this.state.listInd === id) ? !this.state.show : true,
                listInd:id
            }));
    };

    handleButtonsShow = (e) => {
        let li = e.target.closest('li');
        if (li.classList.contains('active_editMod')) {
            li.classList.remove('active_editMod');
        } else {
            Array.prototype.slice.call(e.target.closest('ul').querySelectorAll('li'))
                .map((ele) => ele.classList.remove('active_editMod'));
            li.classList.add('active_editMod');
        }//..... end if-else() .....//
    };

    componentDidCatch = (error, info) => {
        show_loader(true);
    };//...... end of componentDidCatch() .....//

    deleteSegment = (segmentId) => {
        this.setState(() => ({deleteSegment: segmentId}));
    };

    handleCloseModal = () => {
        this.setState(() => ({deleteSegment: 0}));
    };

    handleDeleteSegment = () => {
        this.props.deleteSegment(this.state.deleteSegment);
        this.setState({deleteSegment: 0});
    };

    render() {
        return (
            <React.Fragment>
                <ul>
                    {this.props.listingData.segmentList.map(item =>
                            <li key={item.id}>
                                <div className="listDataShowing">
                                    <div className="cL_listing_table_row">
                                        <div className="cL_listing_table_cell cell1">
                                            <span className="cL_rowList_number" onClick={e => {this.updateState(item.id)}}>{item.type}</span>
                                        </div>
                                        <div className="cL_listing_table_cell cell2">
                                            <span className="cL_rowList_number" onClick={e => {this.updateState(item.id)}}>{item.description}</span>
                                        </div>
                                        <div className="cL_listing_table_cell cell3">
                                            <span className="cL_rowList_number" onClick={e => {this.updateState(item.id)}}>{item.name}</span>
                                        </div>
                                        <div className="cL_listing_table_cell cell4">
                                            <span className="cL_rowList_number" onClick={e => {this.updateState(item.id)}}>{item.persona}</span>
                                        </div>
                                        <div className="clEditDotes_cell cell5 cell7_set clearfix">
                                            <span className="cL_rowList_number" style={{marginTop: '5px'}}>% Value Input</span>
                                            <a className="cl_tableRow_editDotes"  style={{cursor:'pointer'}} tabIndex={'-1'} onClick={this.handleButtonsShow}><i>&nbsp;</i></a>
                                        </div>
                                    </div>
                                    <div className="cl_rowEdit_popOut" >
                                        <div className="cl_rowEdit_pop_table">
                                            <div className="cl_rowEdit_popOut_tableRow">
                                                {(appPermission("Segment List","edit")) && (
                                                    <div className="cl_rowEdit_popOut_tableRow_cell eidtCell1">
                                                        <a className="edit_icon"  style={{cursor:'pointer'}} onClick={() => this.props.editSegment(item.id)}>
                                                            <strong><i>&nbsp;</i>Edit</strong>
                                                        </a>
                                                    </div>
                                                )}
                                                {(appPermission("Segment List","delete")) && (
                                                    <div className="cl_rowEdit_popOut_tableRow_cell eidtCell3">
                                                        <a className="delete_icon"  style={{cursor:'pointer'}} onClick={e => {this.deleteSegment(item.id)}}>
                                                            <strong><i>&nbsp;</i>Delete</strong>
                                                        </a>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                {
                                    this.state.show && this.state.listInd === item.id &&
                                    <DetailList data={this.state.listInd} listingData={this.props.listingData} popupShow={this.props.popupShow} />
                                }


                            </li>
                        )}
                </ul>
                <ConfirmationModal isOpen={!!this.state.deleteSegment} handleCloseModal={this.handleCloseModal} text={'Segment'} handleDeleteItem={this.handleDeleteSegment}/>
            </React.Fragment>
        );
    }//..... end of render() .....//
}//..... end of ListingComponent.

export default ListingComponent;