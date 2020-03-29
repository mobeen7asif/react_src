import React, {Component} from 'react';

class HeaderComponent extends Component {
    componentDidCatch = (error, info) => {
        show_loader(true);
    };//...... end of componentDidCatch() .....//

    render() {
        return (
            <div className="cL_listing_tableTitle">
                <div className="cL_listing_table_row setHeadCol">
                    {
                        this.props.listData.headerList.map(item =>
                        <div key={item.id} className={'cL_listing_table_cell cell' + item.id}>
                            <strong>
                                <span>
                                    <b
                                        style={{cursor: !item.disable_sort ? 'pointer' : 'default'}}
                                        onClick={!item.disable_sort ?() => this.props.onClick(item.filterName, 'asc'):null} className={(this.props.listData.filterSegment === item.filterName && this.props.listData.orderType === 'asc') ? 'choseSegmnt' : ''}>
                                        <img src={(this.props.listData.filterSegment === item.filterName && this.props.listData.orderType === 'asc') ? 'assets/images/sortAerrow_top_active.png' : 'assets/images/sortAerrow_top.png'} alt="#"/>
                                    </b>
                                    <b
                                        style={{cursor: !item.disable_sort ? 'pointer' : 'default'}}
                                        onClick={!item.disable_sort ?() => this.props.onClick(item.filterName, 'DESC'):null} className={(this.props.listData.filterSegment === item.filterName && this.props.listData.orderType === 'DESC') ? 'choseSegmnt' : ''}>
                                        <img src={(this.props.listData.filterSegment === item.filterName && this.props.listData.orderType === 'DESC') ? 'assets/images/sortAerrow_bottom_active.png' : 'assets/images/sortAerrow_bottom.png'} alt="#"/>
                                    </b>
                                </span>
                                {item.name}
                            </strong>
                        </div>
                    )}
                </div>
            </div>
        );
    }//..... end of render() .....//
}//..... end of HeaderComponent.

export default HeaderComponent;