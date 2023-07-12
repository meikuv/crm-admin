import axios from 'axios'

const instance = axios.create({
  headers: {
    'Content-Type': 'application/json',
    SSO_USER_ID: <string>sessionStorage.getItem('currentUser'),
  },
})

export default instance
