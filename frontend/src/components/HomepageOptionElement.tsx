import React from "react";

function HomepageOptionElement(
    {img, alt, text, w = 24, h = 24} : {
        img: string,
        alt: string,
        text: string,
        w?: number,
        h?: number
    }

) {
    return(
        <div className="flex flex-col items-center w-1/5 mx-4">
            <div className={`w-${w} h-${h} mb-4`}>
                <img src={img}
                     alt={alt}/>
            </div>
            <p>{text}</p>
        </div>
    )
}

export default HomepageOptionElement;