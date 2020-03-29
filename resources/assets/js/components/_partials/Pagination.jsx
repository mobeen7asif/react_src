import React, { Component } from 'react';


class Pagination extends Component {
    constructor(props) {
        super(props);
        this.state = {};
        this.onPageChange = this.onPageChange.bind(this);
        this.goFirstPage = this.goFirstPage.bind(this);
        this.goLastPage = this.goLastPage.bind(this);
        this.goPrevPage = this.goPrevPage.bind(this);
        this.goNextPage = this.goNextPage.bind(this);
    }
    componentWillReceiveProps(newProps) {
        if (newProps === this.props) return;
        const { margin, page, count } = newProps;
        const startPage = page > margin ? page - margin : 1;
        const endPage = page + margin > count ? count : page + margin;
        this.setState({ startPage, endPage, count });
    }

    onPageChange(event) {
        const index =
            Array.prototype.indexOf.call(event.target.parentNode.children, event.target);
        this.props.onPageChange(index + this.state.startPage);
    }

    goFirstPage() {
        this.props.onPageChange(1);
    }

    goLastPage() {
        this.props.onPageChange(this.state.count);
    }

    goPrevPage() {
        this.props.onPageChange(this.props.page - 1);
    }

    goNextPage() {
        this.props.onPageChange(this.props.page + 1);
    }

    componentDidCatch = (error, info) => {
        show_loader(true);
    };//...... end of componentDidCatch() .....//

    render() {
        const { startPage, endPage, count } = this.state;
        const { page, margin } = this.props;
        const pages = [];
        for (let i = 1; i <count; i++) {
            pages.push(
                <li
                    key={i}
                    onClick={this.onPageChange}

                ><a className=""  style={{cursor:'pointer'}}>
                    {i}</a>
                </li>
            );
        }
        const firstPage = page - margin > 1 ?
            <div
                className="pagination-button pagination-go-first"
                onClick={this.goFirstPage}
            >1</div> :
            null;
        const lastPage = page + margin < count ?
            <div
                className="pagination-button pagination-go-last"
                onClick={this.goLastPage}
            >{count}</div> :
            null;
        const prevPage = page === 1 ? null :
            <li onClick={this.goPrevPage}><a className="campPagi_prev"  style={{cursor:'pointer'}}>&nbsp;</a></li>;
        const nextPage = page === count ? null :
            <li  onClick={this.goNextPage}><a className="campPagi_next"  style={{cursor:'pointer'}}>&nbsp;</a></li>




        return (
            <div className="campLstng_paginaton_out">
                <div className="campLstng_paginaton_inn">
                    <ul>
                        {prevPage}
                        {pages}
                        {nextPage}
                    </ul>
                </div>
            </div>

        );
    }
}


export default Pagination;
