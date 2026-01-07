import type { FC } from 'react';
import { Route, Routes, Navigate } from 'react-router-dom';
import { RoutePath } from './RoutePath';
import Main from '../pages/main/Main';
import Login from '../pages/auth/Login/Login';
import LoginNew from '../pages/auth/LoginNew/LoginNew';
import Register from '../pages/auth/Register/Register';
import Marketplace from '../pages/marketplace/Marketplace';
import Shop from '../pages/shop/Shop';
import Userprofile from '../pages/main/Userprofile';
import AdminPage from '../pages/auth/AdminPage';
import PasswordCheck from '../pages/auth/LoginNew/PasswordCheck';
import AdminDashboard from '../pages/auth/AdminDashboard';
import AdminProfile from '../pages/auth/AdminProfile';
import Chat from '../pages/chat/Chat';
import NotFound from '../pages/NotFound';
import Hashiras from '../pages/hashiras/Hashiras';
import Demons from '../pages/demons/Demons';
import Characters from '../pages/characters/Characters';
import UserDashboard from '../pages/user/UserDashboard';
import Missions from '../pages/missions/Missions';
import Upload from '../pages/upload/Upload';
import Debug from '../pages/debug/Debug';
import DashboardDemo from '../pages/auth/DashboardDemo';
import { DashboardRouter } from '../components/DashboardRouter';
import { AdminRouteGuard } from '../components/AdminRouteGuard';
import { SuperAdminRedirect } from '../components/SuperAdminRedirect';
import { RoleBasedRoute } from '../components/RoleBasedRoute';
import { LoggedInRedirect } from '../components/LoggedInRedirect';
import { LoggedOutOnly } from '../components/LoggedOutOnly';

export const AppRoutes: FC = () => {
  const user = sessionStorage.getItem('email') || localStorage.getItem('email');

  return (
    <Routes>
      <Route path={RoutePath.Login} element={<Login />} />
      <Route path={RoutePath.LoginNew} element={<LoginNew />} />

      <Route
        path={RoutePath.PasswordCheck}
        element={
          user ? (
            <PasswordCheck />
          ) : (
            <Navigate
              to={{ pathname: RoutePath.Home }}
              state={{ from: '/passwordcheck' }}
            />
          )
        }
      />

      <Route path={RoutePath.Register} element={<Register />} />

      <Route
        path={RoutePath.Marketplace}
        element={
          user ? (
            <Marketplace preview={false} />
          ) : (
            <Navigate
              to={{ pathname: RoutePath.Login }}
              state={{ from: '/marketplace' }}
            />
          )
        }
      />

      <Route
        path={RoutePath.Shop}
        element={
          <SuperAdminRedirect>
            <RoleBasedRoute 
              allowedRoles={['hashira', 'demon_slayer_corps', 'people']} 
              redirectTo={RoutePath.Login}
            >
              <Shop />
            </RoleBasedRoute>
          </SuperAdminRedirect>
        }
      />

      <Route
        path={RoutePath.Userprofile}
        element={
          <SuperAdminRedirect>
            <RoleBasedRoute allowedRoles={['hashira', 'demon_slayer_corps', 'people']} redirectTo={RoutePath.Login}>
              <Userprofile />
            </RoleBasedRoute>
          </SuperAdminRedirect>
        }
      />

      <Route
        path={RoutePath.Adminpage}
        element={
          user ? (
            <AdminPage />
          ) : (
            <Navigate
              to={{ pathname: RoutePath.Home }}
              state={{ from: '/adminpage' }}
            />
          )
        }
      />

      <Route
        path={RoutePath.Dashboard}
        element={
          <RoleBasedRoute allowedRoles={['super_admin', 'hashira', 'demon_slayer_corps', 'people']} redirectTo={RoutePath.Login}>
            <DashboardRouter />
          </RoleBasedRoute>
        }
      />

      <Route
        path={RoutePath.Chat}
        element={
          <SuperAdminRedirect>
            <RoleBasedRoute 
              allowedRoles={['hashira', 'demon_slayer_corps', 'people']} 
              redirectTo={RoutePath.Login}
            >
              <Chat />
            </RoleBasedRoute>
          </SuperAdminRedirect>
        }
      />

      <Route
        path={RoutePath.Missions}
        element={
          <SuperAdminRedirect>
            <RoleBasedRoute 
              allowedRoles={['hashira', 'demon_slayer_corps', 'people']} 
              redirectTo={RoutePath.Login}
            >
              <Missions />
            </RoleBasedRoute>
          </SuperAdminRedirect>
        }
      />

      <Route
        path={RoutePath.Upload}
        element={<Upload />}
      />

      <Route
        path={RoutePath.Debug}
        element={<Debug />}
      />

      <Route
        path={RoutePath.DashboardDemo}
        element={<DashboardDemo />}
      />

      <Route
        path={RoutePath.Hashiras}
        element={
          <LoggedOutOnly>
            <Hashiras />
          </LoggedOutOnly>
        }
      />
      
      <Route
        path={RoutePath.Demons}
        element={
          <LoggedOutOnly>
            <Demons />
          </LoggedOutOnly>
        }
      />
      
      <Route
        path={RoutePath.Characters}
        element={
          <LoggedOutOnly>
            <Characters />
          </LoggedOutOnly>
        }
      />

      <Route
        path={RoutePath.Home}
        element={
          <LoggedOutOnly>
            <Main />
          </LoggedOutOnly>
        }
      />

      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};
