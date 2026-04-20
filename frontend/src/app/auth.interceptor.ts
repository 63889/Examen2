import axios from 'axios';

const api = axios.create({
  baseURL: 'http://192.168.1.7:8001',
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('access_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry){
      originalRequest._retry = true;
      try{
        const refreshToken = localStorage.getItem('refresh_token');

        const refreshTokenResponse = await axios.post('http://192.168.1.7:8001/users/refresh/', {
          "refresh": refreshToken,
        });

        if (refreshTokenResponse.status === 200){
          const newAccessToken = refreshTokenResponse.data.access;
          const newRefreshToken = refreshTokenResponse.data.refresh;
          localStorage.setItem('access_token', newAccessToken);
          localStorage.setItem('refresh_token', newRefreshToken);
          originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
          return axios(originalRequest);
        }
      } catch (refreshError) {
        localStorage.clear();
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }
    return Promise.reject(error);
  }
);

export default api;

// import { HttpErrorResponse, HttpEvent, HttpInterceptorFn } from '@angular/common/http';
// import { catchError, Observable, tap, throwError } from 'rxjs';

// export const authInterceptor: HttpInterceptorFn = (req, next) => {
//   const token = localStorage.getItem('access_token');

//   //If token exists, clone the request and add the Bearer token
//   //to the headers
//   if (token){
//     const cloned = req.clone({
//       setHeaders: {
//         Authorization: `Bearer ${token}`
//       }
//     });
//     return next(cloned);
//   }

//   //If there's no token, just pass the original request through
//   return next(req);
// };

// export const invalidTokenInterceptor: HttpInterceptorFn = (req, next) => {
//   return next(req).pipe(
//     catchError((error) => {
//       if (error instanceof HttpErrorResponse && error.status === 401){

//       }
//     })
//   );
// }

