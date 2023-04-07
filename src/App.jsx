import { useEffect, useState } from 'react'
import './App.css'
import { useRoutes } from 'react-router-dom'
import ReadPosts from './pages/ReadPosts'
import CreatePost from './pages/CreatePost'
import EditPost from './pages/EditPost'
import Account from './pages/Account'
import Login from './pages/Login'
import SignUp from './pages/SignUp'
import NavigationBar from './components/NavigationBar'


function App() {

  const [token, setToken] = useState(false);
  if(token){
    sessionStorage.setItem('token', JSON.stringify(token));
  }

  useEffect(() => {
    if(sessionStorage.getItem('token')){
      let data = JSON.parse(sessionStorage.getItem('token'));
      setToken(data);
    }
  }, [])

  let routes = useRoutes([
    {
    path: '/dashboard',
    element: token ? <ReadPosts token={token}/>
     : <Login setToken={setToken}/>
    },
    {
    path: '/create',
    element: <CreatePost />
    },
    {
    path: '/edit/:id',
    element: <EditPost />
    },
    {
    path: '/account',
    element: <Account />
    },
    {
    path: '/login',
    element: <Login setToken={setToken}/>
    },
    {
    path: '/',
    element: <SignUp />
    }
    ]);

  return (
    <div className="App">
      <header className="App-header">
        <NavigationBar />
        {routes}
      </header>
    </div>
  )
}

export default App
