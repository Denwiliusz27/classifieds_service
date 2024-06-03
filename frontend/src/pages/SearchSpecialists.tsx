import {useEffect} from "react";
import {useNavigate, useOutletContext} from "react-router-dom";
import {AuthContextType} from "../App";

function SearchSpecialists() {
    const { jwtToken, userRole } = useOutletContext<AuthContextType>();

    const navigate = useNavigate()

    useEffect(() => {
        if (jwtToken !== "") {
            if (userRole === "specialist") {
                navigate("/specjalista/strona_glowna")
                return
            }
        }
    }, [jwtToken, userRole, navigate])

    return(
        <>
            <p>Search for specialists</p>
        </>
    )
}

export default SearchSpecialists;