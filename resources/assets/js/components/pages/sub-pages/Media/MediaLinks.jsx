import React, {Component} from 'react';
import {Link, withRouter} from 'react-router-dom';
import PropTypes from 'prop-types';

class MediaLinks extends Component {
    constructor(props) {
        super(props);
        this.subMenu = this.subMenu.bind(this);
    }//..... end of constructor() .....//

    componentDidCatch = (error, info) => {
        show_loader(true);
    };//...... end of componentDidCatch() .....//

    subMenu(e){
        let ele = document.querySelectorAll('.MediaLibrarayLinks li');
        for(let i=0; i < ele.length; i++){
            ele[i].children[0].removeAttribute("class");
        }
        e.target.setAttribute('class','active_media_link');

    }

    render() {
        return (
            <React.Fragment>
                <div className="media_menu_section clearfix">

                    <div className="media_menu_nav clearfix">
                        <ul className='MediaLibrarayLinks'>
                            <li><a  style={{cursor:'pointer'}} >Date Added</a></li>
                            <li><a className="active_media_link"  style={{cursor:'pointer'}} onClick={(e)=>{this.props.activeLink('most_popular'); this.subMenu(e)}}   >Most Popular</a></li>
                            <li><a  style={{cursor:'pointer'}}  onClick={(e)=>{this.props.activeLink('categories');this.subMenu(e)}}  >Categories</a></li>
                            <li><a  style={{cursor:'pointer'}} >Orientation</a>
                                <ul>
                                    <li><a  style={{cursor:'pointer'}}>Horizontal</a></li>
                                    <li><a  style={{cursor:'pointer'}}>Vertical</a></li>
                                </ul>
                            </li>
                        </ul>
                    </div>

                    {this.props.pageName =="most_popular" && (
                        <div className="addImg_btn">
                            <a id={'addVenueImage'} className='imgLib_imgPlus_btn'  style={{cursor:'pointer'}} onClick={(e)=>{this.props.addVenueImage()}}>ADD IMAGE</a>
                        </div>
                    )}


                </div>
            </React.Fragment>
        );
    }//..... end of render() .....//
}//..... end of MediaLinks.

MediaLinks.propTypes = {};

export default MediaLinks;