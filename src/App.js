import logo from './logo.svg';
import "./App.css";
import { useState, useEffect, useRef } from 'react';
import axios from 'axios';

function App() {
  const [query,setQuery] = useState("");
  const [loading,setLoading] = useState(false);
  const [hasMore,setHasMore] = useState(false);
  const [page,setPage] = useState(1);
  const [data,setData] = useState([]);
  const observer = useRef();

  const lastElemnt = (node)=>{
        if(loading)return;
        if(observer.current)observer.current.disconnect();

        observer.current = new IntersectionObserver((entries)=>{
          if(entries[0].isIntersecting && hasMore){
            setPage((page)=>page+1);
          }
        });

        if(node){observer.current.observe(node);}
  };
  useEffect(()=>{
      setData([]);
  },[query]);
  useEffect(()=>{ 
    setLoading(true);
    const getSearchItems = async ()=>{
       const books = await axios.get(`http://openlibrary.org/search.json?title=${query}&page=${page}`);
       setLoading(false); 
        setHasMore(books.data.docs.length > 0 );
       setData((prev)=>{
        return [...new Set([...prev,...books.data.docs.map((book)=>book.title)]),];
       });
    };
    getSearchItems();
     
  },[query,page]);

 let timer;
  const handleChange = (event) =>{
    if(timer){
      clearTimeout(timer);
    }
    timer = setTimeout(()=>{
      setQuery(event.target.value);
      setPage(1);
    },1000);
     
  };
  return (
    <div className="searchContainer">
     <input type='text' onChange={handleChange }></input>
      {data.map((book,index)=>{
        if(data.length === index + 1){
           return ( <div key={index} ref={lastElemnt} className="searchTitle">{book}</div>);
        }else{
        return (<div key={index} className="searchTitle">{book}</div>);}
       })}
       {loading && "Loading..."}
    </div>
  );
}

export default App;
