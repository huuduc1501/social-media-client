import React, { useState } from "react";
import { Input } from "antd";
import queryString from "query-string";
import { useHistory } from "react-router-dom";

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
    <Input
      value={value}
      onChange={(e) => setValue(e.target.value)}
      onKeyDown={handleSearch}
    />
  );
};

export default SearchField;
