import React, { useEffect, useState, useCallback } from 'react';
import _ from 'lodash'
import { Document, Page, pdfjs } from 'react-pdf';//'react-pdf';
import { useCtrl } from 'react-imvc/hook';
import Ctrl from '../Controller'
import { Carousel, Form, Button } from 'react-bootstrap';
// 设置 PDF.js 的 workerSrc
pdfjs.GlobalWorkerOptions.workerSrc = '/pdf.worker.js';

const PdfReader = () => {
    const { handleUPloadPdf, handleSetPageContentList } = useCtrl<Ctrl>()
    const [file, setFile] = useState(null);
    const [fileLoadStatus, setFileLoadStatus] = useState(0)


    const onFileChange = (event) => {
        // clear
        handleSetPageContentList([])
        setFileLoadStatus(0)
        const newFile = event?.target?.files[0]
        if(newFile) setFile(newFile);
    }

    const onLoadedSuccess = ()=>{
        setFileLoadStatus(1)
    }
    return (
        <div id={`pdfreader`}>
            <div className='top_line'>
                <Form.Group 
                    controlId="formFile" 
                    className={`mb-3 uploadinput ${fileLoadStatus == 1 ? 'loaded' : ''}`} 
                    onChange={onFileChange} 
                >
                    <Form.Label>Please choose a PDF file</Form.Label>
                    <Form.Control type="file" />
                </Form.Group>
                {fileLoadStatus == 1? <LoadingButton /> : null}
            </div>
            {file ? (
                <ControlledCarousel file={file} loadCallback={onLoadedSuccess} />
            ) : null}
        </div>
    );
}



export default PdfReader;


const ControlledCarousel=({file, loadCallback}: {file:any, loadCallback?: Function}) =>{
    const [index, setIndex] = useState(0);
    const [numPages, setNumPages] = useState(null);
    // const [pagesContentList, setPagesContentList] = useState([]);
    const { handleUPloadPdf, handleSetPageContentList } = useCtrl<Ctrl>()
  
    const handleSelect = (selectedIndex, e) => {
      setIndex(selectedIndex);
    };

    const onDocumentLoadSuccess =  (documentArgs) =>{
        console.log(documentArgs)
        const { numPages } = documentArgs || {}
        setNumPages(numPages);
        if(typeof loadCallback == `function`){
            loadCallback()
        }
    }

    let temp: any = [];
    const onPageTextLoadSuccess = (page) => {
        page.getTextContent().then((textContent) => {
            temp.push({
                page: page.pageNumber,
                contentList: textContent?.items
            })
            handleSetPageContentList(temp)
        });
    }

    return (
        <div>
            <Document file={file} onLoadSuccess={onDocumentLoadSuccess}>
                <Carousel activeIndex={index} onSelect={handleSelect} interval={null}>
                {_.map(new Array(numPages), (el, index) => (
                    <Carousel.Item key={`pdf_page_${index}`}>
                    <div className='inside_carousel'>
                        <Page 
                            key={`page_${index + 1}`}
                            pageNumber={index + 1}
                            renderTextLayer={false} 
                            renderAnnotationLayer={false}   
                            onLoadSuccess={(page) => onPageTextLoadSuccess(page)} />
                        <p className='pdf_page_number'>
                            Page {index + 1} of {numPages}
                        </p>
                        <br />
                    </div>
                    </Carousel.Item>

                ))}
                </Carousel>
            </Document>
        </div>
    )
}


  
const LoadingButton = () => {
    const [isLoading, setLoading] = useState(false);
    const { handleUPloadPdf } = useCtrl<Ctrl>()
    useEffect(() => {
        const asnycEffect = async()=>{
            if(isLoading){
                await handleUPloadPdf()
                setLoading(false)
            }
        }
        asnycEffect()
    }, [isLoading]);

    const handleClick = () => setLoading(true);

    return (
        <div className='loading_button'>
        <Button
        variant="primary"
        disabled={isLoading}
        onClick={!isLoading ? handleClick : null}
        >
        {isLoading ? 'Loading…' : 'Click to Upload'}
        </Button>
        </div>
    );
}