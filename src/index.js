import React from 'react';
import ReactDOM from 'react-dom';
import { LocaleProvider } from 'antd';
// import './index.css';
import {Dashboard} from "./App";
import enUS from 'antd/lib/locale-provider/en_US';
import registerServiceWorker from './registerServiceWorker';

ReactDOM.render(
  <div>
  <LocaleProvider locale={enUS}>
    <Dashboard />
  </LocaleProvider>
  </div>,
  document.getElementById('root'));
registerServiceWorker();
