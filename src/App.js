import React, { useState, useEffect } from 'react';

const data = [
  // {
  //   "id": 1,
  //   "mall": "V R mall",
  //   "address": "Surat",
  //   "rating": "A"
  // },
  // {
  //   "id": 2,
  //   "mall": "Rahul Raj Mall",
  //   "address": "dallas",
  //   "rating": "B"
  // },
  // {
  //   "id": 3,
  //   "mall": "Raj Imperial",
  //   "address": "san francisco",
  //   "category": "one",
  //   "rating": "B"
  // },
  // {
  //   "id": 4,
  //   "mall": "Jane",
  //   "address": "denver",
  //   "category": "two",
  //   "rating": "C"
  // }
  {
    "id": 1,
    "name": "foo",
    "city": "dallas",
    "catagory": "one",
    "type": "A",
    "Active": "FALSE"
},
{
    "id": 2,
    "name": "bar",
    "city": "dallas",
    "catagory": "one",
    "type": "B",
    "Active": "FALSE"
},
{
    "id": 3,
    "name": "jim",
    "city": "san francisco",
    "catagory": "one",
    "type": "B",
    "Active": "TRUE"
},
{
    "id": 4,
    "name": "jane",
    "city": "denver",
    "catagory": "two",
    "type": "C",
    "Active": "FALSE"
}
];

const getFilterKeys = (data) => {
  const allKeys = data.reduce((keys, item) => {
    return keys.concat(Object.keys(item)?.filter(key => !keys.includes(key)));
  }, []);
  return allKeys?.filter(key => key !== 'id' && key !== 'name');
};

const getFilterOptions = (data, filterKeys) => {
  const filters = {};
  filterKeys.forEach(key => {
    filters[key] = ["", ...new Set(data.map(item => item[key])?.filter(Boolean))];
  });
  return filters;
};

function App() {
  const filterKeys = getFilterKeys(data);
  const [filterOptions, setFilterOptions] = useState(getFilterOptions(data, filterKeys));
  const [filteredData, setFilteredData] = useState(data);
  const [filterValues, setFilterValues] = useState(
    filterKeys.reduce((acc, key) => ({ ...acc, [key]: '' }), {})
  );
  const [searchTerm, setSearchTerm] = useState('');

  const handleFilterChange = (key, value) => {
    setFilterValues(prev => ({
      ...prev,
      [key]: value
    }));
  };

 useEffect(() => {
  let filtered = data?.filter(item => {
    return filterKeys.every(key => {
      const filterValue = filterValues[key];
      return filterValue !== '' ? item[key] && item[key].toString() === filterValue : true;
    }) && 
    ((item.name ? item.name.toLowerCase().includes(searchTerm.toLowerCase()) : false) ||
    (item.mall ? item.mall.toLowerCase().includes(searchTerm.toLowerCase()) : false));
  });
  setFilteredData(filtered);
}, [data, filterKeys, filterValues, searchTerm]);



return (
  <div className="container">
    <div className="row">
      <div className="col-md-12">
        <div className="row">
          {filterKeys.map(keyName => (
            <div key={keyName} className="col-md-3 mb-3">
              <div className="form-group">
                <label>{keyName.charAt(0).toUpperCase() + keyName.slice(1)}</label>
                <select
                  className="form-control"
                  value={filterValues[keyName]}
                  onChange={(e) => handleFilterChange(keyName, e.target.value)}
                >
                  <option value="">All {keyName.charAt(0).toUpperCase() + keyName.slice(1)}</option>
                  {filterOptions[keyName]
                    ?.filter(option => option.trim() !== '')
                    .map((option, index) => (
                      <option key={index} value={option}>
                        {option}
                      </option>
                  ))}
                </select>
              </div>
            </div>
          ))}
          <div className="col-md-3 mb-3">
            <div className="form-group">
              <label>Name</label>
              <input
                type="text"
                className="form-control"
                placeholder="Search by name"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
    <div className="row">
      <div className="col-md-12">
        <DynamicTable data={filteredData} />
      </div>
    </div>
  </div>
);


}

function DynamicTable({ data }) {
  if (data.length === 0) return <div>No data available</div>;

  const tableKeys = [...getFilterKeys(data)];
  if (data.some(item => item.hasOwnProperty('name'))) {
    tableKeys.splice(0, 0, 'name');
  }
  tableKeys.unshift('id');

  return (
    <table className="table">
      <thead>
        <tr>
          {tableKeys.map((key, index) => (
            <th key={index}>{key.charAt(0).toUpperCase() + key.slice(1)}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {data.map((item, rowIndex) => (
          <tr key={rowIndex}>
            {tableKeys.map((key, colIndex) => (
              <td key={colIndex}>{item[key] !== undefined ? item[key].toString() : 'N/A'}</td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
}

export default App;
