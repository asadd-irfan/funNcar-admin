import React, { Component } from 'react';
import BootstrapTable from 'react-bootstrap-table-next';
import 'react-bootstrap-table-next/dist/react-bootstrap-table2.min.css';
import 'react-bootstrap-table2-paginator/dist/react-bootstrap-table2-paginator.min.css';
import paginationFactory from 'react-bootstrap-table2-paginator';
import ToolkitProvider, { CSVExport } from 'react-bootstrap-table2-toolkit';


class ClientSideTableRendrer extends Component {
 
    

    render() {

        const customTotal = (from, to, size) => (
            <span className="react-bootstrap-table-pagination-total">
                Showing { from} to { to} of { size}
            </span>
        );
        const options = {
            // paginationSize: [2, 5],
            pageStartIndex: 1,
            //alwaysShowAllBtns: true, // Always show next and previous button
            // withFirstAndLast: false, // Hide the going to First and Last page button
            //hideSizePerPage: true, // Hide the sizePerPage dropdown always
            hidePageListOnlyOnePage: true, // Hide the pagination list when only one page
            firstPageText: 'First',
            prePageText: 'Back',
            nextPageText: 'Next',
            lastPageText: 'Last',
            nextPageTitle: 'First page',
            prePageTitle: 'Pre page',
            firstPageTitle: 'Next page',
            lastPageTitle: 'Last page',
            showTotal: true,
            paginationTotalRenderer: customTotal,
            sizePerPageList: [{
                text: '15', value: 15
            }, {
                text: '30', value: 30
            }
                , {
                text: '50', value: 50
            }

            ]
        };
        const indication = () => {
            return <>{
                this.props.loading ? <span><i className="fa fa-spinner fa-spin" aria-hidden="true"></i> Loading...</span> :
                    <span><span className="fa fa-exclamation-triangle" style={{ marginRight: "10px" }}></span>No data available</span>
            }</>
        }

        return (

            <ToolkitProvider
                keyField={this.props.keyField === undefined ? "id" : this.props.keyField}
                data={this.props.data}
                columns={this.props.columns}
                exportCSV
            >
                {
                    props => (
                        <div>
                            <BootstrapTable
                                {...props.baseProps}
                                expandRow={this.props.expandRow}
                                rowClasses={this.props.rowClasses}
                                noDataIndication={indication}
                                headerClasses={this.props.headerClasses === undefined ? "header-class" : this.props.headerClasses}
                                bordered={false}
                                footerClasses={this.props.footerClasses}
                                condensed
                                pagination={this.props.isPagination === true ? paginationFactory(options) : ""}
                            />
                        </div>
                    )
                }
            </ToolkitProvider>

        );
    }


}

export default ClientSideTableRendrer;