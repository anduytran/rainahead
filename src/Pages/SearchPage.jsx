import React, { useState } from 'react';
const apiKey = 'AIzaSyAkrWmcg8P28_lSmSyV55Jhl5Ejztf1z-o';
const SearchPage = () => {
    const [value, setValue] = useState('');
    const [results, setResults] = useState([]);
    const [error, setError] = useState('');

    const onChange = (event) => {
        const searchTerm = event.target.value;
        setValue(searchTerm);
        
        // Only fetch data if there's a value
        if (searchTerm.length > 0) {
            onSearch(searchTerm);
        } else {
            setResults([]); // Clear results if input is empty
        }
    };

    const onSearch = async (searchTerm) => {
        const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(searchTerm)}&key=${apiKey}`;
        try {
            const response = await fetch(url);
            const data = await response.json();
            if (data.status === "OK") {
                setResults(data.results);
                setError('');
            } else {
                setResults([]); // Clear results if no results found
            }
        } catch (error) {
            console.error(error);
            setError('Error fetching data.');
            setResults([]);
        }
    };

    return (
        <div className="App">
            <h1>Search</h1>
            <div className="search-container">
                <div className="search-inner">
                    <input type="text" value={value} onChange={onChange} />
                    <button onClick={() => onSearch(value)}>Search</button>
                </div>
                {error && <p className="error">{error}</p>}
                <div className="dropdown">
                    {results
                        .filter(item => item.types.includes("locality")) // Filter for cities\
                        .filter(item => {
                            const searchTerm = value.toLowerCase();
                            const address = item.formatted_address.toLowerCase();
                            return searchTerm && address.startsWith(searchTerm) && address !== searchTerm;
                        })
                        .map((item) => (
                            <div 
                                onClick={() => onSearch(item.formatted_address)} 
                                key={item.formatted_address} 
                                className="dropdown-row"
                            >
                                {item.formatted_address}
                            </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default SearchPage