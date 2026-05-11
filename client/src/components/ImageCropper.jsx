import { useState, useCallback } from 'react'
import Cropper from 'react-easy-crop'

const ImageCropper = ({ image, onCropComplete, onCancel, aspect = 1 }) => {
  const [crop, setCrop] = useState({ x: 0, y: 0 })
  const [zoom, setZoom] = useState(1)
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null)

  const onCropChange = (crop) => setCrop(crop)
  const onZoomChange = (zoom) => setZoom(zoom)

  const onCropCompleteInternal = useCallback((croppedArea, croppedAreaPixels) => {
    setCroppedAreaPixels(croppedAreaPixels)
  }, [])

  const getCroppedImg = async () => {
    try {
      const canvas = document.createElement('canvas')
      const img = new Image()
      img.src = image
      await new Promise((resolve) => {
        img.onload = resolve
      })

      const ctx = canvas.getContext('2d')
      canvas.width = croppedAreaPixels.width
      canvas.height = croppedAreaPixels.height

      ctx.drawImage(
        img,
        croppedAreaPixels.x,
        croppedAreaPixels.y,
        croppedAreaPixels.width,
        croppedAreaPixels.height,
        0,
        0,
        croppedAreaPixels.width,
        croppedAreaPixels.height
      )

      return canvas.toDataURL('image/png')
    } catch (e) {
      console.error(e)
      return null
    }
  }

  const handleDone = async () => {
    const croppedImage = await getCroppedImg()
    onCropComplete(croppedImage)
  }

  return (
    <div className="cropper-modal-overlay">
      <div className="cropper-modal-content">
        <div className="cropper-container">
          <Cropper
            image={image}
            crop={crop}
            zoom={zoom}
            aspect={aspect}
            onCropChange={onCropChange}
            onCropComplete={onCropCompleteInternal}
            onZoomChange={onZoomChange}
          />
        </div>
        <div className="cropper-controls">
          <div className="zoom-slider">
            <label>Zoom</label>
            <input
              type="range"
              value={zoom}
              min={1}
              max={3}
              step={0.1}
              aria-labelledby="Zoom"
              onChange={(e) => setZoom(e.target.value)}
            />
          </div>
          <div className="cropper-actions">
            <button className="btn btn-secondary" onClick={onCancel}>Cancel</button>
            <button className="btn btn-primary" onClick={handleDone}>Crop & Save</button>
          </div>
        </div>
      </div>

      <style>{`
        .cropper-modal-overlay {
          position: fixed;
          top: 0; left: 0; right: 0; bottom: 0;
          background: rgba(0,0,0,0.8);
          display: flex; align-items: center; justify-content: center;
          z-index: 10000;
          backdrop-filter: blur(5px);
        }
        .cropper-modal-content {
          background: #1a1a2e;
          width: 90%; max-width: 500px;
          border-radius: 16px;
          overflow: hidden;
          box-shadow: 0 20px 40px rgba(0,0,0,0.4);
          border: 1px solid rgba(255,255,255,0.1);
        }
        .cropper-container {
          position: relative;
          width: 100%; height: 400px;
          background: #000;
        }
        .cropper-controls {
          padding: 20px;
          background: #1a1a2e;
        }
        .zoom-slider {
          display: flex; align-items: center; gap: 15px;
          margin-bottom: 20px; color: #fff;
        }
        .zoom-slider input { flex: 1; }
        .cropper-actions {
          display: flex; justify-content: flex-end; gap: 10px;
        }
      `}</style>
    </div>
  )
}

export default ImageCropper
