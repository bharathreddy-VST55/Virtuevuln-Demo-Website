import { useEffect, useState } from 'react';
import { getAdminStatus } from '../../../api/httpClient';
import { RoutePath } from '../../../router/RoutePath';
interface MenuItem {
  name: string;
  path: string;
  newTab: boolean;
  subItems?: Array<MenuItem>;
  admin?: boolean;
  requiresLogin?: boolean;
}

const menu: Array<MenuItem> = [
  { name: 'Home', path: '/?maptitle=map', newTab: false },
  {
    name: 'Hashiras',
    path: '/hashiras',
    newTab: false
  },
  {
    name: 'Demons',
    path: '/demons',
    newTab: false
  },
  {
    name: 'Characters',
    path: '/characters/tanjiro',
    newTab: false
  },
  {
    name: 'Shop',
    path: '/shop',
    newTab: false
  },
  {
    name: 'Chat',
    path: '/chat',
    newTab: false,
    requiresLogin: true
  },
  { 
    name: 'Edit user data', 
    path: RoutePath.Userprofile, 
    newTab: false,
    requiresLogin: true
  },
  {
    name: 'Adminmenu',
    path: '',
    newTab: false,
    admin: true,
    requiresLogin: true,
    subItems: [
      { name: 'Adminpage', path: RoutePath.Adminpage, newTab: false },
      { name: 'Dashboard', path: RoutePath.Dashboard, newTab: false }
    ]
  },
];

export const Nav = () => {
  const user = sessionStorage.getItem('email') || localStorage.getItem('email');
  const [isAdminUser, setIsAdminUser] = useState<boolean>(false);

  useEffect(() => {
    // Only check admin status once when component mounts or user changes
    if (user) {
      getAdminStatus(user).then((data) => {
        setIsAdminUser(data.isAdmin);
      });
    } else {
      setIsAdminUser(false);
    }
  }, [user]); // Only depend on user, not isAdminUser to prevent infinite loop

  const menuItem = (item: MenuItem) => {
    return (
      <li
        className={`${item.subItems && 'drop-down'} ${
          window.location.pathname == item.path && 'active'
        }`}
        key={`${item.name}-${item.path}`}
      >
        <a href={item.path} target={item.newTab ? '_blank' : undefined}>
          {item.name}
        </a>
        {item.subItems && (
          <ul>
            {item.subItems.map((subItem) => (
              <li key={`${subItem.name}-${subItem.path}`}>
                <a
                  href={subItem.path}
                  target={subItem.newTab ? '_blank' : undefined}
                >
                  {subItem.name}
                </a>
              </li>
            ))}
          </ul>
        )}
      </li>
    );
  };

  return (
    <nav className="nav-menu d-none d-lg-block">
      <ul>
        {menu.map((item) => {
          // Hide items that require login if user is not logged in
          if (item.requiresLogin && !user) {
            return undefined;
          }
          // Hide admin items if user is not admin
          if (item.admin && !isAdminUser) {
            return undefined;
          }
          return menuItem(item);
        })}
      </ul>
    </nav>
  );
};
export default Nav;
