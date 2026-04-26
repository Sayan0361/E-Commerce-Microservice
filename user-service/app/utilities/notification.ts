import { SNSClient, PublishCommand } from "@aws-sdk/client-sns";

const sns = new SNSClient({ region: "ap-south-1" });

export const GenerateAccessCode = () => {
    // generate a random 5-digit code
    const code = Math.floor(10000 + Math.random() * 90000);
    let expiry = new Date();
    // expiry set to current time + 10 minutes
    expiry.setTime(new Date().getTime() + 10 * 60 * 1000);
    return {
        code,
        expiry
    };
}

export const SendVerificationCode = async (phone: string, code: number) => {
    const params = {
        Message: `Your OTP is ${code}. Valid for 10 minutes.`,
        PhoneNumber: phone,
        MessageAttributes: {
            "AWS.SNS.SMS.SMSType": {
                DataType: "String",
                StringValue: "Transactional",
            },
        },
    };

    try {
        const command = new PublishCommand(params);
        const response = await sns.send(command);

        console.log("SNS Response:", response);
        return response;

    } catch (error) {
        console.error("SNS Error:", error);
        throw error;
    }
};