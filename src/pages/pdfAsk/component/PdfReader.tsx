import React, { useEffect, useState, useCallback } from 'react'
import _ from 'lodash'
import { Document, Page, pdfjs } from 'react-pdf' //'react-pdf';
import { useCtrl, useModelState } from 'react-imvc/hook'
import Ctrl from '../Controller'
import { State } from '../Model'
import { Carousel, Form, Button } from 'react-bootstrap'
import { PDF_UPLOAD_STATUS } from '../types'
// 设置 PDF.js 的 workerSrc
pdfjs.GlobalWorkerOptions.workerSrc = '/pdf.worker.js'

const PdfReader = () => {
    const { handleSetPageContentList } = useCtrl<Ctrl>()
    const { uploadStatus } = useModelState<State>()
    const [file, setFile] = useState(null)
    const [fileLoadStatus, setFileLoadStatus] = useState(0)

    const onFileChange = event => {
        // clear
        handleSetPageContentList([])
        setFileLoadStatus(0)
        const newFile = event?.target?.files[0]
        if (newFile) setFile(newFile)
    }

    const onLoadedSuccess = () => {
        setFileLoadStatus(1)
    }
    return (
        <div id={`pdfreader`}>
            <div className="top_line">
                <Form.Group
                    controlId="formFile"
                    className={`mb-3 uploadinput ${fileLoadStatus == 1 ? 'loaded' : ''}`}
                    onChange={onFileChange}
                >
                    <Form.Label>Please choose a PDF file</Form.Label>
                    <Form.Control type="file" disabled={uploadStatus == PDF_UPLOAD_STATUS.LOADING} />
                </Form.Group>
                {fileLoadStatus == 1 ? <LoadingButton file={file} /> : null}
            </div>
            {file ? <ControlledCarousel file={file} loadCallback={onLoadedSuccess} /> : null}
        </div>
    )
}

export default PdfReader

const ControlledCarousel = ({ file, loadCallback }: { file: any; loadCallback?: Function }) => {
    const [index, setIndex] = useState(0)
    const [numPages, setNumPages] = useState(null)
    // const [pagesContentList, setPagesContentList] = useState([]);
    const { handleUPloadPdf, handleSetPageContentList } = useCtrl<Ctrl>()

    const handleSelect = (selectedIndex, e) => {
        setIndex(selectedIndex)
    }

    const onDocumentLoadSuccess = documentArgs => {
        console.log(documentArgs)
        const { numPages } = documentArgs || {}
        setNumPages(numPages)
        if (typeof loadCallback == `function`) {
            loadCallback()
        }
    }

    let temp: any = []
    const onPageTextLoadSuccess = page => {
        page.getTextContent().then(textContent => {
            temp.push({
                page: page.pageNumber,
                contentList: textContent?.items,
            })
            handleSetPageContentList(temp)
        })
    }

    return (
        <div>
            <Document file={file} onLoadSuccess={onDocumentLoadSuccess}>
                <Carousel activeIndex={index} onSelect={handleSelect} interval={null}>
                    {_.map(new Array(numPages), (el, index) => (
                        <Carousel.Item key={`pdf_page_${index}`}>
                            <div className="inside_carousel">
                                <Page
                                    key={`page_${index + 1}`}
                                    pageNumber={index + 1}
                                    renderTextLayer={false}
                                    renderAnnotationLayer={false}
                                    onLoadSuccess={page => onPageTextLoadSuccess(page)}
                                />
                                <p className="pdf_page_number">
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

const LoadingButton = ({ file }: { file: any }) => {
    const { uploadStatus } = useModelState<State>()
    const [disabled, setDisabled] = useState(false)
    const [buttonText, setButtonText] = useState('Click to Upload')

    const { handleUPloadPdf } = useCtrl<Ctrl>()

    useEffect(() => {
        switch (uploadStatus) {
            case PDF_UPLOAD_STATUS.FAILED:
                setDisabled(false)
                setButtonText('Failed, Try Again')
                break
            case PDF_UPLOAD_STATUS.SUCCESS:
                setDisabled(true)
                setButtonText('Upload Success')
                break
            case PDF_UPLOAD_STATUS.LOADING:
                setDisabled(true)
                setButtonText('UPloading')
                break
            case PDF_UPLOAD_STATUS.UNLOAD:
                setDisabled(false)
                setButtonText('Click to Upload')
            default:
                break
        }
    }, [uploadStatus])

    const handleClick = () => {
        setDisabled(true)
        const asnycEffect = async () => {
            if (uploadStatus == PDF_UPLOAD_STATUS.UNLOAD || uploadStatus == PDF_UPLOAD_STATUS.FAILED) {
                const { name } = file || {}
                const isSuccess = await handleUPloadPdf(name)
            }
        }
        asnycEffect()
    }

    return (
        <div className="loading_button">
            <Button variant="primary" disabled={disabled} onClick={handleClick}>
                {buttonText}
            </Button>
        </div>
    )
}
