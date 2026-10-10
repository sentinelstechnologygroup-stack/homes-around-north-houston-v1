import React from 'react';
import { renderToString } from 'react-dom/server';
import { StaticRouter } from 'react-router-dom';
import { SiteRoutes } from './App';
export function render(url) { return renderToString(<StaticRouter location={url}><SiteRoutes /></StaticRouter>); }

