import React from 'react'
import Script from 'react-imvc/component/Script'

export default function Page(props) {
    const locale = 'zh-CN'
    return (
        <html lang={locale}>
            <head>
                <meta httpEquiv="Content-Type" content="text/html; charset=utf-8" />
                <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
                <meta name="viewport" content="width=device-width, initial-scale=1.0, minimal-ui" />
                <meta name="apple-mobile-web-app-capable" content="yes" />
                <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
                <title>{props.title}</title>
                <meta name="description" content={props.description} />
                <link
                    rel="stylesheet"
                    href="https://cdn.jsdelivr.net/npm/bootstrap@5.2.3/dist/css/bootstrap.min.css"
                    integrity="sha384-rbsA2VBKQhggwzxH7pPCaAqO46MgnOM80zW1RWuH61DGLwZJEdK2Kadq2F9CUG65"
                    crossOrigin="anonymous"
                />
                <link href={`${props.publicPath}/css/page.css`} rel="stylesheet" type="text/css" />
            </head>
            <body>
                <div id="root" dangerouslySetInnerHTML={{ __html: props.content }} />
                <div id="modal" />
                <Script>
                    {`
                    (function() {
                        window.__APP_SETTINGS__ = ${JSON.stringify(props.appSettings)}
                        window.__PUBLIC_PATH__ = '${props.publicPath}'
                    })()
                `}
                </Script>
                <script src={`${props.publicPath}/${props.assets.vendor}`} />
                <script src={`${props.publicPath}/${props.assets.index}`} />
            </body>
        </html>
    )
}
