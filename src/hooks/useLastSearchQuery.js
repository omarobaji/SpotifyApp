import { useEffect, useState, useCallback } from "react";
const KEY = 'search_history';

const useLastSearchQuery = () => {
    const [latestQuery, setLatestQuery] = useState(null);
    const refreshStoredSearch = useCallback((searchText) => {
        localStorage.getItem(KEY);
        if(localStorage.getItem(KEY) == null) {
          localStorage.setItem(KEY, JSON.stringify({ query: searchText }));
        } else {
          localStorage.removeItem(KEY);
          localStorage.setItem(KEY, JSON.stringify({ query: searchText }));
        }
      }, []);
    
    useEffect(() => {
        async function getLastStoredQuery() {
            setLatestQuery(localStorage.getItem(KEY));
        };
        getLastStoredQuery();
    }, []);
      
    return { latestQuery, refreshStoredSearch };
};

export default useLastSearchQuery;