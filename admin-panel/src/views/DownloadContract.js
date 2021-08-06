import React, { useEffect } from 'react'

function b64toBlob(b64Data, contentType, sliceSize) {
  contentType = contentType || ""
  sliceSize = sliceSize || 512

  const byteCharacters = atob(b64Data)
  const byteArrays = []

  for (let offset = 0; offset < byteCharacters.length; offset += sliceSize) {
    const slice = byteCharacters.slice(offset, offset + sliceSize)

    const byteNumbers = new Array(slice.length)
    for (let i = 0; i < slice.length; i++) {
      byteNumbers[i] = slice.charCodeAt(i)
    }

    const byteArray = new Uint8Array(byteNumbers)

    byteArrays.push(byteArray)
  }

  
  return new File(byteArrays, "pot", { type: contentType })
}

function DownloadContract(props) {
  const documentId = props.match.params.document_id
  const downloadContract = () => {
    const myHeaders = new Headers()
    myHeaders.append("Content-Type", "application/x-www-form-urlencoded")

    const urlencoded = new URLSearchParams()
    urlencoded.append("document_id", documentId)

    const requestOptions = {
      method: 'POST',
      headers: myHeaders,
      body: urlencoded,
      redirect: 'follow'
    }

    fetch("https://y8sr1kom3g.execute-api.us-east-1.amazonaws.com/dev/downloadDocument", requestOptions)
      .then(response => response.text())
      .then(result => { 
        // console.log(result)
        const enc = atob(result)
        const file = b64toBlob(result, "application/pdf")
        const fileUrl = window.URL.createObjectURL(file)
        const link = document.createElement('a')
        link.href = fileUrl
        link.setAttribute('download', 'contract.pdf')
        document.body.appendChild(link)
        link.click()
      })
      .catch(error => console.log('error', error))
  }
  useEffect(() => {
    downloadContract()
  }, [])
  return (
    <div>
      Please wait while we download the contract
    </div>
  )
}


export default DownloadContract

