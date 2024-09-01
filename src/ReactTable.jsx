import { useSelector, useDispatch } from 'react-redux';
import { fetchAllUserData, fetchDataAction } from './store';
import React, { useEffect, useState } from 'react';

const ReactTable = () => {
  const dispatch = useDispatch();
  const userData = useSelector((state) => state.userdataStore.userdata); 
  const dataPerPage = useSelector((state) => state.userdataStore.dataPerPage);
  const currentPage = useSelector((state) => state.userdataStore.currentPage);
  
  const [selectedRows, setSelectedRows] = useState([]);

  useEffect(() => {
    dispatch(fetchAllUserData());
  }, [dispatch]);

  const totalPages = Math.ceil(userData.length / dataPerPage);

  const pages = [...Array(totalPages + 1).keys()].slice(1);
  const indexOfLastPage = currentPage === 1 ? currentPage * dataPerPage : 16 + (currentPage - 2) * dataPerPage + dataPerPage;
  const indexOfFirstPage = indexOfLastPage - dataPerPage;

  const visibleData = userData.slice(indexOfFirstPage, indexOfLastPage);

  const handlePrev = () => {
    if(currentPage !== 1) {
      dispatch(fetchDataAction.onNavigatePrev());
    }
  };

  const handleNext = () => {
    if(currentPage !== totalPages) {
      dispatch(fetchDataAction.onNavigateNext());
    }
  };

  const onClickCurrentPage = (p) => {
    dispatch(fetchDataAction.onClickCurrentPage(p));
  };

  const handleRowSelect = (index) => {
    setSelectedRows(prevSelected =>
      prevSelected.includes(index)
        ? prevSelected.filter(i => i !== index)
        : [...prevSelected, index]
    );
  };

  return (
    <div className="container mx-auto p-4">
      <div className="overflow-hidden">
        <table className="min-w-full bg-white border border-gray-200 shadow-md rounded-lg">
          <thead className="bg-green-500 text-white">
            <tr>
              <th className="py-3 px-4 text-left">
                <input type="checkbox" disabled />
              </th>
              <th className="py-3 px-4 text-left">ID</th>
              <th className="py-3 px-4 text-left">Name</th>
              <th className="py-3 px-4 text-left">Gender</th>
              <th className="py-3 px-4 text-left">Location</th>
              <th className="py-3 px-4 text-left">Email</th>
              <th className="py-3 px-4 text-left">Phone</th>
              <th className="py-3 px-4 text-left">Date of Birth</th>
            </tr>
          </thead>
          <tbody>
            {visibleData.map((user, index) => (
              <tr
                key={index}
                className={`border-b hover:bg-gray-50 ${
                  selectedRows.includes(index) ? 'bg-yellow-100' : ''
                }`}
              >
                <td className="py-2 px-4">
                  <input
                    type="checkbox"
                    checked={selectedRows.includes(index)}
                    onChange={() => handleRowSelect(index)}
                  />
                </td>
                <td className="py-2 px-4">{index + 1 + indexOfFirstPage}</td>
                <td className="py-2 px-4">{`${user.name.first} ${user.name.last}`}</td>
                <td className="py-2 px-4">{user.gender}</td>
                <td className="py-2 px-4">{`${user.location.city}, ${user.location.country}`}</td>
                <td className="py-2 px-4">{user.email}</td>
                <td className="py-2 px-4">{user.phone}</td>
                <td className="py-2 px-4">{new Date(user.dob.date).toLocaleDateString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="flex justify-between items-center mt-4">
        <div className="flex space-x-1">
          <button
            onClick={handlePrev}
            disabled={currentPage === 1}
            className={`px-3 py-1 text-white bg-blue-500 rounded-lg hover:bg-blue-600 ${
              currentPage === 1 && 'opacity-50 cursor-not-allowed'
            }`}
          >
            Prev
          </button>
          {pages.map((p) => (
            <button
              key={p}
              onClick={() => onClickCurrentPage(p)}
              className={`px-3 py-1 border rounded-lg ${
                p === currentPage
                  ? 'bg-blue-500 text-white'
                  : 'bg-white text-blue-500 border-blue-500'
              } hover:bg-blue-600 hover:text-white`}
            >
              {p}
            </button>
          ))}
          <button
            onClick={handleNext}
            disabled={currentPage === totalPages}
            className={`px-3 py-1 text-white bg-blue-500 rounded-lg hover:bg-blue-600 ${
              currentPage === totalPages && 'opacity-50 cursor-not-allowed'
            }`}
          >
            Next
          </button>
        </div>
        <div className="text-gray-600">
          Page {currentPage} of {totalPages}
          <select
            onChange={(event) => {
              dispatch(fetchDataAction.onChangeDataPerPage(event.target.value));
            }}
            className="ml-2 border border-gray-300 rounded-md p-1"
          >
            <option value="10">10</option>
            <option value="5">5</option>
          </select>
        </div>
      </div>
    </div>
  );
};

export default ReactTable;
