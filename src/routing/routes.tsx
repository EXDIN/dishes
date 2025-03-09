import { RouteObject } from "react-router-dom";
import Pages from "./pages-enum";
import Layout from "../components/Layout/Layout";
import { Busket, Home, Meal, Page404 } from "../pages";

const routes: RouteObject[] = [
    {
        path: Pages.Home,
        element: <Layout />,
        children: [
            {
                path: Pages.Home,
                element: <Home />,
            },
            {
                path: Pages.Meal,
                element: <Meal />,
            },
            {
                path: Pages.Busket,
                element: <Busket />,
            },
            {
                path: Pages.Undefined,
                element: <Page404 />,
            },
        ],
    },
];

export default routes;
