import React, { useState } from "react";
import { withRouter } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch } from "@fortawesome/free-solid-svg-icons";
import styled from "styled-components";

const Search = styled.div`
  display: flex;
  align-items: center;
  margin: 8px;
  border-radius: 5px;
  color: #cbcbcb;
  border: 1px solid #cbcbcb;
  padding: 0 24px 0 3px;
  width: 100%;
  input {
    width: 100%;
    color: #cbcbcb;
    border: none;
    height: 36px;
    tranistion: color 150ms ease-out;
  }
  .fa-search {
    font-size: 14pt;
  }
`;
const Results = styled.div`
  display: table;
  width: 90vw;
  -webkit-box-shadow: 3px 3px 5px 6px #cbcbcb;
  -moz-box-shadow: 3px 3px 5px 6px #cbcbcb;
  abox-shadow: 3px 3px 5px 6px #cbcbcb;
  padding: 10px;
  position: absolute;
  left: 4vw;
  top: 55px;
  right: 1vw;
  border-radius: 4px;
  background-color: white;
  .active {
    background-color: #cbcbcb;
    color: white;
  }
`;
const Result = styled.div`
  display: table-row;
  margin: 1px;
  line-height: 1.5;
`;

const Symbol = styled.span`
  padding-right: 3rem;
  display: table-cell;
  font-weight: bolder;
`;

const Label = styled.div`
  font-size: 10pt;
  color: grey;
  font-weight: bolder;
`;
const Name = styled.span`
  display: table-cell;
`;
const SearchBar = props => {
  let { allStocks, history } = props;
  const [cursor, setCursor] = useState(0);
  const [input, setInput] = useState("");

  const match = stock => {
    let match = false;
    const _match = field => {
      let testInput = input.toLowerCase();
      if (typeof field === "string") {
        field = field.toLowerCase();
      }
      return (
        testInput.length <= field.length &&
        field.slice(0, testInput.length) === testInput
      );
    };
    if (stock.name && (_match(stock.name) || _match(stock.symbol)))
      match = true;
    return match;
  };

  const filterStocks = () => {
    const results = [];
    const maxSize = 6;
    let i = 0;
    if (allStocks) {
      while (results.length < maxSize && i < allStocks.length) {
        if (match(allStocks[i])) {
          results.push(allStocks[i]);
        }
        i++;
      }
    }
    return results;
  };
  const handleClick = symbol => {
    setInput("");
    history.push(`/stocks/${symbol}`);
  };
  const renderResults = () => {
    if (input.length > 0) {
      return (
        <Results>
          <Label>Stock</Label>
          {filterStocks().map((stock, i) => (
            <Result
              key={i}
              onClick={() => handleClick(stock.symbol)}
              className={cursor === i ? "active" : null}
            >
              <Symbol className="result">{stock.symbol}</Symbol>
              <Name>
                {stock.name
                  .split(" ")
                  .slice(0, 3)
                  .join(" ")}
              </Name>
            </Result>
          ))}
        </Results>
      );
    }
  };
  const handleKeyDown = e => {
    if (e.keyCode === 38 && cursor > 0) {
      setCursor(cursor - 1);
    } else if (e.keyCode === 40 && cursor < allStocks.length) {
      setCursor(cursor + 1);
    }
    if (e.keyCode === 13) {
      let elements = [...document.getElementsByClassName("result")];
      let symbol = elements[cursor].innerHTML;
      setInput("");
      history.push(`/stocks/${symbol}`);
    }
  };
  return (
    <>
      <Search>
        <FontAwesomeIcon icon={faSearch} />
        <input
          type="text"
          className="searcbar-input"
          placeholder="  Search"
          value={input}
          onKeyDown={handleKeyDown}
          onChange={e => setInput(e.target.value)}
        />
      </Search>
      {renderResults()}
    </>
  );
};
export default withRouter(SearchBar);