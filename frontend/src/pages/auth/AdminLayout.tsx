import type { FC, PropsWithChildren } from 'react';

export const AdminLayout: FC<PropsWithChildren> = ({ children }) => {
  return (
    <div className="page-content--bge5">
      <div className="container">
        <div className="admin-wrap">
          <div className="admin-content">
            <div className="admin-logo">
              <a href="/" className="logo mr-auto">
                <img
                  width={100}
                  height={100}
                  src="assets/img/logo_blue.png"
                  alt=""
                  className="img-fluid"
                />
                DEMON SLAYERS
              </a>
            </div>
            {children}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminLayout;
