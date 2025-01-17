"use client";

import React, { useState, useRef, useEffect } from "react";
// Update the import to use available icons
import { Camera, RefreshCcw, RotateCcw } from "lucide-react";
import { Loader2 } from "lucide-react";

const ClothingClassifier = () => {
  // States for managing camera and classification
  const [hasPermission, setHasPermission] = useState(false);
  const [isStreaming, setIsStreaming] = useState(false);
  const [isFrontCamera, setIsFrontCamera] = useState(false);
  const [capturedImage, setCapturedImage] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState(null);

  // Refs for accessing DOM elements
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const streamRef = useRef(null);

  // Request camera permission and setup
  const setupCamera = async (useFrontCamera = false) => {
    try {
      setIsLoading(true);
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
      }

      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: useFrontCamera ? "user" : "environment",
          width: { ideal: 1280 },
          height: { ideal: 720 },
        },
      });

      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
      setHasPermission(true);
      setIsStreaming(true);
      setIsFrontCamera(useFrontCamera);
    } catch (err) {
      console.error("Error accessing camera:", err);
      setHasPermission(false);
    } finally {
      setIsLoading(false);
    }
  };

  // Capture image from video stream
  const captureImage = () => {
    if (videoRef.current && canvasRef.current) {
      const canvas = canvasRef.current;
      const video = videoRef.current;

      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;

      const ctx = canvas.getContext("2d");
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

      const imageData = canvas.toDataURL("image/jpeg");
      setCapturedImage(imageData);

      // Real API
      classifyImage(imageData);
    }
  };

  // Real API
  const classifyImage = async (imageData) => {
    setIsLoading(true);
    try {
      // Convert base64 to blob
      const base64Response = await fetch(imageData);
      const blob = await base64Response.blob();

      // Create form data
      const formData = new FormData();
      formData.append("file", blob, "image.jpg");

      // Send to backend
      const response = await fetch("http://localhost:8000/api/v1/classify", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();
      setResult(data.prediction);
    } catch (error) {
      console.error("Classification error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Switch between front and back cameras
  const switchCamera = () => {
    setupCamera(!isFrontCamera);
  };

  // Reset captured image and results
  const resetCapture = () => {
    setCapturedImage(null);
    setResult(null);
  };

  // Cleanup on component unmount
  useEffect(() => {
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
      }
    };
  }, []);

  return (
    <div className="w-full max-w-2xl mx-auto p-4 space-y-4">
      <h1 className="text-2xl font-bold text-center">Clothing Classifier</h1>

      {/* Main display area */}
      <div className="relative aspect-video bg-gray-100 rounded-lg overflow-hidden">
        {!capturedImage ? (
          <video
            ref={videoRef}
            autoPlay
            playsInline
            className="w-full h-full object-cover"
          />
        ) : (
          <img
            src={capturedImage}
            alt="Captured clothing"
            className="w-full h-full object-contain"
          />
        )}

        {/* Loading Overlay */}
        {isLoading && (
          <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <Loader2 className="w-8 h-8 text-white animate-spin" />
          </div>
        )}

        {/* Control buttons */}
        <div className="absolute bottom-4 right-4 space-x-2 flex">
          {!isStreaming ? (
            <button
              onClick={() => setupCamera(false)}
              className="bg-blue-500 text-white p-2 rounded-full hover:bg-blue-600 disabled:opacity-50"
              disabled={isLoading}
              title="Start camera"
            >
              <Camera className="w-6 h-6" />
            </button>
          ) : !capturedImage ? (
            <>
              <button
                onClick={switchCamera}
                className="bg-blue-500 text-white p-2 rounded-full hover:bg-blue-600 disabled:opacity-50"
                disabled={isLoading}
                title="Switch camera"
              >
                <RotateCcw className="w-6 h-6" />
              </button>
              <button
                onClick={captureImage}
                className="bg-green-500 text-white p-2 rounded-full hover:bg-green-600 disabled:opacity-50"
                disabled={isLoading}
                title="Capture image"
              >
                <Camera className="w-6 h-6" />
              </button>
            </>
          ) : (
            <button
              onClick={resetCapture}
              className="bg-blue-500 text-white p-2 rounded-full hover:bg-blue-600 disabled:opacity-50"
              disabled={isLoading}
              title="Retake photo"
            >
              <RefreshCcw className="w-6 h-6" />
            </button>
          )}
        </div>
      </div>

      {/* Hidden canvas for image capture */}
      <canvas ref={canvasRef} className="hidden" />

      {/* Permission message */}
      {!hasPermission && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          <p className="font-bold">Camera Access Required</p>
          <p>Please allow camera access to use the clothing classifier.</p>
        </div>
      )}

      {/* Instructions */}
      <div className="text-sm text-gray-500 text-center">
        {!isStreaming
          ? "Click the camera icon to start"
          : !capturedImage
          ? "Position the clothing item in frame and take a photo"
          : "Review your captured image"}
      </div>

      {/* Results Display */}
      {result && (
        <div className="mt-4 p-4 bg-white rounded-lg shadow space-y-2">
          <h2 className="text-lg font-semibold text-gray-800">
            Classification Results
          </h2>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm font-semibold text-gray-800">Type</p>
              <p className="font-medium text-gray-800">{result.type}</p>
            </div>
            <div>
              <p className="text-sm font-semibold text-gray-800">Color</p>
              <p className="font-medium text-gray-800">{result.color}</p>
            </div>
            <div className="col-span-2">
              <p className="text-sm font-semibold text-gray-800">Confidence</p>
              <div className="w-full bg-gray-200 rounded-full h-2.5">
                <div
                  className="bg-blue-600 h-2.5 rounded-full"
                  style={{ width: `${result.confidence}%` }}
                ></div>
              </div>
              <p className="text-sm text-right mt-1 text-gray-800">
                {result.confidence}%
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ClothingClassifier;
