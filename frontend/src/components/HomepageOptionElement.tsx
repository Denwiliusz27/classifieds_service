import React from "react";

function HomepageOptionElement(
    {img, alt, text,h = 32} : {
        img: string,
        alt: string,
        text: string,
        h?: number
    }

) {
    return(
        <div className="flex flex-col items-center w-1/5 mx-4">
            <div className={`w-3/5 h-${h} mb-4`}>
                <img src={img}
                     alt={alt}/>
            </div>
            <p>{text}</p>
        </div>
    )
}

export default HomepageOptionElement;