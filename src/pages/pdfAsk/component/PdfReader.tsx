import React, { useEffect, useState, useCallback } from 'react';
import _ from 'lodash'
import { Document, Page, pdfjs } from 'react-pdf';//'react-pdf';
import { useCtrl } from 'react-imvc/hook';
import Ctrl from '../Controller'
// 设置 PDF.js 的 workerSrc
pdfjs.GlobalWorkerOptions.workerSrc = '/pdf.worker.js';

const PdfReader = () => {
    const { handleUPloadPdf } = useCtrl<Ctrl>()
    const [file, setFile] = useState(null);
    const [numPages, setNumPages] = useState(null);
    const [pagesContentList, setPagesContentList] = useState([]);


    const onFileChange = (event) => {
        const newFile = event?.target?.files[0]
        if(newFile) setFile(newFile);
    }

    const onDocumentLoadSuccess =  (documentArgs) =>{
        console.log(documentArgs)
        const { numPages } = documentArgs || {}
        setNumPages(numPages);
    }

    let temp: any = [];
    const onPageTextLoadSuccess = (page) => {
        page.getTextContent().then((textContent) => {
            temp.push({
                page: page.pageNumber,
                contentList: textContent?.items
            })
            setPagesContentList(temp)
            
        });
    }

    const onButtonClick = ()=>{
        if(!_.isEmpty(pagesContentList)) handleUPloadPdf(pagesContentList)
    }

    return (
        <div>
            <input type="file" onChange={onFileChange} />
            {file ? (
                <div>
                    <button onClick={onButtonClick}>Upload</button>
                    <Document file={file} onLoadSuccess={onDocumentLoadSuccess}>
                        {_.map(new Array(numPages), (el, index) => (
                            <>
                            <Page 
                                key={`page_${index + 1}`}
                                pageNumber={index + 1}
                                renderTextLayer={false} 
                                renderAnnotationLayer={false}   
                                onLoadSuccess={(page) => onPageTextLoadSuccess(page)} />
                            <p>
                                Page {index + 1} of {numPages}
                            </p>
                            <br />
                            </>
                        ))}
                    </Document>
                    
                </div>
            ) : null}
        </div>
    );
}



export default PdfReader;