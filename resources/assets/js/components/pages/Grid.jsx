import React, {Component} from 'react';
import ReactPaginate from "react-paginate";
import ConfirmationModal from "../utils/ConfirmationModal";
import ReactHtmlParser from 'react-html-parser';

class Grid extends Component {
    constructor(props) {
        super(props);
        this.headerLength = this.props.headerList && this.props.headerList.length || 0;
    }//..... end of constructor() .....//

    handleButtonsShow = (e) => {
        let li = e.target.closest('li');
        if (li.classList.contains('active_editMod')) {
            li.classList.remove('active_editMod');
            if (this.props.fourthBtnText)
                li.querySelector('.cl_rowEdit_popOut').style.width = '18%';
        } else {
            Array.prototype.slice.call(e.target.closest('ul').querySelectorAll('li'))
                .map((ele) => ele.classList.remove('active_editMod'));
            li.classList.add('active_editMod');

            if (this.props.fourthBtnText)
                li.querySelector('.cl_rowEdit_popOut').style.width = '22%';
        }//..... end if-else() .....//
    };//..... end of handleButtonsShow() .....//

    render() {
        return (
            <div>
                <div className="cL_listing_tableInn segmentTable_cells_setting">

                    <div className="cL_listing_tableTitle">
                        <div className="cL_listing_table_row">
                            {this.props.headerList && this.props.headerList.map((item, index) =>
                                <div key={item.id+"__"+index} className={'cL_listing_table_cell cell' + item.id}>
                                    <strong>
                                <span>
                                    <b onClick={() => this.props.handleFilterChange(item.filterName, 'asc')} className={(this.props.orderBy === item.filterName && this.props.orderType === 'asc') ? 'choseSegmnt' : ''}>
                                        <img src={(this.props.orderBy === item.filterName && this.props.orderType === 'asc') ? 'assets/images/sortAerrow_top_active.png' : 'assets/images/sortAerrow_top.png'} alt="#"/>
                                    </b>
                                    <b onClick={() => this.props.handleFilterChange(item.filterName, 'DESC')} className={(this.props.orderBy === item.filterName && this.props.orderType === 'DESC') ? 'choseSegmnt' : ''}>
                                        <img src={(this.props.orderBy === item.filterName && this.props.orderType === 'DESC') ? 'assets/images/sortAerrow_bottom_active.png' : 'assets/images/sortAerrow_bottom.png'} alt="#"/>
                                    </b>
                                </span>
                                        {item.name}
                                    </strong>
                                </div>
                            )}
                        </div>
                    </div>

                    <ul className={'grid--body'}>
                        {this.props.data.map(( item, index ) =>
                            <li key={item.id+"_"+index}>
                                <div className="listDataShowing">
                                    <div className="cL_listing_table_row">

                                        {this.props.headerList && this.props.headerList.map((header, key) =>{
                                            if (key === (this.headerLength-1))
                                                return (
                                                    <div className="clEditDotes_cell  cell5 clEdit_fix " key={header.name+"_"+key+"_"+item.id}>
                                                        <span className="cL_rowList_number">{ReactHtmlParser(item[header.filterName])}</span>
                                                        {(this.props.editRecord || this.props.addRecordToStateForDeletion) &&
                                                            <a className="cl_tableRow_editDotes"  style={{cursor:'pointer'}} tabIndex={'-1'} onClick={this.handleButtonsShow}><i>&nbsp;</i></a>
                                                        }
                                                    </div>
                                                );

                                            return (
                                                
                                                <div className={"cL_listing_table_cell cell" + header.id}  key={header.name+"_"+key+"_"+item.id}>
                                                    <span className="cL_rowList_number">{ReactHtmlParser(item[header.filterName])}</span>
                                                </div>
                                            );
                                            })
                                        }

                                    </div>

                                    <div className="cl_rowEdit_popOut" style={{width: this.props.thirdBtnText ? '18%' : '15%'}}>
                                        <div className="cl_rowEdit_pop_table">
                                            <div className="cl_rowEdit_popOut_tableRow">
                                                {this.props.editRecord && <div className="cl_rowEdit_popOut_tableRow_cell eidtCell1">
                                                    <a className={this.props.editBtnIconClass || "edit_icon"}  style={{cursor:'pointer'}} onClick={() => this.props.editRecord(item)}>
                                                        <strong><i>&nbsp;</i>{this.props.editBtnText || 'Edit'}</strong>
                                                    </a>
                                                </div>}
                                                {this.props.addRecordToStateForDeletion && <div className="cl_rowEdit_popOut_tableRow_cell eidtCell3">
                                                    <a className="delete_icon"  style={{cursor:'pointer'}} onClick={e => {this.props.addRecordToStateForDeletion(item.id)}}>
                                                        <strong><i>&nbsp;</i>Delete</strong>
                                                    </a>
                                                </div>}

                                                {this.props.thirdBtnText &&
                                                <div className="cl_rowEdit_popOut_tableRow_cell eidtCell2">
                                                    <a className="scheduleIcon"  style={{cursor:'pointer'}} onClick={() => this.props.handleThirdBtnClick(item)}>
                                                        <strong><i>&nbsp;</i>{this.props.thirdBtnText || 'details'}</strong>
                                                    </a>
                                                </div>}
                                                {this.props.fourthBtnText &&
                                                <div className="cl_rowEdit_popOut_tableRow_cell eidtCell2">
                                                    <a className="scheduleIcon"  style={{cursor:'pointer'}} onClick={() => this.props.handleFourthBtnClick(item)}>
                                                        <strong><i>&nbsp;</i>{this.props.fourthBtnText}</strong>
                                                    </a>
                                                </div>}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </li>
                        )}
                    </ul>

                </div>

                <div className="campLstng_paginaton_out">
                    <div className="campLstng_paginaton_inn">

                        <ReactPaginate previousLabel            = {""}
                                       nextLabel                = {""}
                                       nextLinkClassName        = {'campPagi_next'}
                                       breakLabel               = {<a href="">...</a>}
                                       breakClassName           = {"break-me"}
                                       pageCount                = {this.props.pageCount}
                                       marginPagesDisplayed     = {2}
                                       pageRangeDisplayed       = {5}
                                       previousLinkClassName    = {'campPagi_prev'}
                                       onPageChange             = {this.props.handlePageClick}
                                       activeClassName          = {"active"} />

                    </div>
                </div>

                <ConfirmationModal isOpen={!!this.props.deleteItemID} handleCloseModal={this.props.handleCloseModal} text={this.props.deletePopupText} handleDeleteItem={this.props.handleDeleteItem}/>
            </div>
        );
    }//..... end of render() .....//
}//..... end of Grid.

export default Grid;