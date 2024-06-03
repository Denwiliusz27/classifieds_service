import {useEffect} from "react";
import {useNavigate, useOutletContext} from "react-router-dom";
import {AuthContextType} from "../../App";

function ClientChats() {
    const {jwtToken, userRole} = useOutletContext<AuthContextType>();

    const navigate = useNavigate()

    useEffect(() => {
        if (jwtToken === "" && userRole !== "client") {
            navigate("/wybor_konta")
            return
        }
    }, [jwtToken, userRole, navigate])

    return (
        <>
            <p>Client chats</p>
        </>
    )
}

export default ClientChats