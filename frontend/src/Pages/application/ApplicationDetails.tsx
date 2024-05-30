import React, { useState, useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
import Calendar, { CalendarProps } from 'react-calendar';
import 'react-calendar/dist/Calendar.css'; // Import CSS for the calendar
import clothes_1 from "../../Assets/Img/clothes_1.png";
import clothes_2 from "../../Assets/Img/clothes_2.png";
import clothes_3 from "../../Assets/Img/clothes_3.png";
import { EditFieldProps } from "../../Typings/Application/Applicattion";
import Postcode from "../../Components/postcode/Postcode"; // Import the Postcode component

const EditField: React.FC<EditFieldProps> = ({ label, defaultValue }) => (
    <div className="mb-2">
        <label className="block font-semibold">{label}</label>
        <input
            type="text"
            className="w-full rounded border p-2 text-gray-400"
            defaultValue={defaultValue}
        />
    </div>
);

const OrderItem: React.FC<{ item: { image: string, name: string, description: string, price: string } }> = ({ item }) => (
    <div className="mb-2 flex items-center border rounded-lg p-2">
        <img
            src={item.image}
            alt="Laundry Item"
            className="mr-4 h-16 w-16"
        />
        <div>
            <p className="font-semibold">{item.name}</p>
            <p>{item.description}</p>
            <p>{item.price}</p>
        </div>
    </div>
);

const ApplicationDetails: React.FC = () => {
    const location = useLocation();
    const { title } = location.state || { title: "서비스 선택" };

    const [isPostcodeOpen, setIsPostcodeOpen] = useState(false);
    const [address, setAddress] = useState("");
    const [pickupDate, setPickupDate] = useState<Date | null>(null);
    const [deliveryDate, setDeliveryDate] = useState<Date | null>(null);
    const [isPickupCalendarOpen, setIsPickupCalendarOpen] = useState(false);
    const [isDeliveryCalendarOpen, setIsDeliveryCalendarOpen] = useState(false);

    const pickupCalendarRef = useRef<HTMLDivElement>(null);
    const deliveryCalendarRef = useRef<HTMLDivElement>(null);

    const handleAddressClick = () => {
        setIsPostcodeOpen(true);
    };

    const handleAddressComplete = (selectedAddress: string) => {
        setAddress(selectedAddress);
        setIsPostcodeOpen(false);
    };

    const handleModalClick = (event: React.MouseEvent<HTMLDivElement>) => {
        if (event.target === event.currentTarget) {
            setIsPostcodeOpen(false);
        }
    };

    const handlePickupDateChange: CalendarProps['onChange'] = (value) => {
        setPickupDate(value as Date);
        setIsPickupCalendarOpen(false);
    };

    const handleDeliveryDateChange: CalendarProps['onChange'] = (value) => {
        setDeliveryDate(value as Date);
        setIsDeliveryCalendarOpen(false);
    };

    const handleClickOutside = (event: MouseEvent) => {
        if (
            pickupCalendarRef.current &&
            !pickupCalendarRef.current.contains(event.target as Node)
        ) {
            setIsPickupCalendarOpen(false);
        }
        if (
            deliveryCalendarRef.current &&
            !deliveryCalendarRef.current.contains(event.target as Node)
        ) {
            setIsDeliveryCalendarOpen(false);
        }
    };

    useEffect(() => {
        if (isPickupCalendarOpen || isDeliveryCalendarOpen) {
            document.addEventListener("mousedown", handleClickOutside);
        } else {
            document.removeEventListener("mousedown", handleClickOutside);
        }

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [isPickupCalendarOpen, isDeliveryCalendarOpen]);

    const orderItems = [
        {
            image: clothes_1,
            name: "맞춤 세탁",
            description: "일반 의류 다림질 항균 추가",
            price: "30,000원"
        },
        {
            image: clothes_2,
            name: "프리미엄 세탁",
            description: "고급 의류 다림질 항균 추가",
            price: "50,000원"
        },
        {
            image: clothes_3,
            name: "신속 세탁",
            description: "신속 의류 다림질 항균 추가",
            price: "40,000원"
        },
        {
            image: clothes_3,
            name: "신속 세탁",
            description: "신속 의류 다림질 항균 추가",
            price: "40,000원"
        },
        {
            image: clothes_3,
            name: "신속 세탁",
            description: "신속 의류 다림질 항균 추가",
            price: "40,000원"
        },
        {
            image: clothes_3,
            name: "신속 세탁",
            description: "신속 의류 다림질 항균 추가",
            price: "40,000원"
        },

    ];

    return (
        <div className="container mx-auto mt-5 w-full p-5 lg:w-2/3 lg:px-0">
            <header className="mb-5 border-b border-black pb-5">
                <h1 className="text-xl font-bold lg:text-3xl">결제 페이지</h1>
            </header>

            <div className="flex flex-col lg:flex-row lg:gap-5">
                <div className="flex flex-col gap-5 lg:w-3/4">
                    <div className="flex flex-col rounded-lg h-2/3 border p-5 shadow-md ">
                        <h2 className="mb-4 text-xl font-bold">주문상품</h2>
                        <div className="overflow-auto pr-5">
                            {orderItems.map((item, index) => (
                                <OrderItem key={index} item={item} />
                            ))}
                        </div>

                        <div className="mt-auto rounded bg-blue-500 p-4 text-center text-white">
                            <p className="text-lg font-bold">총 주문금액</p>
                            <p className="text-xl font-bold">120,000원</p>
                        </div>
                    </div>

                    <div className="flex flex-col justify-center rounded-lg h-1/3 border p-5 shadow-md">
                        <h2 className="mb-4 text-xl font-bold">수거일/배송일</h2>
                        <div className="mb-2 relative">
                            <label className="block font-semibold">수거일</label>
                            <input
                                type="text"
                                className="w-full rounded border p-2"
                                value={pickupDate ? pickupDate.toLocaleDateString() : ""}
                                onClick={() => setIsPickupCalendarOpen(true)}
                                readOnly
                                placeholder="수거일을 선택해주세요"
                            />
                            {isPickupCalendarOpen && (
                                <div className="absolute z-50" ref={pickupCalendarRef}>
                                    <Calendar
                                        onChange={handlePickupDateChange}
                                        value={pickupDate}
                                    />
                                </div>
                            )}
                        </div>
                        <div className="mb-2 relative">
                            <label className="block font-semibold">배송일</label>
                            <input
                                type="text"
                                className="w-full rounded border p-2"
                                value={deliveryDate ? deliveryDate.toLocaleDateString() : ""}
                                onClick={() => setIsDeliveryCalendarOpen(true)}
                                readOnly
                                placeholder="배송일을 선택해주세요"
                            />
                            {isDeliveryCalendarOpen && (
                                <div className="absolute z-50" ref={deliveryCalendarRef}>
                                    <Calendar
                                        onChange={handleDeliveryDateChange}
                                        value={deliveryDate}
                                    />
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                <div className="flex flex-col gap-5 lg:w-1/2">
                    <div className="flex flex-col justify-center rounded-lg h-2/3 border p-5 shadow-md">
                        <h2 className="mb-4 text-xl font-bold">수거/배송 정보</h2>
                        <EditField label="이름" defaultValue="이용준" />
                        <EditField label="연락처" defaultValue="010-3043-4930" />
                        <div className="mb-2">
                            <label className="block font-semibold">주소</label>
                            <input
                                type="text"
                                className="w-full rounded border p-2"
                                value={address}
                                onClick={handleAddressClick}
                                readOnly
                                placeholder="주소를 입력해주세요"
                            />
                        </div>
                        <EditField label="상세 주소" defaultValue="상세 주소를 입력해주세요" />
                        <EditField label="수거 장소" defaultValue="문 앞" />
                        <EditField label="배송 장소" defaultValue="문 앞" />
                    </div>

                    <div className="flex flex-col justify-center rounded-lg h-1/3 border p-5 shadow-md">
                        <h2 className="mb-4 text-xl font-bold">포인트 혜택</h2>
                        <div className="mb-2 flex justify-between">
                            <p>구매적립</p>
                            <p>총 199점</p>
                        </div>
                        <div className="mb-2 flex justify-between">
                            <p>기본적립</p>
                            <p>100점</p>
                        </div>
                        <div className="mb-2 flex justify-between">
                            <p>추가적립</p>
                            <p>최대 150점</p>
                        </div>
                        <p className="text-right text-blue-500">최대 300점 적립</p>
                    </div>

                    <div className="flex flex-col justify-center rounded-lg h-1/3 border p-5 shadow-md">
                        <h2 className="mb-4 text-xl font-bold">결제수단</h2>
                        <div className="mb-2">
                            <label className="mb-2 flex items-center">
                                <input type="radio" name="payment" className="mr-2" /> 카드 결제
                            </label>
                            <div className="ml-4">
                                <select className="mb-2 w-full rounded border p-2">
                                    <option>카드를 선택해주세요</option>
                                    <option>카드 1</option>
                                    <option>카드 2</option>
                                </select>
                                <input
                                    type="text"
                                    placeholder="할부개월수 입력"
                                    className="w-full rounded border p-2"
                                />
                            </div>
                        </div>
                        <div className="mb-2">
                            <label className="mb-2 flex items-center">
                                <input type="radio" name="payment" className="mr-2" /> 계좌 이체
                            </label>
                        </div>
                    </div>
                </div>
            </div>

            <div className="mt-10 text-center">
                <button className="rounded-lg bg-blue-500 px-6 py-3 text-xl text-white">
                    세탁 신청완료
                </button>
            </div>

            {isPostcodeOpen && (
                <div
                    className="fixed inset-0 flex px-5 items-center justify-center bg-gray-900 bg-opacity-50 z-50 lg:px-0"
                    onClick={handleModalClick}
                >
                    <div className="bg-white p-4 rounded-lg w-full max-w-md">
                        <Postcode onComplete={handleAddressComplete} />
                    </div>
                </div>
            )}
        </div>
    );
};

export default ApplicationDetails;
