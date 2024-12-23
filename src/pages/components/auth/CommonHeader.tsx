import React from "react";
import Text from "../../../components/Text";
import { ICommonHeaderProps } from "../../../types/types";

const CommonHeader: React.FC<ICommonHeaderProps> = ({ children, image, primaryHeading, secondaryHeading, paragraph, type, additionBody }) => {
    return (
        <div className='flex flex-col lg:flex-row w-full h-screen max-w-full overflow-hidden bg-background p-5'>
            <div className='hidden lg:flex lg:w-1/2 w-full h-full items-center justify-center'>
                <img src={image} alt="Descriptive Alt Text" className='w-full h-full object-cover lg:rounded-r-none rounded-b-[28px]' loading="lazy" style={{ height: "100vh" }} />
            </div>
            <div className="lg:w-1/2 w-full flex flex-col justify-center items-center  lg:overflow-y-auto py-8">
                <div className="mb-6 w-full max-w-lg mt-5">
                    <Text className="text-text text-4xl font-bold">{primaryHeading}</Text>
                    <Text className="text-text text-lg font-semibold">{secondaryHeading}</Text>
                    <Text className="text-text text-sm">{paragraph}</Text>
                </div>
                <div className="w-full max-w-lg">
                    {children}
                    {(type === "sign-in" || type === "sign-up") && additionBody}
                </div>
            </div>
        </div>
    );
};

export default CommonHeader;
