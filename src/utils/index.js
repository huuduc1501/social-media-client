export const uploadImage = async (file) => {
    const imageData = new FormData();
    imageData.append("file", file);
    imageData.append("upload_preset", process.env.REACT_APP_CLOUDINARY_UPLOAD_PRESET)
    try {
        const data = await fetch(process.env.REACT_APP_CLOUDINARY_ENDPOINT, {
            method: "POST",
            body: imageData
        })
        return (await data.json()).url
    } catch (error) {
        console.error(error)
        return error
    }
}

export const clickOutsideRef = (contentRef, toggleRef) => {

    document.addEventListener('mousedown', (e) => {
        // user click toggle
        if (toggleRef.current && toggleRef.current.contains(e.target)) {
            contentRef.current.classList.toggle('active')

        } else {
            // user click outside toggle and content
            if (contentRef.current && !contentRef.current.contains(e.target)) {
                contentRef.current.classList.remove('active')
            }
        }
    })
}

export const uploadToServer = async (files) => {
    const fileData = new FormData()
    files.forEach(file => {
        if (file.type.includes('image'))
            fileData.append('image', file.originFileObj)
        else {
            fileData.append('file', file.originFileObj)
        }
    })
    const data = await fetch(`${process.env.REACT_APP_API_ENDPOINT}/upload`, {
        method: 'POST',
        body: fileData,
        headers: {

        }
    })
    return await data.json()
}