import {useEffect, useState} from "react";
import {useLocation, useNavigate, useOutletContext} from "react-router-dom";
import {AuthContextType} from "../../App";

function SpecialistProfile() {
    const [specialistId, setSpecialistId] = useState(0)

    const location = useLocation()
    const {jwtToken, userRole} = useOutletContext<AuthContextType>();
    const navigate = useNavigate()

    useEffect(() => {
        if (jwtToken !== "") {
            if (userRole === "specialist") {
                navigate("/specjalista/strona_glowna")
                return
            }
        }

        setSpecialistId(location.state.specialistId)
    }, [])


    return(
        <>
            <p>Specialist profile {specialistId}</p>
        </>
    )
}

export default SpecialistProfile