import React from 'react'
import {
    Input
} from "@mui/material";
import { Buffer } from 'buffer';

const FileUploader = ({children, id=1, onFileChange, fileType=undefined}) => {

    const retriveFile = (e) => {
        const data = e.target.files[0];
        const reader = new window.FileReader();
        reader.readAsArrayBuffer(data);
        reader.onloadend = () => {
            onFileChange(Buffer(reader.result), data.type);
        }
        e.preventDefault(); 
    }

    return (
        <>
            <label htmlFor={`select-file-${id}`}>
                {children}
            </label>    
            <input type='file' accept={fileType} id={`select-file-${id}`} style={{display:'none'}} onChange={(e)=>retriveFile(e)} />
        </>
    )
}

export default FileUploader