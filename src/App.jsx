import { useState } from 'react'
import './App.css'
import { useRoutes } from 'react-router-dom'
import ReadPosts from './pages/ReadPosts'
import CreatePost from './pages/CreatePost'
import EditPost from './pages/EditPost'
import Account from './pages/Account'
import Login from './pages/Login'
import NavigationBar from './components/NavigationBar'


function App() {


  let routes = useRoutes([
    {
    path: '/',
    element: <ReadPosts />
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
    element: <Login />
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
