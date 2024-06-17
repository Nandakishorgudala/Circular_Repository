import React, { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Row, Col } from 'react-bootstrap';
import { useSelector } from 'react-redux';
import CircularCard from '../circularcard/CircularCard';
import './ViewCircular.css';

function ViewCircular() {
  const { currentUser } = useSelector((state) => state.StaffAdminLoginReducer);

  const [circularsList, setCircularsList] = useState([]);
  const [filteredCirculars, setFilteredCirculars] = useState([]);
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('');
  const [date, setDate] = useState('');
  const navigate = useNavigate();

  const inputRef = useRef();
  const categoryRef = useRef();
  const dateRef = useRef();

  useEffect(() => {
    const token = localStorage.getItem('token');
    const axiosWithToken = axios.create({
      headers: { Authorization: `Bearer ${token}` }
    });

    const getCircularsOfCurrent = async () => {
      try {
        console.log("Fetching circulars...");
        const res = await axiosWithToken.get("http://localhost:4000/staff-api/circulars");
       
        setCircularsList(res.data.payload);
        setFilteredCirculars(res.data.payload);
      } catch (error) {
        console.error("Error fetching circulars:", error);
      }
    };

    getCircularsOfCurrent();
  }, []);

  useEffect(() => {
    filterCirculars();
  }, [query, category, date, circularsList]);

  const filterCirculars = () => {
    const lowerCaseQuery = query.toLowerCase();
    const lowerCaseCategory = category.toLowerCase();
    const filtered = circularsList.filter(circular => {
      const matchesQuery = lowerCaseQuery ? circular.title.toLowerCase().includes(lowerCaseQuery) : true;
      const matchesCategory = lowerCaseCategory ? circular.category.toLowerCase().includes(lowerCaseCategory) : true;
      const matchesDate = date ? circular.date === date : true;
      const matchesStatus = currentUser.userType === 'admin' || circular.status === true;
      return matchesQuery && matchesCategory && matchesDate && matchesStatus;
    });
    setFilteredCirculars(filtered);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    setQuery(inputRef.current.value);
    setCategory(categoryRef.current.value);
    setDate(dateRef.current.value);
  };

  const handleCardClick = (circular) => {
    navigate('/circular-download', { state: { circular } });
  };

  return (
    <div className='circularList-outer'>
      <h2>ALL Circulars</h2>
      <form className="search-form" onSubmit={handleSearch}>
        <input type="text" placeholder="Search by title" ref={inputRef} />
        <input type="text" placeholder="Search by category" ref={categoryRef} />
        <input type="date" placeholder="Search by date" ref={dateRef} />
        <button type="submit">Search</button>
        <button type="button" onClick={() => {
          inputRef.current.value = '';
          categoryRef.current.value = '';
          dateRef.current.value = '';
          setQuery('');
          setCategory('');
          setDate('');
          setFilteredCirculars(circularsList);
        }}>Reset</button>
      </form>
      <div className="CircularsList">
        {filteredCirculars.map((circular, index) => (
          <div className='clist' key={index}>
            <Row className="justify-content-md-center">
              <Col>
                <CircularCard
                  onClick={() => handleCardClick(circular)}
                  data={circular}
                />
              </Col>
            </Row>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ViewCircular;
