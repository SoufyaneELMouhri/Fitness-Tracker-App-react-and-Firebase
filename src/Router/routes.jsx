import { createBrowserRouter } from 'react-router-dom';
import Home from '../Pages/guests/Home';
import Login from '../Pages/guests/Login';
import Register from '../Pages/guests/Register';
import LayoutGuest from '../Pages/guests/LayoutGuest';
import LayoutUser from '../Pages/userFitness/LayoutUser';
import HomeUser from '../Pages/userFitness/HomeUser';
import Profile from '../Pages/userFitness/Profile';
import Progress from '../Pages/userFitness/Progress';
import Workouts from '../Pages/userFitness/Workouts';
import AdminLayout from '../Pages/adminDashboard/AdminLayout';
import CoachLayout from '../Pages/coachDashboard/CoachLayout';
import NotFound from '../Pages/guests/NotFound';
import Unauthorized from '../Pages/guests/Unauthorized';
import Nutrition from '../Pages/userFitness/Nutrition';
import RolePProtectedRoute from './ProtectedRoute';
import ProtectedRoute from './ProtectedRoute';
const router = createBrowserRouter([
    {
        path: '/',
        element: <LayoutGuest />,
        children: [
            { index: true, element: <Home /> },
            { path: 'login', element: <Login /> },
            { path: 'register', element: <Register /> },
        ],
    },
    {
        path : 'app',
        element : <ProtectedRoute>
                      <LayoutUser/>
                  </ProtectedRoute>,
        children : [
            { index: true, element : <HomeUser/> },
            { path : 'dashboard', element : <HomeUser/> },
            { path : 'profile', element : <Profile/> },
            { path : 'progress', element : <Progress/> },
            { path : 'workouts', element : <Workouts/> },
            {path : 'nutrition', element : <Nutrition/>}
        ]
    },
    {
        path : '/admin',
        element : <RolePProtectedRoute allowedRoles={['admin']}><AdminLayout/></RolePProtectedRoute>,
    },
    {
        path : '/coach',
        element : <RolePProtectedRoute allowedRoles={['coach']}><CoachLayout/></RolePProtectedRoute>,
    },
    { path: '*', element: <NotFound /> },
    {
        path : '/unauthorized',
        element : <Unauthorized/>
    }
]);

export default router;