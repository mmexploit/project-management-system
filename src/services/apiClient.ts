import axios from "axios";
import { deleteCookie, getCookie, setCookie } from "cookies-next";
import { jwtDecode } from "jwt-decode";

export const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_ADMIN_API, // Use the updated environment variable
  headers: {
    "Content-type": "application/json",
  },
});

// Add request interceptor to include the token in the headers
// apiClient.interceptors.request.use(
//   async (config) => {
//     let token = getCookie("token");

//     if (token) {
//       // eslint-disable-next-line @typescript-eslint/no-explicit-any
//       const decodedToken: any = jwtDecode(token as string);
//       const currentTime = Date.now() / 1000;

//       if (decodedToken.exp < currentTime) {
//         // Token has expired, refresh it
//         const refreshToken = getCookie("refresh_token");
//         if (refreshToken) {
//           try {
//             const response = await axios.post(
//               `${process.env.NEXT_PUBLIC_ADMIN_API}/users/token/refresh`,
//               { refresh_token: refreshToken }
//             );
//             const { access_token: newToken} =
//               response.data;

//             setCookie("token", newToken);

//             token = newToken;
//             // eslint-disable-next-line @typescript-eslint/no-explicit-any
//           } catch (refreshError: any) {
//             console.error(
//               "Failed to refresh token. Redirecting to login...",
//               refreshError
//             );
//             // Redirect to login or handle refresh token failure
//             deleteCookie("token");
//             deleteCookie("refreshToken");
//             window.location.href = "/auth/login";
//           }
//         }
//       }

//       config.headers.Authorization = `Bearer ${token}`;
//     }

//     return config;
//   },
//   (error) => {
//     return Promise.reject(error);
//   }
// );

// Add response interceptor to handle token expiration or unauthorized requests
// apiClient.interceptors.response.use(
//   (response) => {
//     return response;
//   },
//   (error) => {
//     if (error.response?.status === 401) {
//       // Handle token expiration or unauthorized requests
//       console.error("Unauthorized request. Redirecting to login...");
//     //   deleteCookie("token");
//     //   deleteCookie("refreshToken");
//     //   window.location.href = "/auth/login";
//       // Redirect to login or refresh the token
//     }
//     return Promise.reject(error);
//   }
// );
