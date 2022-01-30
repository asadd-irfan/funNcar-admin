import React from "react";
import BootstrapTable from "react-bootstrap-table-next";
import "react-bootstrap-table-next/dist/react-bootstrap-table2.min.css";
import "react-bootstrap-table2-paginator/dist/react-bootstrap-table2-paginator.min.css";
import ToolkitProvider, { CSVExport } from "react-bootstrap-table2-toolkit";
import paginationFactory, {
  PaginationProvider,
  PaginationListStandalone,
} from "react-bootstrap-table2-paginator";
// import overlayFactory from 'react-bootstrap-table2-overlay';
import ExportToCSVBtn from "./exportToCSVBtn";

export default function Table(props) {
  // const { ExportCSVButton } = CSVExport;
  const indication = () => {
    return (
      <>
        {props.loading ? (
          <span>
            <i className="fa fa-spinner fa-spin" aria-hidden="true"></i>{" "}
            Loading...
          </span>
        ) : (
          <span>
            <span
              className="fa fa-exclamation-triangle"
              style={{ marginRight: "10px" }}
            ></span>
            No data found!
          </span>
        )}
      </>
    );
  };

  const customTotal = (from, to, size) => (
    <span className="react-bootstrap-table-pagination-total">
      {" "}
      Showing {from} to {to} of {size} Results
    </span>
  );

  const RemotePagination = ({
    keyField,
    data,
    page,
    sizePerPage,
    onTableChange,
    totalSize,
    columns,
    loading,
    rowEvents,
    // sortName,
    // sortOrder,
    exportBtn,
  }) => (
    <PaginationProvider
      pagination={paginationFactory({
        custom: false,
        paginationSize: 8,
        page,
        sizePerPage,
        totalSize,
        firstPageText: "First",
        prePageText: "Back",
        nextPageText: "Next",
        lastPageText: "Last",
        nextPageTitle: "First page",
        prePageTitle: "Pre page",
        firstPageTitle: "Next page",
        lastPageTitle: "Last page",
        hidePageListOnlyOnePage: true,
        showTotal: props.isTotalShow == undefined ? true : props.isTotalShow,
        paginationTotalRenderer: customTotal,
        sizePerPageList:
          // props.isTotalShow == undefined
          //   ? props.sizePerPageList == undefined
          //     ? [
          //         {
          //           text: "20",
          //           value: 20,
          //         },
          //         {
          //           text: "30",
          //           value: 30,
          //         },
          //         {
          //           text: "50",
          //           value: 50,
          //         },
          //       ]
          //     : props.sizePerPageList
          // :
          [],
      })}
    >
      {({ paginationProps, paginationTableProps }) => (
        <ToolkitProvider keyField={keyField} data={data} columns={columns}>
          {(props) => (
            <>
              {exportBtn && <ExportToCSVBtn {...props.csvProps} />}

              <div className="table-horiz-scroll">
                <BootstrapTable
                  rowClasses={props.rowClasses}
                  loading={loading}
                  remote={true}
                  {...paginationTableProps}
                  {...props.baseProps}
                  onTableChange={onTableChange}
                  headerClasses="header-class"
                  bordered={false}
                  noDataIndication={indication}
                  hover
                  condensed
                  rowEvents={rowEvents}
                  // sort={{ dataField: "fullName", order: "asc" }}
                />
                {/* overlay={overlayFactory({ spinner: true })} */}
              </div>
            </>
          )}
        </ToolkitProvider>
      )}
    </PaginationProvider>
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
      rowEvents={props.rowEvents}
      exportBtn={props.exportBtn == undefined ? true : props.exportBtn}
      // sortName={props.sortName == undefined ? "" : props.sortName}
      // sortOrder={props.sortOrder == undefined ? "" : props.sortOrder}
    />
  );
}
