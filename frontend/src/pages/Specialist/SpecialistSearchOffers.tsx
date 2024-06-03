import {useNavigate, useOutletContext} from "react-router-dom";
import {AuthContextType} from "../../App";
import {useEffect} from "react";

function SpecialistSearchOffers() {
    const {jwtToken, userRole} = useOutletContext<AuthContextType>();

    const navigate = useNavigate()

    useEffect(() => {
        const tmp = sessionStorage.getItem(userRole)
        if (!tmp)

        if (jwtToken === "" && userRole !== "specialist") {
            navigate("/wybor_konta")
            return
        }
    }, [jwtToken, userRole, navigate])

    return(
        <>
            <div>
                <p>Oferty specjalisty</p>
            </div>
        </>
    )
}

export default SpecialistSearchOffers