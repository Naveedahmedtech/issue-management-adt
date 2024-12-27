import React from "react";
import Text from "../../../components/Text";
import { ICommonHeaderProps } from "../../../types/types";

const CommonHeader: React.FC<ICommonHeaderProps> = ({
                                                        children,
                                                        primaryHeading,
                                                        secondaryHeading,
                                                        paragraph,
                                                        type,
                                                        additionBody,
                                                    }) => {
    return (
        <div className="flex justify-center items-center w-full bg-background h-screen b p-6">
            <div className="bg-backgroundShade1 p-10 rounded-lg shadow-lg max-w-xl w-full">
                <div className="mb-6">
                    <Text className="text-primary text-4xl font-bold">{primaryHeading}</Text>
                    <Text className="text-text text-lg font-semibold mt-2">{secondaryHeading}</Text>
                    <Text className="text-textLight text-sm mt-2">{paragraph}</Text>
                </div>
                <div className="w-full">
                    {children}
                    {(type === "sign-in" || type === "sign-up") && additionBody}
                </div>
            </div>
        </div>
    );
};

export default CommonHeader;
