import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import LoginPage from './components/LoginPage';  
import SearchPage from './components/SearchPage'; 
import ListPage from './components/ListPage';  
import Header from './components/Header';  
import '../src/App.css';

function App() {
  return (
    <Router>
      <Header />
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/search" element={<SearchPage />} />
        <Route path="/lists" element={<ListPage />} />
      </Routes>
    </Router>
    
  );
}

export default App;
