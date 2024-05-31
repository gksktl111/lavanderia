import React, { useState } from 'react';
import FloatingCartButton from "../../Components/floatingCart/FloatingCartButton";

const ApplicationDetails: React.FC = () => {
    const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
    const [amount, setAmount] = useState<number | null>(null);

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(event.target.files || []);
        setSelectedFiles(files);
    };

    const uploadFilesAndCalculateAmount = async () => {
        const formData = new FormData();
        selectedFiles.forEach(file => {
            formData.append('files', file);
        });

        console.log("이미지 보냄")
        
        try {
            const response = await fetch('http://localhost:8080/calculate-amount', {
                method: 'POST',
                body: formData,
            });
            const data = await response.json();
            setAmount(data.amount);
        } catch (error) {
            console.error('Error uploading files:', error);
        }
    };

    const handleAddToBasket = () => {
        alert(`세탁물 바구니에 추가되었습니다: 총 금액 ${amount} KRW`);
    };

    return (
        <div className="mx-auto mt-5 w-full lg:h-[500px] lg:w-2/3 lg:mt-5 lg:pr-0 3xl:h-[700px]">
            <h1 className="text-2xl font-bold mb-5">세탁 신청 상세</h1>

            <div className="mb-5">
                <label className="block font-semibold mb-2">사진 업로드</label>
                <input type="file" multiple onChange={handleFileChange} className="w-full p-2 border rounded" />
                <div className="mt-3 flex flex-wrap">
                    {selectedFiles.map((file, index) => (
                        <img
                            key={index}
                            src={URL.createObjectURL(file)}
                            alt="laundry"
                            className="w-32 h-32 object-cover mr-2 mb-2"
                        />
                    ))}
                </div>
            </div>

            <div className="mb-5">
                <button onClick={uploadFilesAndCalculateAmount} className="w-full px-4 py-2 bg-blue-500 text-white rounded">금액 계산</button>
                {amount !== null && (
                    <div className="mt-3">
                        <p className="text-lg font-semibold">계산된 금액: {amount} KRW</p>
                    </div>
                )}
            </div>

            <button onClick={handleAddToBasket} className="w-full px-6 py-3 bg-green-500 text-white rounded">
                세탁물 바구니에 추가
            </button>
            <FloatingCartButton/>
        </div>
    );
};

export default ApplicationDetails;