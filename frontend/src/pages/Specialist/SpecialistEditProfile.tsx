import {useNavigate, useOutletContext} from "react-router-dom";
import {AuthContextType} from "../../App";
import {useEffect} from "react";

function SpecialistEditProfile() {
    const {jwtToken, userRole} = useOutletContext<AuthContextType>();

    const navigate = useNavigate()

    useEffect(() => {
        if (jwtToken === "" && userRole !== "specialist") {
            navigate("/wybor_konta")
            return
        }
    }, [jwtToken, userRole, navigate])

    return(
        <>
            <p>Specialist edit profile</p>
        </>
    )
}

export default SpecialistEditProfile