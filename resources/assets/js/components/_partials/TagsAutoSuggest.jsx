import React, {Component} from 'react';
import { WithContext as ReactTags } from 'react-tag-input';
import {NotificationManager} from "react-notifications";

const KeyCodes = {
    comma: 188,
    enter: 13

};

const delimiters = [KeyCodes.comma, KeyCodes.enter];

export default class TagsAutoSuggest extends Component {

    handleAddition = (tag) => {//tag {id:'Test', text: 'Test'}
        this.props.selectTag(tag.id);
    };

    handleInputBlur = (tag) => {//tag {id:'Test', text: 'Test'}
        let tags = {id:tag,text:tag};
        if(tag != "")
            this.props.selectTag(tags.id);
    };

    componentDidCatch = (error, info) => {
        show_loader(true);
    };//...... end of componentDidCatch() .....//

    render() {
        return (
            <div className={'segmentInput1'}>
                <ReactTags style={{width:"1020px"}} tags={[]} handleInputBlur={this.handleInputBlur} suggestions={this.props.suggestedTags}  handleAddition={this.handleAddition}
                           delimiters={delimiters} placeholder={'Add Tags...'} />
            </div>
        )
    }//..... end of render() .....//
}//..... end of TagsAutoSuggest.