import { createBrowserRouter } from 'react-router-dom'
import LoginForm from '../pages/Login'
import ChatRoom from '../pages/Chat'

//export
const router = createBrowserRouter([
			{
				path: '/',
				element: <LoginForm/>,
			},
			{
				path: '/ChatRoom/:userId',
				element: <ChatRoom />,
			},
]);

//기본값
export default router
