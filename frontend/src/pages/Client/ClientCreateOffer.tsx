import {useNavigate, useOutletContext} from "react-router-dom";
import {AuthContextType} from "../../App";
import {useEffect} from "react";

function ClientCreateOffer() {
    const {jwtToken, userRole} = useOutletContext<AuthContextType>();

    const navigate = useNavigate()

    useEffect(() => {
        if (jwtToken === "" && userRole !== "client") {
            navigate("/wybor_konta")
            return
        }
    }, [jwtToken, userRole, navigate])

    return(
        <>
            <p>Here you can create offers</p>
        </>
    )
}

export default ClientCreateOffer;