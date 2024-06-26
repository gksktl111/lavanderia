import React from 'react';

interface CardComponentProps {
    imgSrc: string;
    title: string;
    description: string;
    isReversed?: boolean;
}

const CardComponent: React.FC<CardComponentProps> = ({ imgSrc, title, description  }) => {
    const formattedDescription = description.split('\n').map((line, index) => (
        <React.Fragment key={index}>
            {line}
            <br />
        </React.Fragment>
    ));

    return (
        <div className={`mb-16 flex justify-between items-center flex-col sm:flex-row p-4 w-full `}>
            <div>
                <img src={imgSrc} className=" object-cover" alt={title} />
            </div>
            <div className="sm:w-1/2 flex flex-col justify-center  sm:text-left md:ml-4">
                <h4 className="mb-4 text-2xl mt-4 sm:mt-0">{title}</h4>
                <p className="text-base text-gray-500">{formattedDescription}</p>
            </div>
        </div>
    );
};

export default CardComponent;