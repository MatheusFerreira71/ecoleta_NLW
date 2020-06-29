import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { FiUpload } from 'react-icons/fi';

interface Props {
    onFileUploaded: (file: File) => void 
}

const Dropzone: React.FC<Props> = ({ onFileUploaded }) => {

    const [selectedFileUrl, setSelectedFileUrl] = useState('');
    const onDrop = useCallback(acceptedFile => {
        const file = acceptedFile[0];
        const fileUrl = URL.createObjectURL(file);
        setSelectedFileUrl(fileUrl);
        onFileUploaded(file);
    }, [onFileUploaded])

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: 'image/*'
    });

    return (
        <div className="dropzone" {...getRootProps()}>
            <input {...getInputProps()} accept="image/*" />
            {
                selectedFileUrl ?
                    <img src={selectedFileUrl} alt="Point Thumbnail" />
                    :
                    (
                        isDragActive ?
                            <p>Solte a imagem aqui...</p> :
                            <p>
                                <FiUpload />
                            Arraste e solte uma imagem aqui, ou clique para selecionar.
                        </p>
                    )
            }
        </div>
    );
}

export default Dropzone;