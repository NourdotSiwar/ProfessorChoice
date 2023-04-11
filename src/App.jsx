import { useEffect, useState } from 'react'
import './App.css'
import { useRoutes } from 'react-router-dom'
import ReadPosts from './pages/CRUD_Posts/ReadPosts'
import CreatePost from './pages/CRUD_Posts/CreatePost'
import EditPost from './pages/CRUD_Posts/EditPost'
import Account from './pages/Account'
import Login from './pages/Login'
import SignUp from './pages/SignUp'
import NavigationBar from './components/NavigationBar'
import DetailedPost from './pages/DetailedPost'
import ReadComments from './pages/CRUD_Comments/ReadComments'
import EditComment from './pages/CRUD_Comments/EditComment'
import CreateComment from './pages/CRUD_Comments/CreateComment'


function App() {
  const [token, setToken] = useState(false);
  const [user, setUser] = useState(null);


  useEffect(() => {
    if(sessionStorage.getItem('token')){
      let data = JSON.parse(sessionStorage.getItem('token'));
      setUser(data);
    }
  }, [])
  
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
    element: token ? <CreatePost token={token}
    userId={user?.id}
    />
      : <Login setToken={setToken}/>
    },
    {
    path: '/edit/:id',
    element: <EditPost token={token}/>
    },
    {
    path: '/account',
    element: token ? <Account token={token}/>
      : <Login setToken={setToken}/>
    },
    {
    path: '/',
    element: <Login setToken={setToken}/>
    },
    {
    path: '/signup',
    element: <SignUp />
    },
    {
    path: '/post/:id',
    element: <DetailedPost token={token}/>
    },
    {
    path: '/post/:id',
    element: <ReadComments token={token}
    postId={user?.id} />
    },
    {
    path: '/editComment/:id',
    element: <EditComment postId={user?.id} />
    },
    {
    path: '/post/:id',
    element: <CreateComment token={token}
    postId={user?.id}/>
    },
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
