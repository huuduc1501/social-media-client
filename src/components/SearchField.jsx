import React, { useState } from "react";
import { Input } from "antd";
import { useHistory } from "react-router-dom";

const SearchField = () => {
  const [value, setValue] = useState("");
  const history = useHistory();
  console.log(history);
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
