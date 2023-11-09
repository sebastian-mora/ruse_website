import axios from 'axios';

import { API_ENDPOINT } from '../config'

export const api = axios.create()

export function getBlogBySlug(slug) {
  return api.get(`${API_ENDPOINT}/blogs/${slug}`)
}

export function getAllBlogs() {
  return api.get(`${API_ENDPOINT}/blogs`)
}




