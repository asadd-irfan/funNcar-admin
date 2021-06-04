import React, { useDebugValue } from "react";
import styled from "@emotion/styled";
import Select from "react-dropdown-select";

class DropDown extends React.Component {
    constructor(props) {
        super(props);

        this.state = {

            // multi: this.props.MultiSelect,
            disabled: false,
            loading: false,
            contentRenderer: false,
            dropdownRenderer: this.props.dropdownRenderer,
            inputRenderer: false,
            itemRenderer: false,
            optionRenderer: false,
            noDataRenderer: false,
            selectValues: [],
            searchBy: "label",
            clearable: true,
            searchable: true,
            create: this.props.create,
            separator: false,
            forceOpen: false,
            handle: true,
            addPlaceholder: "",
            labelField: "label",
            valueField: "id",
            color: "#0074D9",
            keepSelectedInList: true,
            closeOnSelect: true,
            dropdownPosition: "bottom",
            direction: "ltr",
            dropdownHeight: "300px",
            CheckNew: 'no'

        };

    }

    setValues = (selectValues) => {
        if (!(this.props.multi)) {
            if (selectValues.length == 0) {   // || selectValues[0][this.props.labelField] === selectValues[0][this.props.valueField]
                this.props.onChange(this.props.Type, 0);
            }
            else {
                this.props.onChange(this.props.Type, selectValues[0][this.props.valueField]);
            }
        }
        else {
            // if(selectValues.length > 3){
            //     debugger
            //      this.props.onChange(this.props.Type,this.props.val)
            //      this.setState({
            //         selectValues:[]
            //      })
            //      return this.props.val
            // }
            this.props.onChange(this.props.Type, selectValues);
        }

    }

    contentRenderer = ({ props, state }) => {
        return (
            <div>
                {state.values.length} of {props.options.length} Selected
            </div>
        );
    };

    noDataRenderer = () => {
        return (
            <p style={{ textAlign: "center" }}>
                <strong>Ooops!</strong> No data found
            </p>
        );
    };

    itemRenderer = ({ item, itemIndex, props, state, methods }) => (

        <div key={item[props.valueField]} onClick={() => methods.addItem(item)}>

        </div>
    );

    dropdownRenderer = ({ props, state, methods }) => {

        const regexp = new RegExp(state.search, "i");

        return (
            <div>
                <SearchAndToggle color={this.state.color}>
                    <Buttons>
                        <div>Search and select:</div>
                        {methods.areAllSelected() ? (
                            <Button className="clear" onClick={methods.clearAll}>
                                Clear all
                            </Button>
                        ) : (
                            <Button onClick={methods.selectAll}>Select all</Button>
                        )}
                    </Buttons>
                    <input
                        type="text"
                        value={state.search}
                        onChange={methods.setSearch}
                        placeholder="Type anything"
                    />
                </SearchAndToggle>
                <Items>
                    {props.options
                        .filter(item =>
                            regexp.test(item[props.searchBy] || item[props.labelField])
                        )
                        .map(option => {
                            if (
                                !this.state.keepSelectedInList &&
                                methods.isSelected(option)
                            ) {
                                return null;
                            }

                            return (
                                <Item
                                    disabled={option.disabled}
                                    key={option[props.valueField]}
                                    onClick={
                                        option.disabled ? null : () => methods.addItem(option)
                                    }
                                >
                                    <input
                                        type="checkbox"
                                        onChange={() => methods.addItem(option)}
                                        checked={state.values.indexOf(option) !== -1}
                                    />
                                    <ItemLabel>{option[props.labelField]}</ItemLabel>
                                </Item>
                            );
                        })}
                </Items>
            </div>
        );
    };

    optionRenderer = ({ option, props, state, methods }) => (
        <React.Fragment>
            <div onClick={event => methods.removeItem(event, option, true)}>
                {option.name}
            </div>
        </React.Fragment>
    );

    inputRenderer = ({ props, state, methods }) => (
        <input
            tabIndex="1"
            className="react-dropdown-select-input"
            size={methods.getInputSize()}
            value={state.search}
            onClick={() => methods.dropDown("open")}
            onChange={methods.setSearch}
            placeholder="Type in"
        />
    );

    GetSelected = () => {
        if (this.props.multi == true) {
            // var selected=[]
            // var ProcessedOptions= Common.ProcessDataInArray(this.props.options,this.props.valueField)
            // for(var i in this.props.val)
            // {
            //   selected.push(ProcessedOptions[this.props.val[i]])
            // }
            return this.props.val
        }
        else {
            var arr = this.props.options
            for (var i in arr) {
                if (arr[i][this.props.valueField] == this.props.val) {
                    var temp = []
                    temp.push(arr[i])
                    // this.setValues(temp)
                    return temp
                }
            }
            return []
        }
    };

    render() {
        return (<>
        {this.props.inputLabel && <div className="Input-label">{this.props.inputLabel}</div>}
            <StyledSelect
                placeholder={!(this.props.placeholder) ? "Select" : this.props.placeholder}
                addPlaceholder={this.props.addPlaceholder}
                color={this.state.color}
                disabled={this.props.disabled}
                loading={this.props.loading}
                searchBy={this.props.searchBy}
                separator={this.state.separator}
                clearable={this.props.clearable == undefined ? true : this.props.clearable}
                searchable={this.state.searchable}
                create={this.props.create}
                keepOpen={this.state.forceOpen}
                dropdownHandle={this.state.handle}
                dropdownHeight={this.state.dropdownHeight}
                direction={this.state.direction}
                multi={this.props.multi}
                backspaceDelete={true}
                values={this.GetSelected()}
                labelField={this.props.labelField}
                valueField={this.props.valueField}
                options={this.props.options}
                dropdownGap={5}
                keepSelectedInList={this.state.keepSelectedInList}
                onDropdownOpen={() => undefined}
                onCreateNew={value => this.props.AddNew(value)}
                // onDropdownClose={values => this.dropclosed(values)}
                onClearAll={() => undefined}
                onSelectAll={() => undefined}
                onChange={values => this.setValues(values)}
                noDataLabel="No matches found"
                closeOnSelect={this.props.closeOnSelect}
                noDataRenderer={
                    this.state.noDataRenderer
                        ? () => this.noDataRenderer()
                        : undefined
                }
                dropdownPosition={this.state.dropdownPosition}
                itemRenderer={

                    this.state.itemRenderer
                        ? (item, itemIndex, props, state, methods) =>
                            this.itemRenderer(item, itemIndex, props, state, methods)
                        : undefined
                }
                inputRenderer={
                    this.state.inputRenderer
                        ? (props, state, methods) =>
                            this.inputRenderer(props, state, methods)
                        : undefined
                }
                optionRenderer={
                    this.state.optionRenderer
                        ? (option, props, state, methods) =>
                            this.optionRenderer(option, props, state, methods)
                        : undefined
                }
                contentRenderer={
                    this.props.contentRenderer
                        ? (innerProps, innerState) =>
                            this.contentRenderer(innerProps, innerState)
                        : undefined
                }
                dropdownRenderer={
                    this.state.dropdownRenderer
                        ? (innerProps, innerState, innerMethods) =>
                            this.dropdownRenderer(
                                innerProps,
                                innerState,
                                innerMethods
                            )
                        : undefined
                }
            />
        </>);
    }
}

export { DropDown as default };

const StyledSelect = styled(Select)`
  ${({ dropdownRenderer }) =>
        dropdownRenderer &&
        `
		.react-dropdown-select-dropdown {
			overflow: initial;
		}
	`}
`;

const SearchAndToggle = styled.div`
  display: flex;
  flex-direction: column;
  input {
    margin: 10px 10px 0;
    line-height: 30px;
    padding: 0 20px;
    border: 1px solid #ccc;
    
    border-radius: 3px;
    :focus {
      outline: none;
      border: 1px solid ${({ color }) => color};
    }
  }
`;

const Items = styled.div`
  overflow: auto;
  min-height: 10px;
  max-height: 200px;
`;

const Item = styled.div`
  display: flex;
  margin: 10px;
  align-items: baseline;
  cursor: pointer;
  border-bottom: 1px dotted transparent;
  :hover {
    border-bottom: 1px dotted #ccc;
  }
  ${({ disabled }) =>
        disabled
            ? `
  	opacity: 0.5;
  	pointer-events: none;
  	cursor: not-allowed;
  `
            : ""}
`;

const ItemLabel = styled.div`
  margin: 5px 10px;
`;

const Buttons = styled.div`
  display: flex;
  justify-content: space-between;
  & div {
    margin: 10px 0 0 10px;
    font-weight: 600;
  }
`;

const Button = styled.button`
  background: none;
  border: 1px solid #555;
  color: #555;
  border-radius: 3px;
  margin: 10px 10px 0;
  padding: 3px 5px;
  font-size: 10px;
  text-transform: uppercase;
  cursor: pointer;
  outline: none;
  &.clear {
    color: tomato;
    border: 1px solid tomato;
  }
  :hover {
    border: 1px solid deepskyblue;
    color: deepskyblue;
  }
`;

const StyledHtmlSelect = styled.select`
  padding: 0;
  margin: 0 0 0 10px;
  height: 23px !important;
  color: #0071dc;
  background: #fff;
  border: 1px solid #0071dc;
`;

const StyledInput = styled.input`
  margin: 0 0 0 10px;
  height: 23px !important;
  color: #0071dc;
  background: #fff;
  border: 1px solid #0071dc;
  border-radius: 3px;
  padding: 13px 10px;
  width: 70px;
`;