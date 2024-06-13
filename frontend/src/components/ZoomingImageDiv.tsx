import {Link} from "react-router-dom";
import React from "react";


function ZoomingImageDiv(
    {path, img, w, h, text} : {
        path: string
        img: string
        w: number
        h: number
        text: string
    }
) {
    return (
        <Link to={path}
              className={`flex items-center bg-white rounded-2xl w-${w} h-${h} text-xl font-bold overflow-hidden shadow-2xl`}>
            <div className="zooming_card">
                <div className="zooming_card_img"
                     style={{backgroundImage: `url(${img})`}}>
                </div>
                <h1 className="zooming_card_txt">{text}</h1>
            </div>
        </Link>
    )
}

export default ZoomingImageDiv