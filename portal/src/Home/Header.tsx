import React, { ReactNode } from 'react';
import { Row, Col, Menu, Input, Dropdown } from 'antd';

<<<<<<< Updated upstream:portal/src/Home/Header.tsx
import './static/header.css'
=======
>>>>>>> Stashed changes:portal/src/components/layout/Header.tsx

import './Header.css'
import {
  MenuOutlined
} from '@ant-design/icons';
const { Search } = Input;

export function Header(props: {
  tableMode: boolean;
  searchBar?: ReactNode;
}) {



  const menu = (
    <Menu mode='horizontal' id="nav" key="nav">
      <Menu.Item key="home">
        <a className="menu-item" href="/">Inicio</a>
      </Menu.Item>
      <Menu.Item key="explorar">
<<<<<<< Updated upstream:portal/src/Home/Header.tsx
        <a href="/explore">Explorar</a>
=======
        <a className="menu-item" href="/explore">Explorar Datos</a>
>>>>>>> Stashed changes:portal/src/components/layout/Header.tsx
      </Menu.Item>
      <Menu.Item key="analisis">
        <a className="menu-item" href="/action">Compras COVID</a>
      </Menu.Item>
      <Menu.Item key="conjunto">
        <a className="menu-item" href="/sources">Fuente de datos</a>
      </Menu.Item>
      <Menu.Item key="docs">
        <a className="menu-item" href="/about">Acerca de</a>
      </Menu.Item>
    </Menu>
  );

  return (
    props.tableMode ?
      <div id="header" className="header">
        <Row>
          <Col xxl={4} xl={5} lg={6} md={6} sm={20} xs={20}>
            <div className="header-title-wrapper">
              <h1 className="header-table-mode">CONTROL CIUDADANO</h1>
            </div>
          </Col>
          <Col xxl={6} xl={4} lg={4} md={4} sm={4} xs={4}>
            {props.searchBar }
          </Col>
          <Col xxl={14} xl={15} lg={14} md={14} sm={0} xs={0}>
            <div className="header-meta">
              <div id="menu">{menu}</div>
            </div>
          </Col>
        </Row>
      </div> :
      <div id="header" className="header">
        <Row>
<<<<<<< Updated upstream:portal/src/Home/Header.tsx
          <Col xxl={10} xl={10} lg={10} md={10} sm={24} xs={24}>
=======
          <Col xxl={8} xl={8} lg={8} md={8} sm={22} xs={22}>
>>>>>>> Stashed changes:portal/src/components/layout/Header.tsx
            <div>
              <h1 className="header-title">CONTROL CIUDADANO</h1>
            </div>
          </Col>
          <Col xxl={14} xl={14} lg={14} md={14} sm={0} xs={0}>
            <div className="header-meta">
              <div id="menu">{menu}</div>
            </div>
          </Col>
          <Col xxl={0} xl={0} lg={0} md={0} sm={2} xs={2}>
            <div className="collapsed-menu">
              <Dropdown className="dropdown-item" overlay={menu} trigger={['click']}>
                  <MenuOutlined />
              </Dropdown>
            </div>
          </Col>
        </Row>
      </div >
  );

}
