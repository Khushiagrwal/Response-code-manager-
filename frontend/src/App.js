import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import LoginPage from './components/LoginPage';  // without .js
import SearchPage from './components/SearchPage';  // without .js
import ListPage from './components/ListPage';  // without .js
import Header from './components/Header';  // without .js
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
