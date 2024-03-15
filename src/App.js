import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faToggleOn, faToggleOff } from '@fortawesome/free-solid-svg-icons';
import './App.css'

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
  console.log("sanfdf", data)
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
    filterKeys.reduce((acc, key) => ({ ...acc, [key]: [] }), {})
  );
  const [searchTerm, setSearchTerm] = useState('');

  const handleFilterChange = (key, value) => {
    setFilterValues(prev => ({
      ...prev,
      [key]: prev[key].includes(value)
        ? prev[key].filter(item => item !== value)
        : [...prev[key], value]
    }));
  };


  useEffect(() => {
    let filtered = data?.filter(item => {
      return filterKeys.every(key => {
        const filterValue = filterValues[key];
        // Check if the key exists in the item before comparing
        return filterValue.length === 0 || (item[key] && filterValue.includes(item[key]));
      }) &&
        ((item.name ? item.name.toLowerCase().includes(searchTerm.toLowerCase()) : false) ||
          (item.mall ? item.mall.toLowerCase().includes(searchTerm.toLowerCase()) : false));
    });
    setFilteredData(filtered);
  }, [data, filterKeys, filterValues, searchTerm]);


  const handleToggleIcon = (key, option) => {
    const isChecked = filterValues[key].includes(option);
    handleFilterChange(key, option);
    if (isChecked) {
      // If checked, uncheck
      setFilterValues(prev => ({
        ...prev,
        [key]: prev[key].filter(item => item !== option)
      }));
    } else {
      // If unchecked, check
      setFilterValues(prev => ({
        ...prev,
        [key]: [...prev[key], option]
      }));
    }
  };

  return (
    <div className="container">
      <div className="row">
        <div className="col-md-12">
          <div className="row">
            {filterKeys.map(keyName => (
              <div key={keyName} className="col-md-3 mb-3">
                <div className="form-group">
                  <div className="toggle-container">
                    <label className="mainHead">{keyName.charAt(0).toUpperCase() + keyName.slice(1)}</label>
                    {filterOptions[keyName]
                      ?.filter(option => option.trim() !== '')
                      .map((option, index) => (
                        <div key={index} className="form-check">
                          <label className="toggle-label" onClick={() => handleToggleIcon(keyName, option)}>
                            <span className="icon-wrapper">
                              <FontAwesomeIcon style={{ fontSize: '26px', color: 'gray' }} icon={filterValues[keyName].includes(option) ? faToggleOn : faToggleOff} />
                            </span>
                            <span className="option-name" style={{ marginBottom: '4px' }}>{option}</span>
                          </label>
                        </div>
                      ))}
                  </div>
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
