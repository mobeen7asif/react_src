import React, {Component} from 'react';
import PropTypes from 'prop-types';
import UploadFileDropZone from "../../../message_builder_components/alert_sms_builder/UploadFileDropZone";


class BulkMemberImport extends Component {

    setFilename = (resource) => {
        this.props.setCriteriaValue('bulk_member_import', 'value', resource);
    };//..... end of setFilename() .....//

    componentDidCatch = (error, info) => {
        show_loader(true);
    };//...... end of componentDidCatch() .....//

    render() {
        return (
            <div className="dropSegmentation_section isBulk">
                <div className="dropSegmentation_heading clearfix">
                    <h3>Bulk Member Import</h3>
                    <div className="segmntClose" onClick={(e)=> {this.props.removeCriteria('bulk_member_import')}}>
                        <a  style={{cursor:'pointer'}}>&nbsp;</a>
                    </div>
                </div>
                <div className="stateSegmentation">
                    <div className="compaignDescription_outer clearfix">
                        <label>You can upload an .xls containing membership numbers</label>
                        <div className="importBulk">
                            <div className="image_notify_upload_area  imageUploadDropDown dz-clickable">
                                <UploadFileDropZone dropZoneSelector={'.image_notify_upload_area'} uploadsPath={BaseUrl + '/api/upload-file'} setFilename={this.setFilename}
                                                    acceptedFileTypes={'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'} fileName={this.props.criteria.value}
                                                    imageCss={{backgroundSize: '100%'}} defaultCss={{background: ''}}/>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }//..... end of render() .....//
}//..... end of BulkMemberImport.

BulkMemberImport.propTypes = {};

export default BulkMemberImport;