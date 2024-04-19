import {useRouteError} from "react-router-dom";

function ErrorPage() {
    const error: any = useRouteError()

    return(
        <div className="flex justify-center items-center">
            <div>
                <h1>Chyba nie tego szukasz...</h1>
                <p>Wróć na stronę główną klikając w tekst u góry po lewej stronie.</p>
                <p>
                    <em>{error.statusText || error.message}</em>
                </p>
            </div>
        </div>
    )
}

export default ErrorPage;