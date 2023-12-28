import { Route, Routes } from 'react-router-dom';
import './styles/index.scss';
import { AuthProvider } from './context/auth-context';
import React, { Suspense } from 'react';

const HomePage = React.lazy(() => import('./pages/HomePage'));
const CategoryPage = React.lazy(() => import('./pages/CategoryPage'));
const DashboardPage = React.lazy(() => import('./pages/DashboardPage'));
const SignupPage = React.lazy(() => import('./pages/SignupPage'));
const SigninPage = React.lazy(() => import('./pages/SigninPage'));
const PostDetailsPage = React.lazy(() => import('./pages/PostDetailsPage'));
const NotFoundPage = React.lazy(() => import('./pages/NotFoundPage'));
const DashboardLayout = React.lazy(() => import('./module/dashboard/DashboardLayout'));
const PostManage = React.lazy(() => import('./module/post/PostManage'));
const PostAddNew = React.lazy(() => import('./module/post/PostAddNew'));
const CategoryManage = React.lazy(() => import('./module/category/CategoryManage'));
const CategoryUpdate = React.lazy(() => import('./module/category/CategoryUpdate'));
const CategoryAddNew = React.lazy(() => import('./module/category/CategoryAddNew'));
const UserAddNew = React.lazy(() => import('./module/user/UserAddNew'));
const UserProfile = React.lazy(() => import('./module/user/UserProfile'));
const UserManage = React.lazy(() => import('./module/user/UserManage'));
const UserUpdate = React.lazy(() => import('./module/user/UserUpdate'));
const PostUpdate = React.lazy(() => import('./module/post/PostUpdate'));



function App() {
  return (
    <div>
      <AuthProvider>
        <Suspense>
          <Routes>
            <Route path="/" element={<HomePage></HomePage>}></Route>
            <Route path="/sign-up" element={<SignupPage></SignupPage>}></Route>
            <Route path="/sign-in" element={<SigninPage></SigninPage>}></Route>

            <Route path="*" element={<NotFoundPage></NotFoundPage>}></Route>
            <Route
              path="/category/:slug"
              element={<CategoryPage></CategoryPage>}
            ></Route>
            <Route
              path="/:slug"
              element={<PostDetailsPage></PostDetailsPage>}
            ></Route>
            <Route element={<DashboardLayout></DashboardLayout>}>
              <Route
                path="/dashboard"
                element={<DashboardPage></DashboardPage>}
              ></Route>
              <Route
                path="/manage/post"
                element={<PostManage></PostManage>}
              ></Route>
              <Route
                path="/manage/add-post"
                element={<PostAddNew></PostAddNew>}
              ></Route>
              <Route
                path="/manage/update-post"
                element={<PostUpdate></PostUpdate>}
              ></Route>
              <Route
                path="/manage/category"
                element={<CategoryManage></CategoryManage>}
              ></Route>
              <Route
                path="/manage/add-category"
                element={<CategoryAddNew></CategoryAddNew>}
              ></Route>
              <Route
                path="/manage/update-category"
                element={<CategoryUpdate></CategoryUpdate>}
              ></Route>
              <Route
                path="/manage/user"
                element={<UserManage></UserManage>}
              ></Route>
              <Route
                path="/manage/add-user"
                element={<UserAddNew></UserAddNew>}
              ></Route>
              <Route
                path="/manage/update-user"
                element={<UserUpdate></UserUpdate>}
              ></Route>
              <Route
                path="/profile"
                element={<UserProfile></UserProfile>}
              ></Route>
            </Route>
          </Routes>
        </Suspense>
      </AuthProvider>
    </div>
  );
}

export default App;
