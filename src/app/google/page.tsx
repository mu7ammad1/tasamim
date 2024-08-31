"use client";
import React, { useState } from "react";
import * as tf from "@tensorflow/tfjs";
import * as mobilenet from "@tensorflow-models/mobilenet";
import "@tensorflow/tfjs-backend-webgl"; // تأكد من استيراد backend المناسب

const ImageAnalyzer = () => {
  const [image, setImage] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [results, setResults] = useState<any[]>([]);
  const [model, setModel] = useState<any>(null);

  // تحميل النموذج عند تحميل المكون
  React.useEffect(() => {
    const loadModel = async () => {
      await tf.setBackend('webgl'); // أو 'cpu' إذا كنت لا تستخدم WebGL
      const loadedModel = await mobilenet.load();
      setModel(loadedModel);
    };
    loadModel();
  }, []);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const imageURL = URL.createObjectURL(file);
      setImage(imageURL);
      setImageFile(file); // تخزين الملف لتحليله لاحقاً
    }
  };

  const handleAnalyzeImage = async () => {
    if (model && imageFile) {
      const imgElement = document.getElementById("uploadedImage") as HTMLImageElement;
      if (imgElement) {
        const predictions = await model.classify(imgElement);
        setResults(predictions);
      }
    }
  };

  return (
    <div>
      <input type="file" onChange={handleImageUpload} />
      {image && (
        <div>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img id="uploadedImage" src={image} alt="Uploaded" width="300" />
        </div>
      )}
      <button onClick={handleAnalyzeImage} disabled={!imageFile}>
        تحليل الصورة
      </button>
      {results.length > 0 && (
        <div>
          <h3>الكلمات المفتاحية المستخرجة:</h3>
          <ul>
            {results.map((result, index) => (
              <li key={index}>
                {result.className}: {Math.round(result.probability * 100)}%
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default ImageAnalyzer;
