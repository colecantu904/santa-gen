import * as React from "react";

interface SendEmailTemplateProps {
  giverFirstName: string;
  receiverFirstName: string;
  receiverLastName: string;
  preferences: string;
}

export function SendEmailTemplate({
  giverFirstName,
  receiverFirstName,
  receiverLastName,
  preferences,
}: SendEmailTemplateProps) {
  return (
    <div className="font-sans max-w-[600px] mx-auto py-10 px-5 bg-gray-50">
      <div className="bg-white rounded-xl p-10 shadow-md">
        <h1 className="text-[#c41e3a] text-[32px] mb-5 text-center">
          🎄 Ho Ho Ho, {giverFirstName}! 🎄
        </h1>
        <p className="text-lg text-gray-800 text-center mb-8">
          You've been selected as the Secret Santa for:
        </p>
        <div className="bg-[#165e3f] text-white py-6 px-6 rounded-lg text-center mb-8">
          <h2 className="text-[28px] m-0 font-bold">
            {receiverFirstName} {receiverLastName}
          </h2>
        </div>
        <div className="bg-[#fff9e6] border-2 border-dashed border-[#c41e3a] rounded-lg p-5 mb-8">
          <h3 className="text-[#c41e3a] text-xl mt-0 mb-4">
            🎁 Their Wish List:
          </h3>
          <p className="text-base text-gray-800 leading-relaxed m-0">
            {preferences}
          </p>
        </div>
        <div className="bg-gray-100 border-l-4 border-[#c41e3a] py-4 px-5 mt-6 rounded">
          <p className="m-0 text-sm text-gray-600 italic">
            🤫 Remember: This is a secret! Keep your assignment confidential and
            spread the holiday cheer!
          </p>
        </div>
      </div>
    </div>
  );
}
