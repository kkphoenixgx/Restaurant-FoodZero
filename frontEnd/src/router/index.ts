import { createWebHistory, createRouter } from 'vue-router'

import Home from '../views/Home/Home.vue'
import Contact from '../views/Contact/Contact.vue'
import About from '../views/About/About.vue'

import Reservation from '../views/Reservation/Reservation.vue'
import Login from '../views/Auth/Login.vue'
import SignUp from '../views/Auth/SignUp.vue'
import UserView from '../views/Auth/UserView.vue'

import Blog from '../views/Blog/Blog.vue'
import Portifolio from '../views/Portifolio/Portifolio.vue'
import Menu from '../views/Menu/Menu.vue'


const routes = [
  { path: '/', component: Home },
  { path: '/contact', component: Contact },
  { path: '/about', component: About },
  { path: '/reservation', component: Reservation },
  { path: '/login', component: Login },
  { path: '/signup', component: SignUp },
  { path: '/userview', component: UserView },
  { path: '/blog', component: Blog },
  { path: '/blog/:id', component: () => import('../views/Blog/partials/BlogPost.vue'), name: 'BlogPost' },
  { path: '/portifolio', component: Portifolio },
  { path: '/portifolio/:id', component: () => import('../views/Portifolio/Partials/PortifolioItem.vue'), name: 'PortifolioItem' },
  { path: '/menu', component: Menu },
]

export default createRouter({
  history: createWebHistory(),
  routes,
})