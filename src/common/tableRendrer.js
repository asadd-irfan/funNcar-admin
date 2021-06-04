import React from 'react';
import BootstrapTable from 'react-bootstrap-table-next';
import 'react-bootstrap-table-next/dist/react-bootstrap-table2.min.css';
import 'react-bootstrap-table2-paginator/dist/react-bootstrap-table2-paginator.min.css';
import ToolkitProvider, { CSVExport } from 'react-bootstrap-table2-toolkit';
import paginationFactory, { PaginationProvider, PaginationListStandalone } from 'react-bootstrap-table2-paginator';
// import overlayFactory from 'react-bootstrap-table2-overlay';


export default function Table(props) {
    // const { ExportCSVButton } = CSVExport;
    const indication = () => { 
        return <>{
            props.loading ? <span><i className="fa fa-spinner fa-spin" aria-hidden="true"></i> Loading...</span> : 
            <span><span className="fa fa-exclamation-triangle" style={{ marginRight: "10px" }}></span>No data found!</span> 
            }</>
        }
    const customTotal = (from, to, size) => (<span className="react-bootstrap-table-pagination-total"> Showing { from} to { to} of { size} Results</span>);

    const RemotePagination = ({ keyField, data, page, sizePerPage, onTableChange, totalSize, columns, loading }) => (
        <div>
            <PaginationProvider
                pagination={
                    paginationFactory({
                        custom: false,
                        page,
                        sizePerPage,
                        totalSize,
                        firstPageText: 'First',
                        prePageText: 'Back',
                        nextPageText: 'Next',
                        lastPageText: 'Last',
                        nextPageTitle: 'First page',
                        prePageTitle: 'Pre page',
                        firstPageTitle: 'Next page',
                        lastPageTitle: 'Last page',
                        hidePageListOnlyOnePage: true,
                        showTotal: true,
                        paginationTotalRenderer: customTotal,
                        sizePerPageList: [{
                            text: '15', value: 15
                        }, {
                            text: '30', value: 30
                        }, {
                            text: '50', value: 50
                        }]
                    })
                }
            >
                {
                    ({
                        paginationProps,
                        paginationTableProps
                    }) => (
                        <div>
                            <ToolkitProvider
                                keyField={keyField}
                                data={data}
                                columns={columns}
                                

                            >
                                {
                                    props => (
                                        <div  class="table-horiz-scroll">
                                            
                                            {/* <div style={{ display: "none" }}>
                                                <ExportCSVButton {...props.csvProps}>Export CSV</ExportCSVButton>
                                            </div> */}
                                            <BootstrapTable rowClasses={props.rowClasses} loading={loading} remote {...paginationTableProps} {...props.baseProps} onTableChange={onTableChange}
                                                headerClasses="header-class" bordered={false} noDataIndication={indication} hover condensed  />
                                        {/* overlay={overlayFactory({ spinner: true })} */}
                                        </div>
                                    )
                                }
                            </ToolkitProvider>
                        </div>
                    )
                }
            </PaginationProvider>
        </div>
    );

    return (
        <RemotePagination
            keyField={props.keyField === undefined ? "id" : props.keyField}
            data={props.data}
            page={props.page}
            sizePerPage={props.sizePerPage}
            totalSize={props.totalSize}
            onTableChange={props.onTableChange}
            columns={props.columns}
            loading={props.loading}
        />
    );
}