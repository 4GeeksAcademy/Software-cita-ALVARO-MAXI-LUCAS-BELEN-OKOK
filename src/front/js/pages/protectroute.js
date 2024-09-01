import { useContext } from "react"
import { Navigate } from "react-router-dom"
import {AuthContext} from '../../js/store/AuthContext'

function protectroute( {children }) {
  const { user } = useContext(AuthContext)

if (!user) {
  return <Navigate to="/login" />;
}
return children;
}
export default protectroute