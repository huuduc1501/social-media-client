import React, { useState } from "react";
import { Input } from "antd";
import queryString from "query-string";
import { useHistory } from "react-router-dom";
import styled from "styled-components";

const Wrapper = styled.div`
  input {
    background: ${(props) => props.theme.bg};
    color: ${(props) => props.theme.onBg};
    outline: none;
    border: none;
  }
  input:focus {
    border-color: unset ;
    box-shadow:unset;
  }
`;

const SearchField = () => {
  const history = useHistory();
  const [value, setValue] = useState(
    queryString.parse(history.location.search).searchTerm
  );
  const handleSearch = (e) => {
    if (e.key === "Enter") history.push(`/timkiem?searchTerm=${value}`);
    return;
  };

  return (
    <Wrapper>
      <Input
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onKeyDown={handleSearch}
        placeholder="tìm kiếm"
      />
    </Wrapper>
  );
};

export default SearchField;
